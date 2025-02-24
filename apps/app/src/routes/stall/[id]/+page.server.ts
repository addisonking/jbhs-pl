import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { error } from '@sveltejs/kit';
import { differenceInMinutes } from 'date-fns';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient().$extends(withAccelerate())

export const actions = {
	checkin: async ({ params }) => {
		const stallId = params.id;

		if (!stallId) {
			throw error(400, 'Stall ID is required');
		}

		const stall = await prisma.parkingStall.findUnique({
			where: { id: stallId }
		});

		if (!stall) {
			throw error(404, 'Stall not found');
		}

		const now = new Date();
		if (stall.lastUpdated && differenceInMinutes(now, stall.lastUpdated) < 5) {
			return {
				success: false,
				message: 'Vehicle checked in too soon. Please wait a few minutes and try again.'
			};
		}

		await prisma.parkingStall.update({
			where: { id: stallId },
			data: {
				occupied: true,
				lastUpdated: now
			}
		});

		return { success: true };
	},
	checkout: async ({ params }) => {
		const stallId = params.id;

		if (!stallId) {
			throw error(400, 'Stall ID is required');
		}

		await prisma.parkingStall.update({
			where: { id: stallId },
			data: {
				occupied: false,
				lastUpdated: new Date()
			}
		});

		return { success: true };
	}
} as Actions;

export const load = (async ({ params }) => {
	const stallId = params.id;

	if (!stallId) {
		throw error(400, 'Stall ID is required');
	}

	const stall = await prisma.parkingStall.findUnique({
		where: { id: stallId },
		include: {
			parkingRow: {
				include: {
					parkingFacility: true
				}
			}
		}
	});

	if (!stall) {
		throw error(404, 'Stall not found');
	}

	return { stall };
}) satisfies PageServerLoad;
