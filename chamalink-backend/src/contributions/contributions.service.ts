import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CodeUtil } from '../utils/code.util';
import { CreateContributionDto, Database } from '../types';

@Injectable()
export class ContributionsService {
  constructor(private readonly supabase: SupabaseService) {}

  private getClient() {
    return this.supabase.getClient<Database>();
  }

  // 1. Create a new Contribution Group
  async create(dto: CreateContributionDto) {
    const client = this.getClient();

    const code = await this.generateUniqueCode();
    const adminToken = CodeUtil.generateAdminToken();

    // Prepare the payload
    const payload = {
      title: dto.title,
      description: dto.description || `Collection for ${dto.title}`,
      whatsapp_link: dto.whatsapp_link || null,
      code: code,
      admin_token: adminToken,
    };

    const { data, error } = await client
      .from('contributions')
      // FAILSAFE: Cast to 'any' if TypeScript is still stubborn
      .insert(payload as any)
      .select()
      .single();

    if (error) {
      const msg = error.message || 'Unknown DB Error';
      throw new InternalServerErrorException('Failed to create group: ' + msg);
    }

    return data;
  }

  // ... (keep the rest of the file the same) ...

  // 2. Public View
  async getByCode(code: string) {
    const { data, error } = await this.getClient()
      .from('contributions')
      .select('code, title, description, whatsapp_link, created_at')
      .eq('code', code)
      .single();

    if (error || !data) {
      throw new NotFoundException('Group not found. Check the code.');
    }

    return data;
  }

  // 3. Admin View
  async getByAdminToken(token: string) {
    const { data, error } = await this.getClient()
      .from('contributions')
      .select('*')
      .eq('admin_token', token)
      .single();

    if (error || !data) {
      throw new NotFoundException('Invalid Admin Link.');
    }

    return data;
  }

  private async generateUniqueCode(): Promise<string> {
    let isUnique = false;
    let code = '';

    for (let i = 0; i < 5; i++) {
      code = CodeUtil.generateShortCode();
      const { count } = await this.getClient()
        .from('contributions')
        .select('id', { count: 'exact', head: true })
        .eq('code', code);

      if (count === 0 || count === null) {
        isUnique = true;
        break;
      }
    }

    if (!isUnique)
      throw new InternalServerErrorException('System busy, please try again.');
    return code;
  }
}
