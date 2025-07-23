import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsEvent {
  page: string;
  user_agent?: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const { page, user_agent } = await req.json() as AnalyticsEvent
      
      // Create analytics table if it doesn't exist
      const { error: createError } = await supabaseClient.rpc('create_analytics_table_if_not_exists')
      
      if (createError && !createError.message.includes('already exists')) {
        console.error('Error creating analytics table:', createError)
      }

      // Insert analytics event
      const { error } = await supabaseClient
        .from('analytics_events')
        .insert([
          {
            page,
            user_agent,
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Error inserting analytics:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (req.method === 'GET') {
      // Get analytics summary
      const { data, error } = await supabaseClient
        .from('analytics_events')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

      if (error) {
        console.error('Error fetching analytics:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      const totalViews = data?.length || 0
      const uniquePages = new Set(data?.map(event => event.page)).size
      const lastUpdated = data?.length > 0 ? new Date(Math.max(...data.map(event => new Date(event.created_at).getTime()))) : new Date()

      return new Response(
        JSON.stringify({ 
          totalViews, 
          uniquePages, 
          lastUpdated: lastUpdated.toISOString(),
          events: data 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in analytics function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})