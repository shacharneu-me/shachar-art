import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'artistName',
      title: 'Name',
      type: 'string',
      description: 'Shown in the header and in browser tabs.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional. A short line under the name, e.g. “Artist, Tel Aviv”.',
    }),
    defineField({
      name: 'landingImage',
      title: 'Landing image',
      type: 'figure',
      description: 'The large image shown on the homepage.',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'One or two sentences describing the site. Used by Google and when links are shared.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      description: 'Optional. Shown in the footer.',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'Optional. Shown in the footer.',
    }),
    defineField({
      name: 'socialImage',
      title: 'Default sharing image',
      type: 'figure',
      description: 'Optional. The preview image used when a link to the site is shared.',
    }),
  ],
  preview: {
    select: { title: 'artistName' },
    prepare: ({ title }) => ({ title: 'Site settings', subtitle: title }),
  },
})
