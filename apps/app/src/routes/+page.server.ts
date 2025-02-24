import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load = (async () => {
	const rows = await prisma.parkingFacility.findMany({
		include: {
			rows: {
				include: {
					stalls: true
				}
			}
		}
	});

	return {
		props: {
			rows
		}
	};
}) satisfies PageServerLoad;
