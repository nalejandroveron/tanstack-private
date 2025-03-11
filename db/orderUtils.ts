import { asc, desc } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

export function applyOrderDirection(
  column: PgColumn,
  direction: 'asc' | 'desc',
) {
  return direction === 'asc' ? asc(column) : desc(column);
}
