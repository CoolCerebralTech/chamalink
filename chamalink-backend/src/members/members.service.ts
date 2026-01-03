import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateMemberDto, Database, UpdateMemberStatusDto } from '../types';
import { WhatsappUtil } from '../utils/whatsapp.util';

@Injectable()
export class MembersService {
  constructor(private readonly supabase: SupabaseService) {}

  private getClient() {
    return this.supabase.getClient<Database>();
  }

  // 1. Join a Group (Public)
  async join(code: string, dto: CreateMemberDto) {
    const client = this.getClient();

    // First, find the contribution ID using the short code
    const { data: contribution, error: findError } = await client
      .from('contributions')
      .select('id')
      .eq('code', code)
      .single();

    if (findError || !contribution) {
      throw new NotFoundException('Invalid Group Code');
    }

    // Insert the member
    const { data, error } = await client
      .from('members')
      .insert({
        contribution_id: contribution.id,
        name: dto.name,
        amount: dto.amount,
        status: 'pending',
      } as any) // Failsafe cast
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException('Could not join group');
    }

    return data;
  }

  // 2. List Members (Admin Only)
  async getMembers(adminToken: string) {
    const contribution = await this.verifyAdmin(adminToken);

    const { data, error } = await this.getClient()
      .from('members')
      .select('*')
      .eq('contribution_id', contribution.id)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);

    return {
      group: contribution.title,
      members: data,
    };
  }

  // 3. Update Status (Admin Only)
  async updateStatus(memberId: string, dto: UpdateMemberStatusDto) {
    // Verify admin has rights to this group
    await this.verifyAdmin(dto.admin_token);

    const { data, error } = await this.getClient()
      .from('members')
      .update({ status: dto.status })
      .eq('id', memberId)
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException('Failed to update status');

    return data;
  }

  // 4. Generate WhatsApp Summary
  async getWhatsappSummary(adminToken: string) {
    const contribution = await this.verifyAdmin(adminToken);

    // Get all members
    const { data: members } = await this.getClient()
      .from('members')
      .select('*')
      .eq('contribution_id', contribution.id);

    if (!members) return 'No members yet.';

    // Use our creative utility
    return {
      text: WhatsappUtil.generateUpdate(contribution.title, members as any),
    };
  }

  // Helper: Verifies the Admin Token and returns the Group ID
  private async verifyAdmin(token: string) {
    const { data, error } = await this.getClient()
      .from('contributions')
      .select('id, title')
      .eq('admin_token', token)
      .single();

    if (error || !data) {
      throw new UnauthorizedException('Invalid Admin Link');
    }

    return data;
  }
}
