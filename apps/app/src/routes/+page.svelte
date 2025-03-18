<script lang="ts">
	import LotRenderer from '$lib/components/app/lot-renderer.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { source } from 'sveltekit-sse';
	import { Info } from '@lucide/svelte';

	const connection = source('/events/stream');
	const message = connection.select('message');
	const transformed = message.transform(function run(data) {
		if (data === '') return;

		const json = JSON.parse(data);

		parkingFacility = json[0];
	});

	let parkingFacility = $state<{ rows: { stalls: { occupied: boolean }[] }[] }>({ rows: [] });

	transformed.subscribe((data) => {
		if (typeof data === 'string') {
			parkingFacility = JSON.parse(data)[0];
		}
	});

	// $effect(() => {
	// 	console.log(parkingFacility);
	// });
</script>

<main class="flex flex-1 items-center justify-center">
	<section class="mx-2 space-y-4 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
		<div class="grid grid-cols-1 gap-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Current Vacancy</Card.Title>
					<Dialog.Root>
						<Dialog.Trigger>
							<Info class="h-4 w-4 cursor-pointer text-muted-foreground" />
						</Dialog.Trigger>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Notice</Dialog.Title>
								<Dialog.Description>
									Displayed data may not fully reflect actual occupancy due to potential
									discrepancies in user reporting.
								</Dialog.Description>
							</Dialog.Header>
						</Dialog.Content>
					</Dialog.Root>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{parkingFacility.rows.reduce(
							(acc: number, row: { stalls: { occupied: boolean }[] }) =>
								acc + row.stalls.filter((stall) => !stall.occupied).length,
							0
						)}
					</div>
					<p class="text-xs text-muted-foreground">
						Out of {parkingFacility.rows.reduce(
							(acc: number, row: { stalls: { occupied: boolean }[] }) => acc + row.stalls.length,
							0
						)} stalls
					</p>
				</Card.Content>
			</Card.Root>
		</div>
		<Card.Root class="w-full max-w-fit">
			<Card.Header>
				<Card.Title>Live Parking Lot Map</Card.Title>
				<Card.Description
					>View the current status of the parking lot sourced by user data.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<div class="overflow-hidden rounded-lg border-2 border-dashed p-4 sm:p-8">
					{#if parkingFacility.rows.length === 0}
						<Skeleton class="h-64 w-full" />
					{:else}
						<LotRenderer {parkingFacility} />
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</main>
