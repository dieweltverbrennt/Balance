import { Module } from '@nestjs/common';

import { pool } from '../database';

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useValue: pool,
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
