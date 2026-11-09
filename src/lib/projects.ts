export type ProjectStatus = 'Shipped' | 'In progress';

/**
 * Every project's slug. Adding a project starts here: the media and layout maps are typed
 * `Record<Slug, …>`, so the type checker then points at every place that needs an entry.
 */
export type Slug = 'harada' | 'kaloria' | 'mirkazim' | 'droidtosh' | 'volum' | 'vectra';

export interface ProjectLink {
	label: string;
	href: string;
}

export interface ScreenGroup {
	label: string;
	/** Image names under src/lib/assets/projects/screens/<slug>/, with captions. */
	items: { name: string; caption: string }[];
}

export interface Project {
	slug: Slug;
	name: string;
	platform: string;
	status: ProjectStatus;
	summary: string;
	/** Preview orientation on the card: a website screenshot or a phone screen. */
	shape: 'web' | 'phone';
	/** How the detail view fans out its hero screenshots. */
	hero: { layout: 'phones' | 'web' | 'mac'; names: string[] };
	about: string;
	links: ProjectLink[];
	features: { title: string; text: string }[];
	stack: string[];
	screens: ScreenGroup[];
}

const gh = (repo: string): ProjectLink => ({
	label: 'GitHub',
	href: `https://github.com/southstar21dev/${repo}`
});
const release = (repo: string): ProjectLink => ({
	label: 'Latest release',
	href: `https://github.com/southstar21dev/${repo}/releases/latest`
});

/** Shown in #projects, in this order. Images live in projects-media.ts, keyed by slug. */
export const projects: Project[] = [
	{
		slug: 'harada',
		name: 'Harada Media',
		platform: 'Web · CMS',
		status: 'Shipped',
		summary: 'Portfolio site and content manager for a video creator in Baku.',
		shape: 'web',
		hero: { layout: 'web', names: ['home'] },
		about:
			'Harada Media is a social media creator in Baku who makes videos. The site puts that work first, in Azerbaijani and English, and comes with an admin panel where every video, background and line of text can be changed without touching code. Self-hosted on one server.',
		links: [{ label: 'Visit harada.media', href: 'https://harada.media' }],
		features: [
			{
				title: 'Videos first, and fast',
				text: 'Work plays inline in a custom player. Every upload is compressed to 720p H.264 in the browser, with x264 compiled to WebAssembly, before it reaches the server.'
			},
			{
				title: 'The creator runs it',
				text: 'Works, homepage reels, the showcase video, backgrounds, links and every text are edited in the admin panel and go live the moment they are saved.'
			},
			{
				title: 'Two languages, one site',
				text: 'Azerbaijani and English side by side for every text, with one click to restore the original.'
			},
			{
				title: 'Nothing to babysit',
				text: 'A 4 GB storage limit with a live meter, files removed together with their work, and a nightly sweep for uploads that were never saved.'
			}
		],
		stack: [
			'React 19',
			'Vite 8',
			'TanStack Router',
			'Tailwind CSS 4',
			'i18next',
			'PocketBase',
			'x264 (WebAssembly)',
			'Caddy',
			'Docker'
		],
		screens: [
			{
				label: 'Admin panel',
				items: [
					{ name: 'admin-works', caption: 'Dashboard with the storage meter' },
					{ name: 'admin-works-drag', caption: 'Dragging works into order' },
					{ name: 'admin-work-edit', caption: 'Editing a work' },
					{ name: 'admin-texts', caption: 'Every text, in both languages' },
					{ name: 'admin-backgrounds', caption: 'Backgrounds' },
					{ name: 'admin-contact', caption: 'Contact and links' }
				]
			},
			{
				label: 'Public site',
				items: [
					{ name: 'home', caption: 'Home' },
					{ name: 'home-reels', caption: 'Reels on the homepage' },
					{ name: 'works-gallery', caption: 'Works gallery' },
					{ name: 'work-page', caption: 'A work in the custom player' }
				]
			}
		]
	},
	{
		slug: 'kaloria',
		name: 'Kaloria',
		platform: 'Android',
		status: 'In progress',
		summary: 'A calorie and nutrition tracker built on exact data.',
		shape: 'phone',
		hero: { layout: 'phones', names: ['today', 'label-scan', 'progress'] },
		about:
			'Scan a nutrition label or a barcode, log what you ate and see where you stand. Most trackers estimate; Kaloria tracks only what you can actually know: what is on the label, what you weighed and the targets you set.',
		links: [gh('Kaloria'), release('Kaloria')],
		features: [
			{
				title: 'Reads the label',
				text: 'Point the camera at a nutrition table. ML Kit finds it and flattens it, even on a curved can; Gemini Nano reads it on the device, with a rule-based parser as the fallback.'
			},
			{
				title: 'Barcodes and search',
				text: 'Your own foods first, then Open Food Facts and USDA FoodData Central in one list. Unknown products go straight to a label scan.'
			},
			{
				title: 'Works offline',
				text: 'Everything lives on the phone first. Sync is optional and goes to a PocketBase server you run yourself.'
			},
			{
				title: 'Progress and Health',
				text: 'Energy, macros, weight and steps over 7, 30 or 90 days. Health Connect syncs weigh-ins with Samsung Health, and a widget shows calories left.'
			}
		],
		stack: [
			'Kotlin 2.4',
			'Jetpack Compose',
			'Material 3 Expressive',
			'Room',
			'Hilt',
			'CameraX',
			'ML Kit',
			'Gemini Nano',
			'Health Connect',
			'PocketBase'
		],
		screens: [
			{
				label: 'The app',
				items: [
					{ name: 'today', caption: 'Today' },
					{ name: 'label-scan', caption: 'Scanning a label' },
					{ name: 'food-editor', caption: 'A label read on the device' },
					{ name: 'search', caption: 'Food search' },
					{ name: 'portion', caption: 'Logging a portion' },
					{ name: 'progress', caption: 'Progress' }
				]
			}
		]
	},
	{
		slug: 'mirkazim',
		name: 'Mirkazim Media',
		platform: 'Web · CMS',
		status: 'Shipped',
		summary: 'Video and photo portfolio with a multilingual, self-hosted admin.',
		shape: 'web',
		hero: { layout: 'web', names: ['home'] },
		about:
			'Portfolio and content management for a videographer and photographer: a video showcase, a photo gallery and an admin dashboard where every project is managed, reordered and edited.',
		links: [{ label: 'Visit mirkazim.media', href: 'https://mirkazim.media' }],
		features: [
			{ title: 'Three languages', text: 'Azerbaijani, Russian and English across the whole site.' },
			{
				title: 'Admin dashboard',
				text: 'Manage, reorder and edit portfolio projects, with service and industry tags, behind PocketBase authentication.'
			},
			{
				title: 'One player for everything',
				text: 'A custom player for uploaded videos, YouTube streams and Instagram Reels.'
			},
			{
				title: 'Instagram sync',
				text: 'Scripts that import posts straight into the site, with automatic WebP compression.'
			}
		],
		stack: [
			'React 19',
			'Vite 8',
			'TanStack Router',
			'Tailwind CSS 4',
			'Radix UI',
			'Embla Carousel',
			'PocketBase',
			'Sharp',
			'Docker'
		],
		screens: [
			{
				label: 'Admin panel',
				items: [
					{ name: 'admin-works', caption: 'All works' },
					{ name: 'admin-works-drag', caption: 'Reordering by drag' },
					{ name: 'admin-work-edit', caption: 'Editing a work' },
					{ name: 'admin-work-titles', caption: 'Titles in three languages, service tags' },
					{ name: 'admin-texts', caption: 'Texts editor' },
					{ name: 'admin-contact', caption: 'Contact and links' }
				]
			},
			{
				label: 'Public site',
				items: [
					{ name: 'home', caption: 'Home' },
					{ name: 'home-reels', caption: 'Reels on the homepage' },
					{ name: 'works-gallery', caption: 'Works gallery' },
					{ name: 'work-page', caption: 'A work in the player' }
				]
			}
		]
	},
	{
		slug: 'droidtosh',
		name: 'Droidtosh',
		platform: 'Android · macOS',
		status: 'In progress',
		summary:
			'Notifications, calls, clipboard and files between Android and a Mac. End-to-end encrypted.',
		shape: 'phone',
		hero: { layout: 'mac', names: ['mac', 'android'] },
		about:
			'Notifications, calls, clipboard and files between an Android phone and a Mac, over your local network or a relay you host yourself. End-to-end encrypted, no accounts.',
		links: [
			gh('Droidtosh'),
			{ label: 'Releases', href: 'https://github.com/southstar21dev/Droidtosh/releases' }
		],
		features: [
			{
				title: 'Notifications',
				text: 'Your phone’s notifications as native macOS banners. Reply inline, use their actions and dismiss them on either side.'
			},
			{
				title: 'Calls',
				text: 'Answer, decline and mute calls from the Mac, place calls on either SIM and browse recent calls.'
			},
			{
				title: 'Clipboard and files',
				text: 'Copy on one device, paste on the other. Send files and folders up to 2 GB both ways; interrupted transfers resume.'
			},
			{
				title: 'Private by design',
				text: 'Phone and Mac run their own encrypted session with a key exchanged at pairing, so a relay only ever forwards encrypted bytes.'
			}
		],
		stack: ['Kotlin', 'Jetpack Compose', 'SwiftUI', 'Protocol Buffers', 'Go relay'],
		screens: [
			{
				label: 'On the Mac',
				items: [
					{ name: 'mac-overview', caption: 'Overview' },
					{ name: 'mac-menu-bar', caption: 'Menu bar' },
					{ name: 'mac-call', caption: 'Incoming call' }
				]
			},
			{
				label: 'On Android',
				items: [
					{ name: 'pair', caption: 'Pairing' },
					{ name: 'home', caption: 'Home' },
					{ name: 'transfers', caption: 'Transfers' },
					{ name: 'find-phone', caption: 'Find my phone' },
					{ name: 'settings', caption: 'Settings' }
				]
			}
		]
	},
	{
		slug: 'volum',
		name: 'Volum',
		platform: 'iOS · Android',
		status: 'In progress',
		summary: 'A local-first strength training log.',
		shape: 'phone',
		hero: { layout: 'phones', names: ['today', 'session', 'lift'] },
		about:
			'Build a routine once, then follow it session by session with last time’s weights and reps already filled in, so logging is mostly confirming and adjusting numbers.',
		links: [gh('Volum'), release('Volum')],
		features: [
			{
				title: 'Last time, filled in',
				text: 'Starting a routine copies the previous session into every set. Tap the tick, nudge a number, move on.'
			},
			{
				title: 'Progress you can read',
				text: 'Every lift gets its best set, a chart of top sets over time, and a plain sentence on the home screen when something goes up.'
			},
			{
				title: 'Train together',
				text: 'Pair with a partner to share routines and lifts, and follow each other’s session live.'
			},
			{
				title: 'Works offline',
				text: 'Saved on the phone first and synced in the background, so a basement gym with no signal is fine.'
			}
		],
		stack: [
			'Kotlin Multiplatform',
			'Compose Multiplatform',
			'Ktor',
			'kotlinx.serialization',
			'PocketBase'
		],
		screens: [
			{
				label: 'The app',
				items: [
					{ name: 'today', caption: 'Today' },
					{ name: 'session', caption: 'Session in progress' },
					{ name: 'history', caption: 'History' },
					{ name: 'lifts', caption: 'All lifts' },
					{ name: 'lift', caption: 'One lift over time' },
					{ name: 'profile', caption: 'Profile and partner' }
				]
			}
		]
	},
	{
		slug: 'vectra',
		name: 'Vectra',
		platform: 'iOS · Android',
		status: 'In progress',
		summary: 'University timetable, Budapest transit and the weather in one app.',
		shape: 'phone',
		hero: { layout: 'phones', names: ['dashboard', 'schedule', 'nearby-route'] },
		about:
			'A student’s day runs on three things: when the next class is, how to get there, and whether to take an umbrella. Built for students at Corvinus in Budapest, Vectra puts them on one screen.',
		links: [gh('Vectra'), release('Vectra')],
		features: [
			{
				title: 'Timetable, synced',
				text: 'Paste your Neptun calendar link once; classes stay up to date, with breaks, clashes and exams worked out.'
			},
			{
				title: 'Live transit',
				text: 'Real-time BKK departures, vehicles moving on the map and your own lines pinned.'
			},
			{
				title: 'Attendance under control',
				text: 'Every course gets a hub that counts the skips you have left, plus grades and points.'
			},
			{
				title: 'Private by default',
				text: 'Course names, rooms and instructors are encrypted on the server. Sign in with a passkey on Android.'
			}
		],
		stack: [
			'Kotlin Multiplatform',
			'Compose Multiplatform',
			'Go',
			'PocketBase',
			'BKK Futár',
			'Open-Meteo',
			'RainViewer'
		],
		screens: [
			{
				label: 'The app',
				items: [
					{ name: 'dashboard', caption: 'Dashboard' },
					{ name: 'schedule', caption: 'Week schedule' },
					{ name: 'course', caption: 'Course hub' },
					{ name: 'nearby', caption: 'Nearby stops' },
					{ name: 'nearby-route', caption: 'A live route' },
					{ name: 'add-tracker', caption: 'Tracking a line' },
					{ name: 'radar', caption: 'Rain radar' }
				]
			}
		]
	}
];

export const projectBySlug = (slug: string): Project | undefined =>
	projects.find((p) => p.slug === slug);
