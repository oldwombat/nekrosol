import type { CollectionConfig } from 'payload'

type AccessRequest = {
  user?: {
    id?: string | number
    collection?: string
  }
}

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Allow public signup from the app.
    create: () => true,
    // Players can read/update their own profile; admin users can read/update all.
    read: ({ req }: { req: AccessRequest }) => {
      if (req.user?.collection === 'users') return true;
      if (req.user?.collection === 'players') {
        return {
          id: {
            equals: req.user.id,
          },
        };
      }
      return false;
    },
    update: ({ req }: { req: AccessRequest }) => {
      if (req.user?.collection === 'users') return true;
      if (req.user?.collection === 'players') {
        return {
          id: {
            equals: req.user.id,
          },
        };
      }
      return false;
    },
    delete: ({ req }: { req: AccessRequest }) => req.user?.collection === 'users',
  },
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
