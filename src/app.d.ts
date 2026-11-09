// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Slug of the project open in the detail view (shallow routing, see ProjectsSection). */
			project?: import('#lib/projects.js').Slug;
			/** The open project's history entry was added by this page, so closing goes back. */
			pushed?: boolean;
		}
		// interface Platform {}
	}
}

export {};
