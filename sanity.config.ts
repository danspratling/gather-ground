import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

export default defineConfig({
  name: 'gather-ground',
  title: 'Gather Ground',
  projectId: 'mrz1ftls',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [
      // Schema types will be added in Phase 2 (GG-100b).
    ],
  },
});
