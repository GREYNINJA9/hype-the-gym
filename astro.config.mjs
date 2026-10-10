import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Replace with your production domain when ready
export default defineConfig({
  site: 'https://hypethegym-faridabad.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  image: {
    // Allow remote images from placeholder services during development
    domains: ['images.unsplash.com', 'placehold.co'],
  },
});
