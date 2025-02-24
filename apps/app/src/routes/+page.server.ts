import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient().$extends(withAccelerate())

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
