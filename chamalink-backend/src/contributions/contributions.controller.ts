import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from '../types';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly service: ContributionsService) {}

  // Create: POST /contributions
  @Post()
  async create(@Body(new ValidationPipe()) dto: CreateContributionDto) {
    return this.service.create(dto);
  }

  // Member View: GET /contributions/code/AB3K9
  @Get('code/:code')
  async getPublic(@Param('code') code: string) {
    return this.service.getByCode(code);
  }

  // Admin View: GET /contributions/admin/a3f12...
  @Get('admin/:token')
  async getAdmin(@Param('token') token: string) {
    return this.service.getByAdminToken(token);
  }
}
