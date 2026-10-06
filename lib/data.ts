import { supabase } from './supabase';

export type Medicine = { id: string; name: string; dosage: string; time: string; quantity: number; created_at: string; user_id?: string };
export type MedicineInput = Pick<Medicine, 'name' | 'dosage' | 'time' | 'quantity'>;

export async function getMedicines() {
  const { data, error } = await supabase.from('medicines').select('*').order('time', { ascending: true });
  if (error) throw error;
  return (data || []) as Medicine[];
}

export async function saveMedicine(input: MedicineInput, id?: string) {
  const request = id ? supabase.from('medicines').update(input).eq('id', id).select().single() : supabase.from('medicines').insert({ ...input, created_at: new Date().toISOString() }).select().single();
  const { data, error } = await request;
  if (error) throw error;
  return data as Medicine;
}

export async function deleteMedicine(id: string) {
  const { error } = await supabase.from('medicines').delete().eq('id', id);
  if (error) throw error;
}