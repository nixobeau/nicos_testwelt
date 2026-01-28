import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabaseConfig';

export class CodeService {
  private static supabase: SupabaseClient;
  private static readonly TABLE_NAME = 'code_assignments';
  private static availableCodeCount: number = 0;

  static {
    // Initialize Supabase client
    CodeService.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }

  static async getClientIpAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      // Fallback to localhost for testing
      return 'localhost';
    }
  }

  static async getCodeForIp(ipAddress: string, tableName?: string): Promise<{ code: string; isNew: boolean } | null> {
    try {
      const table = tableName || CodeService.TABLE_NAME;

      // Check if IP already has a code (for new calendar_codes table structure)
      if (table === 'calendar_codes') {
        // For calendar_codes, check if IP has already used a code
        const { data: existingAssignment, error: selectError } = await CodeService.supabase
          .from(table)
          .select('code')
          .eq('ip_address', ipAddress)
          .eq('used', true)
          .single();

        if (existingAssignment) {
          return { code: existingAssignment.code, isNew: false };
        }

        // Get next available code (where used = false)
        const { data: availableCode, error: fetchError } = await CodeService.supabase
          .from(table)
          .select('code')
          .eq('used', false)
          .limit(1)
          .single();

        if (!availableCode) {
          console.error('No available codes');
          return null;
        }

        // Mark code as used and assign to IP
        const { error: updateError } = await CodeService.supabase
          .from(table)
          .update({ 
            ip_address: ipAddress, 
            used: true, 
            used_at: new Date().toISOString() 
          })
          .eq('code', availableCode.code);

        if (updateError) {
          console.error('Error assigning code:', updateError);
          return null;
        }

        return { code: availableCode.code, isNew: true };
      }

      // For old table structure (golf_codes, code_assignments)
      const { data: existingAssignment, error: selectError } = await CodeService.supabase
        .from(table)
        .select('code')
        .eq('ip_address', ipAddress)
        .single();

      if (existingAssignment) {
        return { code: existingAssignment.code, isNew: false };
      }

      // Get next available code
      const { data: availableCode, error: fetchError } = await CodeService.supabase
        .from(table)
        .select('code')
        .is('ip_address', null)
        .limit(1)
        .single();

      if (!availableCode) {
        console.error('No available codes');
        return null;
      }

      // Assign code to IP
      const { error: updateError } = await CodeService.supabase
        .from(table)
        .update({ ip_address: ipAddress, assigned_at: new Date().toISOString() })
        .eq('code', availableCode.code);

      if (updateError) {
        console.error('Error assigning code:', updateError);
        return null;
      }

      return { code: availableCode.code, isNew: true };
    } catch (error) {
      console.error('Error in getCodeForIp:', error);
      return null;
    }
  }

  static async getAvailableCodeCount(tableName?: string): Promise<number> {
    try {
      const table = tableName || CodeService.TABLE_NAME;
      
      // For calendar_codes table, count codes where used = false
      if (table === 'calendar_codes') {
        const { count, error } = await CodeService.supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('used', false);

        if (error) {
          console.error('Error counting available codes:', error);
          return 0;
        }

        return count || 0;
      }

      // For old table structure, count where ip_address is null
      const { count, error } = await CodeService.supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .is('ip_address', null);

      if (error) {
        console.error('Error counting available codes:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getAvailableCodeCount:', error);
      return 0;
    }
  }

  private static async updateAvailableCount(): Promise<void> {
    CodeService.availableCodeCount = await CodeService.getAvailableCodeCount();
  }

  static getCachedAvailableCount(): number {
    return CodeService.availableCodeCount;
  }
}
