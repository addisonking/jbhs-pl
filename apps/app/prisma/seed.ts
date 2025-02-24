// RESET DB: bun x prisma db push --force-reset && npx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 16, 15,15, 16

const rowsData = [
	{ order: 1, length: 14, opening: 'bottom', group: 1 },
	{ order: 2, length: 15, opening: 'top', group: 2 },
	{ order: 3, length: 15, opening: 'bottom', group: 2 },
	{ order: 4, length: 16, opening: 'top', group: 3 }
];

async function main() {
	const rows = rowsData.map((row) => ({
		order: row.order,
		opening: row.opening,
		group: row.group,
		stalls: {
			create: Array.from({ length: row.length }, () => ({
				occupied: false
			}))
		}
	}));

	await prisma.parkingFacility.create({
		data: {
			rows: {
				create: rows
			}
		}
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
