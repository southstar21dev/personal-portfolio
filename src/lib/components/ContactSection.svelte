<script lang="ts">
	import { email, github, instagram, resume } from '#lib/site.js';
</script>

<section id="contact" class="contact" aria-labelledby="contact-title">
	<div class="ghost-word watermark" aria-hidden="true">TALK</div>

	<div class="container">
		<div class="inner">
			<h2 id="contact-title" class="display">CONTACT</h2>
			<p class="lede">Have an app idea, a project or a role in mind? Write to me.</p>

			<div class="mail-row">
				<a class="mail display" href="mailto:{email}">{email}</a>
			</div>

			<div class="links">
				<a href={github} rel="noopener noreferrer">
					GitHub <span aria-hidden="true">↗</span>
				</a>
				<a href={instagram} rel="noopener noreferrer">
					Instagram <span aria-hidden="true">↗</span>
				</a>
				<a href={resume} target="_blank" rel="noopener" data-sveltekit-reload>
					Resume <span aria-hidden="true">↗</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.contact {
		position: relative;
		overflow: hidden;
		padding: 112px 0 120px;
		border-top: 1px solid var(--line);
	}

	.watermark {
		top: 40px;
		right: -2vw;
		font-size: 24vw;
	}

	.inner {
		position: relative;
		max-width: 1180px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	h2 {
		font-size: clamp(64px, 11vw, 176px);
	}

	.lede {
		margin: 0;
		max-width: 34ch;
		font-size: clamp(20px, 2vw, 26px);
		line-height: 1.35;
		font-weight: 650;
		text-wrap: pretty;
	}

	/* ---------- the email is the call to action ---------- */

	.mail-row {
		position: relative;
		align-self: flex-start;
		max-width: 100%;
		margin-top: 24px;
	}

	.mail {
		position: relative;
		font-size: clamp(30px, 6.4vw, 96px);
		line-height: 1.05;
		text-decoration: underline;
		text-decoration-thickness: 0.045em;
		text-underline-offset: 0.12em;
		overflow-wrap: anywhere;
		transition: color 0.3s ease;
	}

	.mail:hover {
		color: var(--muted);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 40px;
		margin-top: 40px;
		padding-top: 28px;
		border-top: 1px solid var(--line);
	}

	.links a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
		transition: color 0.2s ease;
	}

	.links a:hover {
		color: var(--muted);
	}

	@media (max-width: 720px) {
		.links {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
	}

	@media (max-width: 600px) {
		.contact {
			padding: 72px 0 48px;
		}

		.watermark {
			top: 28px;
		}

		.inner {
			gap: 24px;
		}

		.mail-row {
			margin-top: 8px;
		}

		/* The address stays on one line down to small phones. */
		.mail {
			font-size: 8.2vw;
		}

		.links {
			margin-top: 16px;
			padding-top: 16px;
		}
	}
</style>
