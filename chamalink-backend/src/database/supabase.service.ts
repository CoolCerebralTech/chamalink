import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  // Use 'any' internally to stop the strict initialization error
  private client: any;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('supabase.url');
    const key = this.configService.get<string>('supabase.key');

    if (!url || !key) {
      throw new Error('Supabase URL or Key is missing in .env file');
    }

    this.client = createClient(url, key);
  }

  // The return type is strictly typed when called
  getClient<T = any>(): SupabaseClient<T> {
    return this.client as SupabaseClient<T>;
  }
}
