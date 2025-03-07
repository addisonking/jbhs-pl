import { supabase } from "$lib/supabaseClient";
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }: { params: { rowid: string } }) => {
  const rowid = params.rowid;

  if (!rowid) {
    throw error(400, 'Row ID is required');
  }

  const { data: stall, error: stallError } = await supabase
    .from('ParkingStall')
    .select('*')
    .order('id', { ascending: true })
    .range(parseInt(rowid) -1, parseInt(rowid) -1) // needs -1 because of 0-based index
    .single();

  if (stallError) {
    throw error(404, 'Stall not found');
  }

  redirect(302, `/stall/${stall.id}`);
}) satisfies PageServerLoad;