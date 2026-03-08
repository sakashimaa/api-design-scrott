import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '../db/schema.ts'

export type Tx = NodePgDatabase<typeof schema>
