import { defineField, defineType } from 'sanity'

/**
 * Views of the exhibition itself. Deliberately its own type rather than a
 * reference to a work, so these never appear on the Works page or in the index.
 */
export const installationImage = defineType({
  name: 'installationImage',
  title: 'Installation image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Description',
      description:
        'A short description of what is in the image. Read aloud by screen readers and used by search engines.',
      validation: (rule) =>
        rule.required().warning('Adding a description helps accessibility and SEO.'),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional. Shown underneath the image.',
    }),
    defineField({
      name: 'placement',
      title: 'Where it goes',
      type: 'string',
      initialValue: 'gallery',
      options: {
        list: [
          { title: 'Large — on its own, at the top', value: 'lead' },
          { title: 'Detail — on its own, under the large one', value: 'detail' },
          { title: 'In the Installation View gallery', value: 'gallery' },
        ],
        layout: 'radio',
      },
      description:
        'The top of the page reads: the large images, then the details, then everything else scrolls sideways in the gallery.',
    }),
  ],
  preview: {
    select: { imageUrl: 'asset.url', title: 'alt', subtitle: 'placement' },
  },
})
