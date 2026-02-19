import { defineType, defineField } from 'sanity'
import { FiGlobe } from 'react-icons/fi'

export default defineType({
  name: 'seoDefaults',
  title: 'SEO Defaults',
  type: 'document',
  icon: FiGlobe,
  description:
    'Default values used for Meta Title and Meta Description when creating new blog posts.',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Default Meta Title',
      type: 'string',
      description: 'Maps to Meta Title on blog posts when left empty.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      description: 'Maps to Meta Description on blog posts when left empty.',
    }),
  ],
})
