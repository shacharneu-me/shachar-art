import { defineField, defineType } from 'sanity'

export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Description',
      description:
        'A short description of what is in the image. Read aloud by screen readers and used by search engines.',
      validation: (rule) => rule.required().warning('Adding a description helps accessibility and SEO.'),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description: 'Optional. Shown underneath the image.',
    }),
  ],
  preview: {
    select: { imageUrl: 'asset.url', title: 'alt', subtitle: 'caption' },
  },
})
