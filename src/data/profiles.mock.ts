import type { Profile } from '@/types';

export const profiles: Profile[] = [
  {
    id: 'p-1',
    name: 'Partner 1',
    avatarUrl: 'https://picsum.photos/seed/ourframe-partner1/300/300',
    kind: 'partner',
  },
  {
    id: 'p-2',
    name: 'Partner 2',
    avatarUrl: 'https://picsum.photos/seed/ourframe-partner2/300/300',
    kind: 'partner',
  },
  {
    id: 'p-shared',
    name: 'Our Story',
    avatarUrl: 'https://picsum.photos/seed/ourframe-ourstory/300/300',
    kind: 'shared',
  },
  {
    id: 'p-add',
    name: 'Add Profile',
    avatarUrl: '',
    kind: 'add',
  },
];

export const selectableProfiles = profiles.filter((p) => p.kind !== 'add');
