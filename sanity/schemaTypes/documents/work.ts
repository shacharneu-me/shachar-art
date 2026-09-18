import { defineField, defineType } from 'sanity'

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'MMMM YYYY' },
      description: 'Used to order the Works page, newest first.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayDate',
      title: 'Date shown on the site',
      type: 'string',
      description: 'Optional. Leave empty to show only the year. Use for ranges such as “2022–2024”.',
    }),
    defineField({
      name: 'materials',
      type: 'text',
      rows: 2,
      description: 'For example: Oil on linen, 120 × 90 cm',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'richText',
    }),
    defineField({
      name: 'coverImage',
      title: 'Main image',
      type: 'figure',
      description: 'Shown in the Works list.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'More images',
      type: 'array',
      of: [{ type: 'figure' }],
      options: { layout: 'grid' },
      description: 'Optional. Shown alongside the main image when the work is opened.',
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Title, A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'date', displayDate: 'displayDate', media: 'coverImage' },
    prepare: ({ title, date, displayDate, media }) => ({
      title,
      subtitle: displayDate || (typeof date === 'string' ? date.slice(0, 4) : undefined),
      media,
    }),
  },
})
