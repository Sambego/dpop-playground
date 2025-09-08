import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'dpop.info - Interactive DPoP OAuth2 Playground',
    short_name: 'dpop.info',
    description: 'Interactive DPoP OAuth2 playground demonstrating token binding with cryptographic proof-of-possession.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1e23',
    theme_color: '#10b981',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    categories: ['education', 'developer', 'productivity'],
    lang: 'en-US',
    orientation: 'portrait-primary',
  }
}