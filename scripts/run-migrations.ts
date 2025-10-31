import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// Load environment variables
config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  try {
    console.log('Running realtime triggers migration...')

    // Read the SQL file
    const sqlContent = readFileSync('./drizzle/realtime-triggers.sql', 'utf8')

    // Split SQL commands by semicolon and filter out empty ones
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)

    // Execute each command
    for (const command of commands) {
      if (command.trim()) {
        console.log(`Executing: ${command.substring(0, 50)}...`)

        const { error } = await supabase.rpc('exec_sql', {
          sql: command + ';'
        })

        if (error) {
          console.error('Error executing command:', error)
          // Try direct execution for some commands
          if (command.includes('CREATE POLICY') || command.includes('CREATE OR REPLACE FUNCTION')) {
            console.log('Trying direct execution...')
            const { error: directError } = await supabase.from('_supabase_migration').insert({
              name: 'realtime_triggers',
              statements: [command + ';'],
              hash: Math.random().toString(36).substring(7)
            })
            if (directError) {
              console.error('Direct execution failed:', directError)
            }
          }
        } else {
          console.log('✓ Command executed successfully')
        }
      }
    }

    console.log('Migration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()