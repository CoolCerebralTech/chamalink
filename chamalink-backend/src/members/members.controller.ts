import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberStatusDto } from '../types';

@Controller('members')
export class MembersController {
  constructor(private readonly service: MembersService) {}

  // Join Group: POST /members/:code
  @Post(':code')
  async join(
    @Param('code') code: string,
    @Body(new ValidationPipe()) dto: CreateMemberDto,
  ) {
    return this.service.join(code, dto);
  }

  // Get List: GET /members/admin/:token
  @Get('admin/:token')
  async getMembers(@Param('token') token: string) {
    return this.service.getMembers(token);
  }

  // Get WhatsApp Text: GET /members/whatsapp/:token
  @Get('whatsapp/:token')
  async getWhatsapp(@Param('token') token: string) {
    return this.service.getWhatsappSummary(token);
  }

  // Update Status: PATCH /members/:id
  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) dto: UpdateMemberStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }
}
