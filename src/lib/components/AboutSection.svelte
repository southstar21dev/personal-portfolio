<script lang="ts">
	import portrait from '#lib/assets/about/ziya.jpg?enhanced';
	import { imageLoading } from '#lib/image-loading.js';
	import { resume } from '#lib/site.js';

	const facts = [
		{
			label: 'Studying',
			main: 'Business Administration and Management',
			detail: 'Corvinus University of Budapest'
		},
		{
			label: 'Background',
			main: 'Computer Engineering',
			detail: 'Coursework at Dokuz Eylul University'
		},
		{ label: 'Based in', main: 'Budapest', detail: 'Hungary' },
		{
			label: 'Languages',
			main: 'Azerbaijani, Turkish, English',
			detail: 'and elementary level in Russian'
		}
	];
</script>

<section id="about" class="about" aria-labelledby="about-title">
	<div class="ghost-word watermark" aria-hidden="true">HELLO</div>

	<div class="container">
		<div class="grid">
			<div class="portrait">
				<div class="photo img-load" use:imageLoading>
					<enhanced:img
						src={portrait}
						alt="Ziya Sharifli"
						sizes="(min-width: 860px) 400px, 320px"
					/>
				</div>
			</div>

			<div class="text">
				<h2 id="about-title" class="display">ABOUT ME</h2>
				<p class="lede">
					I'm Ziya. I've been tinkering with computers since I was a kid, and now I build mobile and
					web apps.
				</p>
				<p class="body">
					I'm a business student with a background in computer engineering. I love working with
					electronics and mechanical parts as much as writing code, so I like understanding how
					things work, from the hardware up. Right now my focus is software: designing and building
					apps people enjoy using.
				</p>
				<dl class="facts">
					{#each facts as fact (fact.label)}
						<div>
							<dt>{fact.label}</dt>
							<dd><b>{fact.main}</b><span>{fact.detail}</span></dd>
						</div>
					{/each}
				</dl>
				<a class="resume" href={resume} target="_blank" rel="noopener" data-sveltekit-reload>
					View resume <span aria-hidden="true">↗</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.about {
		position: relative;
		overflow: hidden;
		padding: 112px 0 120px;
	}

	.watermark {
		top: 56px;
		right: -2vw;
		font-size: 22vw;
	}

	.grid {
		position: relative;
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: center;
	}

	/* ---------- the photo: a tilted card ---------- */

	.portrait {
		position: relative;
		width: 100%;
		max-width: 400px;
		justify-self: center;
	}

	.photo {
		position: relative;
		aspect-ratio: 944 / 1136;
		overflow: hidden;
		border-radius: 20px;
		background: var(--bg);
		transform: rotate(-2.5deg);
		box-shadow: var(--shadow-card);
	}

	.photo :global(img) {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* ---------- text ---------- */

	.text {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	h2 {
		font-size: clamp(56px, 9vw, 140px);
		line-height: 0.88;
	}

	.lede {
		margin: 0;
		font-size: clamp(20px, 2vw, 26px);
		line-height: 1.35;
		font-weight: 650;
		text-wrap: pretty;
	}

	.body {
		margin: 0;
		max-width: 52ch;
		font-size: 17px;
		line-height: 1.6;
		color: var(--muted);
	}

	.facts {
		margin: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 26px 40px;
		max-width: 560px;
	}

	.facts div {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
	}

	.facts dt {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted-2);
	}

	.facts dd {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.facts b {
		font-size: 17px;
		font-weight: 750;
		line-height: 1.3;
		color: var(--black);
	}

	.facts span {
		font-size: 15px;
		line-height: 1.4;
		color: var(--muted);
	}

	.resume {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		font-size: 15px;
		font-weight: 500;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.resume:hover {
		color: var(--accent);
	}

	@media (max-width: 860px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.portrait {
			max-width: 320px;
		}
	}

	@media (max-width: 600px) {
		.about {
			padding: 72px 0 64px;
		}

		.watermark {
			top: 32px;
		}

		.portrait {
			max-width: 260px;
		}

		.photo {
			transform: none;
		}

		.text {
			gap: 22px;
		}

		.body {
			font-size: 16px;
		}
	}

	@media (max-width: 520px) {
		.facts {
			grid-template-columns: minmax(0, 1fr);
			gap: 20px;
		}
	}
</style>
