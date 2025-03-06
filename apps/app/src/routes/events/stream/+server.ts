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
		.eq('parkingRowId', rowId)  // Join ParkingStall to the current ParkingRow
		.order('id', { ascending: true });  // Order by id of ParkingStall

	if (error) {
		return [];
	}

	return stalls;
}

async function hasDbUpdated(lastState: any) {
	const { data: currentState, error } = await supabase
		.from('ParkingFacility')
		.select(`
			id, 
			rows:ParkingRow!ParkingRow_parkingFacilityId_fkey(id, order, opening, group)
		`)
		.order('order', { foreignTable: 'ParkingRow' });  // Ensure rows are ordered by 'order'

	if (error) {
		console.error('Error fetching parking data:', error);
		return null;
	}

	// Fetch and order stalls for each row
	for (let facility of currentState) {
		for (let row of facility.rows) {
			const stalls = await fetchParkingStalls(row.id);
			row.stalls = stalls;  // Attach ordered stalls to the row
		}
	}

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

			await new Promise((resolve) => setTimeout(resolve, 1000));  // Check for updates every second
		}
	});
}