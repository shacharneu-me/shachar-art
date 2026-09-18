import { defineCliConfig } from 'sanity/cli'

/**
 * Only used by the `sanity` command line tools (for example `npm run typegen`).
 * The Studio itself is served by Next.js at /studio, so it is never deployed
 * separately. Values are read directly from the environment because the CLI does
 * not resolve the app's TypeScript path aliases.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  autoUpdates: false,
})
