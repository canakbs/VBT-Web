import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const llmUserAgents = [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'PerplexityBot',
    'Google-Extended',
    'GoogleOther',
    'Bytespider',
    'cohere-ai',
    'Applebot-Extended',
    'Diffbot',
    'FacebookBot',
  ];

  const llmRules = llmUserAgents.map((agent) => ({
    userAgent: agent,
    allow: '/',
    disallow: ['/admin', '/api/private'],
  }));

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
      ...llmRules,
    ],
    sitemap: 'https://akdenizveribilimi.com/sitemap.xml',
    host: 'https://akdenizveribilimi.com',
  };
}
