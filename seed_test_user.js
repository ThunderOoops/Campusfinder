import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!key || key === 'your-service-role-key') {
  console.error('ERROR: You must set VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file to run this script.')
  process.exit(1)
}

const supabase = createClient(url, key)

async function createTestUser() {
  const email = `test_student_${Date.now()}@campus.edu`
  const password = 'Password123!'

  console.log(`Creating user ${email}...`)
  
  // Create the user bypassing rate limits and auto-confirming
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Test Student',
      branch: 'Computer Science',
      year: 1
    }
  })

  if (authError) {
    console.error('Failed to create user:', authError.message)
    return
  }

  console.log('Successfully created user!')
  console.log('--------------------------------')
  console.log('You can now log into the React app with:')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log('--------------------------------')
}

createTestUser()
