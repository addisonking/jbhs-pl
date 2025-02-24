<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const stallData = data.stall;
</script>

{#snippet checkInOutCard({
	header,
	description,
	action,
	footer
}: {
	header: string;
	description: string;
	action: { action: string; label: string; inputs: { name: string; value: string }[] };
	footer: string;
})}
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>{header}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if action}
				<form method="POST" action={action.action}>
					{#each action.inputs as { name, value }}
						<input type="hidden" {name} {value} />
					{/each}
					<Button type="submit" class="w-full">{action.label}</Button>
				</form>
			{/if}
		</Card.Content>
		<Card.Footer>
			<p class="font-mono text-sm text-gray-500">{footer}</p>
		</Card.Footer>
	</Card.Root>
{/snippet}

{#snippet responseCard({
	header,
	description,
	footer
}: {
	header: string;
	description: string;
	footer: string;
})}
	<Card.Root class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>{header}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</Card.Header>
		<Card.Footer>
			<p class="font-mono text-sm text-gray-500">{footer}</p>
		</Card.Footer>
	</Card.Root>
{/snippet}

<main class="flex flex-1 items-center justify-center">
	<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
		<div class="container flex max-w-[64rem] flex-col items-center gap-4">
			{#if form}
				{#if form.success}
					{@render responseCard({
						header: 'Success',
						description: 'Action completed successfully! You may now exit this page.',
						footer: `debug ${stallData.id}`
					})}
				{:else if !form.success}
					{@render responseCard({
						header: 'Error',
						description: form.message,
						footer: `debug ${stallData.id}`
					})}
				{/if}
			{:else if !stallData.occupied}
				{@render checkInOutCard({
					header: 'Parking Stall Check-In',
					description:
						'This stall is currently marked as available. Please check in to update its status.',
					action: {
						action: '?/checkin',
						label: 'Check In',
						inputs: [{ name: 'stallId', value: stallData.id }]
					},
					footer: `debug ${stallData.id}`
				})}
			{:else if stallData.occupied}
				{@render checkInOutCard({
					header: 'Parking Stall Check-Out',
					description:
						'This stall is currently marked as occupied. Please check out to update its status.',
					action: {
						action: '?/checkout',
						label: 'Check Out',
						inputs: [{ name: 'stallId', value: stallData.id }]
					},
					footer: `debug ${stallData.id}`
				})}
			{/if}
		</div>
	</section>
</main>
