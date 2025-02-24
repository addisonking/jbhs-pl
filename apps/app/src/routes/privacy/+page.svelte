<script lang="ts">
	import type { PageData } from '../$types';

	let { data }: { data: PageData } = $props();

	const lastUpdated = new Date("2/12/25").toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
</script>

<div class="preview flex min-h-[350px] w-full items-center justify-center p-10">
	<div>
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Privacy Policy</h1>
		<p class="scroll-m-20 mt-6">
			Last updated on <time>{lastUpdated}</time>
		</p>
		<h3 class="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Information Collected</h3>
		<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
			<li>No personally identifiable information is collected by this application.</li>
			<li>
				Only anonymous status updates are collected when users scan and check in to a parking spot QR code.
			</li>
		</ul>
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">How Information is Used</h3>
		<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
			<li>To monitor the availability of parking spots.</li>
			<li>To enhance the efficiency of parking management.</li>
		</ul>
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Data Sharing and Security</h3>
		<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
			<li>No personal data is stored, shared, or sold.</li>
			<li>Anonymous status updates are securely processed and stored.</li>
		</ul>
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Changes to This Policy</h3>
		<p class="leading-7 [&:not(:first-child)]:mt-6">
			This policy may be updated periodically without notice. It is recommended to check for updates regularly.
		</p>
	</div>
</div>
