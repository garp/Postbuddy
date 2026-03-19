import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Main routes
  const mainRoutes = [
    'sitemap.xml',
    'payment',
    'feature-request',
    'report-bug',
    'login',
    'talk-to-sales',
    'plans',
    'verifyOtp',
    'privacy-policy',
    'aboutus',
    'terms',
    'dashboard',
    'setup',
    'products',
    'product-roadmap',
    '',
    'blogs',
    'shipping',
    'release-notes',
    'refund',
    'contactus',
  ];

  // Blog routes
  const blogRoutes = [
    'how-to-add-custom-button',
    'how-to-use-custom-button',
    'introduction-to-post-buddy-ai-1',
    'adding-post-buddy-ai-to-chrome',
    'ai-driven-content-suggestion-revolutionizing-social-media-engagement',
    'how-to-get-your-deep-seek-api-key',
    'how-to-get-your-claude-api-key',
    'boost-your-content-strategy-with-the-ai-powered-virality-predictor'
  ];

  // Create sitemap entries for main routes
  const mainEntries = mainRoutes.map(route => ({
    url: `https://postbuddy.ai/${route}`,
    lastModified: new Date(),
    priority: route === '' ? 1 : 0.7,
    changefreq: 'daily' as const,
  }));

  // Create sitemap entries for blog routes
  const blogEntries = blogRoutes.map(slug => ({
    url: `https://postbuddy.ai/blogs/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changefreq: 'weekly' as const,
  }));

  // Combine all entries
  return [...mainEntries, ...blogEntries];
}
