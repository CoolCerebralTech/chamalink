import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // 👈 This is the magic key. It makes the service visible everywhere.
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class DatabaseModule {}
