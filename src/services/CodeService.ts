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

  static async getCodeForIp(ipAddress: string): Promise<{ code: string; isNew: boolean } | null> {
    try {
      // Check if IP already has a code
      const { data: existingAssignment, error: selectError } = await CodeService.supabase
        .from(CodeService.TABLE_NAME)
        .select('code')
        .eq('ip_address', ipAddress)
        .single();

      if (existingAssignment) {
        return { code: existingAssignment.code, isNew: false };
      }

      // Get next available code
      const { data: availableCode, error: fetchError } = await CodeService.supabase
        .from(CodeService.TABLE_NAME)
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
        .from(CodeService.TABLE_NAME)
        .update({ ip_address: ipAddress, assigned_at: new Date().toISOString() })
        .eq('code', availableCode.code);

      if (updateError) {
        console.error('Error assigning code:', updateError);
        return null;
      }

      await CodeService.updateAvailableCount();

      return { code: availableCode.code, isNew: true };
    } catch (error) {
      console.error('Error in getCodeForIp:', error);
      return null;
    }
  }

  static async getAvailableCodeCount(): Promise<number> {
    try {
      const { count, error } = await CodeService.supabase
        .from(CodeService.TABLE_NAME)
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
