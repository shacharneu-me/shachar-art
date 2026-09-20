import { defineField, defineType } from 'sanity'

export const exhibition = defineType({
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Generated from the title. This becomes the exhibition’s page address.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateText',
      title: 'Date',
      type: 'string',
      description: 'Shown on the site exactly as written, e.g. “March 2024” or “June – August 2023”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Sort date',
      type: 'date',
      description: 'Not shown on the site. Used to order exhibitions, newest first.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      description: 'Optional. Gallery or museum, and city.',
    }),
    defineField({
      name: 'curator',
      title: 'Curator',
      type: 'string',
      description: 'Optional. Just the name — the site puts “Curator:” in front of it.',
    }),
    defineField({
      name: 'installationImages',
      title: 'Installation images',
      type: 'array',
      of: [{ type: 'installationImage' }],
      description:
        'Views of the exhibition, in the order they appear down the page. Drag to reorder, and vary the size of each to give the page a rhythm. These belong to this exhibition only and never show on the Works page.',
    }),
    defineField({
      name: 'curatorialText',
      title: 'Curatorial text',
      type: 'richText',
    }),
    defineField({
      name: 'works',
      title: 'Works',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'work' }] }],
      description:
        'Works shown in this exhibition. Drag to reorder. Each work automatically links back to this exhibition.',
    }),
    defineField({
      name: 'indexCardImage',
      title: 'Index card image',
      type: 'image',
      // Sanity's own hotspot tool is the crop control: drag the focal point and
      // the crop box, and both are stored on the image and applied on the site.
      options: { hotspot: true },
      description:
        'Shown only on the Exhibitions index, in a wide card. Use the crop tool to choose which part of the picture stays visible at that shape.',
    }),
    defineField({
      name: 'indexCardAlt',
      title: 'Index card image description',
      type: 'string',
      description:
        'Optional. Describes the card image for screen readers. The title and venue are already read out, so only add what the picture itself shows.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Sharing image',
      type: 'figure',
      description:
        'Optional. Used as the preview image when a link to this exhibition is shared. Falls back to the first work.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description:
        'Optional. One or two sentences shown in Google results. Falls back to the start of the curatorial text.',
      validation: (rule) => rule.max(160),
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', dateText: 'dateText', venue: 'venue', media: 'coverImage' },
    prepare: ({ title, dateText, venue, media }) => ({
      title,
      subtitle: [dateText, venue].filter(Boolean).join(' · '),
      media,
    }),
  },
})
