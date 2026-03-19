/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://postbuddy.ai',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 50000,
  merge: true,
  additionalPaths: async (config) => {
    // Hardcode blog slugs since the API approach might be inconsistent
    const blogSlugs = [
      'how-to-add-custom-button',
      'how-to-use-custom-button',
      'introduction-to-post-buddy-ai-1',
      'adding-post-buddy-ai-to-chrome',
      'ai-driven-content-suggestion-revolutionizing-social-media-engagement',
      'how-to-get-your-deep-seek-api-key',
      'how-to-get-your-claude-api-key',
      'boost-your-content-strategy-with-the-ai-powered-virality-predictor'
    ];

    return blogSlugs.map(slug => ({
      loc: `/blogs/${slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));
  },
};
