import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import { differenceInMinutes } from 'date-fns';
import type { Actions, PageServerLoad } from './$types';

export const actions = {
	checkin: async ({ params }) => {
		const stallId = params.id;

		if (!stallId) {
			throw error(400, 'Stall ID is required');
		}

		const { data: stall, error: stallError } = await supabase
			.from('ParkingStall')
			.select('*')
			.eq('id', stallId)
			.single();

		if (stallError) {
			throw error(404, 'Stall not found');
		}

		const now = new Date();
		if (stall.lastUpdated && differenceInMinutes(now, new Date(stall.lastUpdated)) < 5) {
			return {
				success: false,
				action: 'checkin',
				message: 'Vehicle checked in too soon. Please wait a few minutes and try again.'
			};
		}

		const { error: updateError } = await supabase
			.from('ParkingStall')
			.update({
				occupied: true,
				lastUpdated: now
			})
			.eq('id', stallId);

		if (updateError) {
			throw error(500, 'Failed to update stall');
		}

		return { success: true, action: 'checkin' };
	},
	checkout: async ({ params }) => {
		const stallId = params.id;

		if (!stallId) {
			throw error(400, 'Stall ID is required');
		}

		const { error: updateError } = await supabase
			.from('ParkingStall')
			.update({
				occupied: false
			})
			.eq('id', stallId);

		if (updateError) {
			throw error(500, 'Failed to update stall');
		}

		return { success: true, action: 'checkout' };
	}
} as Actions;

export const load = (async ({ params }) => {
	const stallId = params.id;

	if (!stallId) {
		throw error(400, 'Stall ID is required');
	}

	const { data: stall, error: stallError } = await supabase
		.from('ParkingStall')
		.select('*')
		.eq('id', stallId)
		.single();

	if (stallError) {
		throw error(404, 'Stall not found');
	}

	return { stall };
}) satisfies PageServerLoad;
