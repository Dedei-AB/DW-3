import db from '../database/drizzle.js'
import pool from '../db.js'
import { projetos } from '../database/schema.js'

try {
  const lista = await db.select().from(projetos).orderBy(projetos.id)

  console.log('Projetos:')
  console.table(lista)
} finally {
  await pool.end()
}