import { siteUrl } from '#lib/site.js';

// Prerendered to build/sitemap.xml. The site is one page; projects open as /#<slug> sheets,
// which search engines treat as the same URL, so there is a single entry.
export const prerender = true;

export function GET() {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>${siteUrl}/</loc></url>
</urlset>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
