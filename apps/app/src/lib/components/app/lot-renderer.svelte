<script lang="ts">
	type ParkingRow = {
		stalls: { occupied: boolean; id: string }[];
		opening: 'top' | 'bottom';
		group: string;
	};

	let { parkingFacility } = $props();
</script>

{#snippet rowComponent(row: ParkingRow)}
	{#snippet stallComponent(opening: 'top' | 'bottom', occupied: boolean)}
		<div
			class={`m-0.5 h-8 w-4 rounded-sm border-foreground sm:h-12 sm:w-8 sm:rounded-lg ${opening === 'top' ? 'border-t-0' : 'border-b-0'} ${occupied ? 'bg-red-500' : 'bg-green-500'}`}
			aria-label={occupied ? 'Occupied stall' : 'Available stall'}
		></div>
	{/snippet}

	<div class="flex flex-row items-center justify-center">
		{#each row.stalls as stall}
			{@render stallComponent(row.opening as 'top' | 'bottom', stall.occupied)}
		{/each}
	</div>
{/snippet}

<div class="grid">
	{#each parkingFacility.rows as row, index}
		{#if index > 0 && parkingFacility.rows[index - 1].group !== row.group}
			<div class="h-4 sm:h-8"></div>
		{/if}
		{@render rowComponent(row)}
	{/each}
</div>
