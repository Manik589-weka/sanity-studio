import {defineType, defineField, defineArrayMember} from 'sanity'
import {FiEdit} from 'react-icons/fi'
import {portableTextConfig} from '../objects/portableTextConfig'

export default defineType({
  name: 'blogPost',
  title: 'All Blog Posts',
  type: 'document',
  icon: FiEdit,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'metadata', title: 'Metadata'},
  ],
  fields: [
    // ─── Content (1–10) ─────────────────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Migration Status',
      type: 'string',
      options: {
        list: [
          {title: 'Is updated', value: 'isUpdated'},
          {title: 'Needs updating', value: 'needsUpdating'},
          {title: 'Archive/Delete', value: 'archiveDelete'},
          {title: 'Help needed', value: 'helpNeeded'},
        ],
        layout: 'dropdown',
        aiAssist: {exclude: true},
      },
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {aiAssist: {exclude: true}},
      validation: (Rule) => Rule.required().max(142),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        aiAssist: {exclude: true},
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
      options: {aiAssist: {exclude: true}},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as any
          if (doc?.publishedAt && !value) {
            return 'Featured image is required for published articles'
          }
          return true
        }),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary',
      type: 'array',
      options: {
        aiAssist: {},
      },
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                  },
                ],
              },
            ],
          },
        }),
      ],
      description: 'TL;DR summary for blog posts',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      ...portableTextConfig,
      options: {aiAssist: {exclude: true}},
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'reference',
      to: [{type: 'cta'}],
      options: {aiAssist: {exclude: true}},
      description: 'Optional call-to-action to include',
      group: 'content',
    }),

    // ─── Metadata (11–16 + hidden OG) ───────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      options: {aiAssist: {exclude: true}},
      validation: (Rule) => Rule.required(),
      group: 'metadata',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      options: {aiAssist: {exclude: true}},
      description: 'Override the document title for search engines (50–60 characters)',
      validation: (Rule) => Rule.max(60).warning('Keep meta titles under 60 characters'),
      group: 'metadata',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      options: {aiAssist: {exclude: true}},
      description: 'Brief description for search engines (120–160 characters)',
      validation: (Rule) =>
        Rule.max(160)
          .min(120)
          .warning('Meta descriptions should be between 120–160 characters'),
      group: 'metadata',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      options: {aiAssist: {exclude: true}},
      description: 'Set if this content is duplicated elsewhere',
      group: 'metadata',
    }),
    defineField({
      name: 'lastUpdatedAt',
      title: 'Last Updated Date',
      type: 'datetime',
      options: {aiAssist: {exclude: true}},
      description: 'When this post was last updated',
      group: 'metadata',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index and No Follow?',
      type: 'boolean',
      options: {aiAssist: {exclude: true}},
      description: 'Prevent this page from appearing in search engines',
      initialValue: false,
      group: 'metadata',
    }),
    // Hidden OG fields (mapped from Featured image / Meta title / Meta description at display time)
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Defaults to Featured image when empty',
      options: {hotspot: true, aiAssist: {exclude: true}},
      hidden: () => true,
      group: 'metadata',
    }),
    defineField({
      name: 'ogTitle',
      title: 'OG Title',
      type: 'string',
      options: {aiAssist: {exclude: true}},
      description: 'Defaults to Meta title when empty',
      hidden: () => true,
      group: 'metadata',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description',
      type: 'text',
      rows: 2,
      options: {aiAssist: {exclude: true}},
      description: 'Defaults to Meta description when empty',
      hidden: () => true,
      group: 'metadata',
    }),
    // Kept in metadata (hidden) so existing migration data is not lost
    defineField({
      name: 'migrationData',
      title: 'Migration Data',
      type: 'migrationMetadata',
      options: {aiAssist: {exclude: true}},
      hidden: () => true,
      group: 'metadata',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, author, media, publishedAt}) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'
      return {
        title: title || 'Untitled',
        subtitle: `${author || 'No author'} • ${date}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
