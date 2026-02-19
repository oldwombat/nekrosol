import type { CollectionConfig } from 'payload'

export const Lore: CollectionConfig = {
  slug: 'lore',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'tag',
          label: 'Tag',
          type: 'text',
          required: true,
        },
      ]
    },
    {
      name: 'owner',
      label: 'Owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      visible: false,
    },
  ],
}
