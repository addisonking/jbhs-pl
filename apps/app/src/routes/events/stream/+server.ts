import { supabase } from "$lib/supabaseClient";
import { produce } from 'sveltekit-sse';

function omitIds(data: any) {
	return JSON.parse(
		JSON.stringify(data, (key, value) => {
			if (key === 'id') return undefined;
			return value;
		})
	);
}

async function fetchParkingStalls(rowId: number) {
	const { data: stalls, error } = await supabase
		.from('ParkingStall')
		.select('id, occupied, lastUpdated')
		.eq('parkingRowId', rowId)
		.order('id', { ascending: true });

	if (error) {
		return [];
	}

	return stalls;
}

async function fetchCurrentState() {
	const { data: currentState, error } = await supabase
		.from('ParkingFacility')
		.select(`
			id, 
			rows:ParkingRow!ParkingRow_parkingFacilityId_fkey(id, order, opening, group)
		`)
		.order('order', { foreignTable: 'ParkingRow' });

	if (error) {
		console.error('Error fetching parking data:', error);
		return null;
	}

	for (let facility of currentState) {
		for (let row of facility.rows) {
			const stalls = await fetchParkingStalls(row.id);
			row.stalls = stalls;
		}
	}

	return omitIds(currentState);
}

export function POST() {
	return produce(async function start({ emit }) {
		while (true) {
			const currentState = await fetchCurrentState();

			if (currentState) {
				emit('message', JSON.stringify(currentState));
			}

			await new Promise((resolve) => setTimeout(resolve, 2000));  // Send updates every 2 seconds
		}
	});
}
