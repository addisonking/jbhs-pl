import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { produce } from 'sveltekit-sse';

const prisma = new PrismaClient().$extends(withAccelerate())

function omitIds(data: any) {
	return JSON.parse(
		JSON.stringify(data, (key, value) => {
			if (key === 'id') return undefined;
			return value;
		})
	);
}

async function hasDbUpdated(lastState: any) {
	const currentState = await prisma.parkingFacility.findMany({
		include: {
			rows: {
				include: {
					stalls: true
				}
			}
		}
	});

	const currentStateWithoutIds = omitIds(currentState);

	return JSON.stringify(currentStateWithoutIds) !== JSON.stringify(lastState)
		? currentStateWithoutIds
		: null;
}

export function POST() {
	return produce(async function start({ emit }) {
		let lastState = null;

		while (true) {
			let updatedState = await hasDbUpdated(lastState);

			if (updatedState) {
				emit('message', JSON.stringify(updatedState));
				lastState = updatedState;
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	});
}
