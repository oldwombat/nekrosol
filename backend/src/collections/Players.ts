import type { CollectionConfig } from 'payload'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'role',
      label: 'Role',
      type: 'text',
      defaultValue: 'player',
      required: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
}
