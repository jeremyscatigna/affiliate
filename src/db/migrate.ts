import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, migrationClient } from './index'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function main() {
  console.log('Running migrations...')
  
  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('Migrations completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await migrationClient.end()
    process.exit(0)
  }
}

main()