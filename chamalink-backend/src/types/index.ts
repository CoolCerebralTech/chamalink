import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// --- DATABASE TYPES ---
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contributions: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          whatsapp_link: string | null;
          admin_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string | null;
          whatsapp_link?: string | null;
          admin_token: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          description?: string | null;
          whatsapp_link?: string | null;
          admin_token?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      members: {
        Row: {
          id: string;
          contribution_id: string;
          name: string;
          amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contribution_id: string;
          name: string;
          amount: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contribution_id?: string;
          name?: string;
          amount?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'members_contribution_id_fkey';
            columns: ['contribution_id'];
            isOneToOne: false;
            referencedRelation: 'contributions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// --- DTOs ---
export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  whatsapp_link?: string;
}

export interface ContributionResponse {
  code: string;
  title: string;
  description: string;
  whatsapp_link: string;
  created_at: string;
  admin_token?: string;
}

// --- MEMBERS DTOs ---

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  amount: number;
}

export class UpdateMemberStatusDto {
  @IsString()
  @IsNotEmpty()
  admin_token: string; // We need this to verify permission!

  @IsString()
  @IsIn(['pending', 'confirmed'])
  status: string;
}
