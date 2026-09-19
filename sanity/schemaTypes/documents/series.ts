import { defineField, defineType } from 'sanity'

/**
 * A named group of works that belong together. On the Works page they are laid
 * out side by side in one aligned row instead of each getting its own place.
 */
export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'For your own reference. Not shown on the site.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'works',
      title: 'Works',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'work' }] }],
      description:
        'The works in this series, in the order they should sit across the row. Drag to reorder.',
      validation: (rule) => rule.min(2).warning('A series usually holds at least two works.'),
    }),
  ],
  preview: {
    select: { title: 'title', works: 'works' },
    prepare: ({ title, works }) => ({
      title,
      subtitle: `${works?.length ?? 0} works`,
    }),
  },
})
