require('dotenv').config()
const { Migrator } = require('@pgkit/migrator')
const { createClient } = require('@pgkit/client')

const DB_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
// in an existing project, this may be setup in another module
const client = createClient(DB_URL) // e.g. 'postgresql://postgres:postgres@localhost:5433/postgres'

const migrator = new Migrator({
  migrationsPath: __dirname + '/migrations',
  migrationTableName: 'migration',
  client,
  logger: Migrator.prettyLogger,
})

migrator.runAsCLI()
