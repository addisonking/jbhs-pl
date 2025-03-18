<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';

	import '../app.pcss';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col justify-between">
	{#if page.url.pathname !== '/'}
		<header class="container z-40 bg-background">
			<div class="flex h-16 items-center justify-end">
				<Button variant="outline" href="/">Live Map</Button>
			</div>
		</header>
	{/if}

	<div class="my-auto">
		{@render children()}
	</div>

	<footer class="py-6 md:px-8 md:py-0">
		<div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
			<div class="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
				<p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
					<a
						href="https://www.johnbowne.org"
						target="_blank"
						rel="noopener"
						class="font-medium underline underline-offset-4"
					>
						John Bowne High School</a
					>
					Parking Lot Managment System -
					<a href="/privacy" class="font-medium underline underline-offset-4">Data Usage</a>
				</p>
			</div>
		</div>
	</footer>
</div>
