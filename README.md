# OurFrame

A Netflix-inspired, private streaming-style hub for couples to archive their memories —
photos, videos, and collections — as if each one were a featured release.

---

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the Vite dev server at http://localhost:5173
```

Other scripts:

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run build`     | Type-check (`tsc -b`) and build for production |
| `npm run preview`   | Preview the production build locally           |
| `npm run lint`      | ESLint over `src` (max-warnings 0)             |
| `npm run typecheck` | `tsc --noEmit` only                            |
| `npm run format`    | Prettier write over `src`                      |

**Requirements:** Node 18+ (developed on Node 24). No backend required — every page is
driven by the mock data in `src/data`.

---

## Tech stack

- **React 18 + Vite** (TypeScript, strict mode)
- **React Router v6** (`createBrowserRouter`) — routing + the new profile/memory edit routes
- **Tailwind CSS** configured with the design tokens below
- **Framer Motion** — hover / scale / transition animation and the detail-modal
  enter/exit (`AnimatePresence`, including `onExitComplete` so a delete doesn't orphan
  the closing overlay)
- **lucide-react** icons, **Inter** via `@fontsource/inter`
- Utilities: **clsx** + **tailwind-merge** (`cn`)

> **Dependencies:** every feature added (upload fields & multi-media, profile and
> memory add/edit/delete, the detail modal, episode list, My Lists, and the
> "uploaded by" credit) is built entirely on the libraries above — **no new runtime
> packages were introduced.** Run `npm install` to pull the versions pinned in
> `package.json` / `package-lock.json`.

---

## Folder structure

```
src/
├── app/                 # App shell, router, context providers
│   ├── App.tsx          # ProfileProvider + MemoryProvider + scroll-to-top + <Outlet/>
│   ├── router.tsx       # all route definitions
│   └── providers/       # ProfileProvider (profiles + active profile + CRUD),
│                        #   MemoryProvider (live memory store + detail modal)
├── components/
│   ├── ui/              # primitives: Button, CategoryChip, Input, Badge
│   ├── layout/          # Navbar, Footer, PageContainer, AuthLayout, Logo
│   ├── media/           # MemoryCard, MediaRow, HeroBanner, FeaturedGrid,
│   │                    #   MemoryDetailModal (Netflix-style overlay)
│   └── common/          # Timeline, ProfileCard, SearchBar, Dropzone
├── features/            # one folder per page (auth, profiles, memories,
│                        #   videos, photos, collection, my-lists,
│                        #   recently-added, search, upload) — barrel-exported
├── data/                # *.mock.ts — single source of truth, API-shaped
├── hooks/               # useScrollPosition, useMediaQuery
├── lib/                 # constants.ts, utils.ts (cn, formatters)
├── types/               # Memory, Collection, Profile, MediaType, …
└── styles/globals.css   # Tailwind directives + CSS variable tokens
```

The mock layer (`src/data`) returns the exact domain shapes declared in `src/types`, so a
real API can be dropped in later without touching component code.

---

## Routes

| Path                 | Screen                                            |
| -------------------- | ------------------------------------------------- |
| `/login`             | Sign In                                           |
| `/signup`            | Sign Up                                           |
| `/profiles`          | "Who's watching?" profile selection + Manage mode |
| `/profiles/new`      | Add Profile (name + avatar upload)                |
| `/profiles/edit/:id` | Edit Profile (rename, change avatar, delete)      |
| `/`                  | Home — **Memories** (hero + rows + featured grid) |
| `/videos`            | Videos (continue-watching + rows)                 |
| `/photos`            | Photos (filter by mood + anniversaries grid)      |
| `/recently-added`    | Recently Added timeline + add FAB                 |
| `/collection`        | Our Collection (types, albums, highlights)        |
| `/my-lists`          | My Lists (My List, Loved, Archived + collections) |
| `/search`            | Search with live filtering                        |
| `/upload`            | New Premiere (dropzone + production details)      |
| `/memories/edit/:id` | Edit Memory (fields, media captions, delete)      |

Auth/profile routes render full-bleed; all content routes share the
`PageContainer` shell (sticky `Navbar` + `Footer`).

---

## Features

All interactive state lives in two React context providers seeded from the mock data
layer, so a real API can be swapped in later without touching components:

- **`ProfileProvider`** — the active profile **and** the editable profile list
  (`addProfile` / `updateProfile` / `deleteProfile`).
- **`MemoryProvider`** — the live memory store with selectors (`getMemory`,
  `memoriesByType`, `recentMemories`, …) and mutators (`addMemory`, `updateMemory`,
  `deleteMemory`, `toggleArchive`, `toggleLike`, `toggleCollection`) plus the
  shared detail-modal controls (`openMemory` / `closeMemory`).

> **Note:** state is in-memory only (no persistence) — uploads, edits, deletes,
> likes, and archive changes reset on a full page reload, by design for the mock.

### Create / upload a memory (`/upload`)

- Fields: **Title, Release Date, Location** (pin icon), **Category, Mood, The Story**,
  and an **"Is Featured?"** toggle (featured memories surface on the home grid).
- **Multiple media files** per memory — each uploaded file shows a thumbnail preview
  with an optional **caption** input.
- **Media type is auto-detected** from the file extension (`.mp4/.mov/.webm/…` →
  video, otherwise photo) via `detectMediaType()` in `src/lib/utils.ts`.

### Netflix-style memory detail modal

- Clicking any memory card (home, rows, grids, timeline, search, My Lists) opens a
  large overlay instead of navigating away. Click outside, the ✕, or press `Esc` to close.
- Big media with a **Play / View** button (full-screen viewer; uploaded videos play
  inline), circular **Like**, **Add to Collection**, and **Info** actions, the title,
  date • location • mood, a red **category** badge, the story, and an
  **"Uploaded by / Mood / Category"** column.
- **Manage actions:** an **Add/Remove from Archive** toggle plus icon-only
  **Edit** (✏️) and **Delete** (🗑️) buttons. Delete asks for confirmation inline.

### Episode-style media list

Memories with multiple media (`mediaItems`) render a Netflix-episode-style scroll list
in the modal — numbered rows with a thumbnail, auto-label ("Photo 1", "Video 2"), and
per-media caption. Click an item to open it full-screen.

### Who posted each memory

Every memory carries an **`uploadedBy`** profile name (seed memories are credited
automatically; uploads use the active profile). It's shown on the card hover overlay,
the featured grid, the recently-added timeline, and the detail modal.

### Edit & delete memories

- **Edit** (modal ✏️ → `/memories/edit/:id`): change every field, swap the cover
  image, edit or remove individual media captions, then **Save** or **Delete**.
- **Delete** (modal 🗑️ or the edit page) removes the memory everywhere immediately.
- Pages that reference a specific memory by id (e.g. the home hero) fall back
  gracefully if that memory is deleted.

### Profiles — add / edit / delete

- **Add Profile** (`/profiles/new`): name + square avatar upload.
- **Edit Profile** (`/profiles/edit/:id`): rename, change the avatar, or delete.
- On `/profiles`, the **+** tile opens Add, and **Manage Profiles** flips the grid into
  edit mode so tapping a profile opens its Edit page.

### Archive & My Lists

- Any memory can be **archived / un-archived** from the modal (reverses the `archived`
  flag).
- **My Lists** (`/my-lists`) gathers everything you've saved in one place: **My List**
  (added to collection), **Loved** (hearted), **Archived**, and **All Collections** —
  each with an empty-state hint.

---

## Customizing content (pictures, text & data)

Almost everything you see in the app is driven by a few plain data files — there is no
backend or CMS. Edit a file, save, and Vite hot-reloads the page instantly.

### Where each thing lives

| What you want to change                                                                                                                                          | File to edit                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Memory photos/videos** (cards, hero, timeline) — title, description, date, location, image, hearts, `mood`, `category`, `featured`, `uploadedBy`, `mediaItems` | [`src/data/memories.mock.ts`](src/data/memories.mock.ts)                              |
| **Who gets credited** for the seed memories (`uploadedBy`)                                                                                                       | the `SEED_UPLOADERS` list in [`src/data/memories.mock.ts`](src/data/memories.mock.ts) |
| **Collections / albums** — title, description, cover image, counts, year                                                                                         | [`src/data/collections.mock.ts`](src/data/collections.mock.ts)                        |
| **Profiles** ("Who's watching?") — names + avatars                                                                                                               | [`src/data/profiles.mock.ts`](src/data/profiles.mock.ts)                              |
| **Upload/edit dropdown options** — `UPLOAD_CATEGORIES`, `UPLOAD_MOODS`                                                                                           | [`src/lib/constants.ts`](src/lib/constants.ts)                                        |
| **App name, tagline, nav links, filter chips, footer links**                                                                                                     | [`src/lib/constants.ts`](src/lib/constants.ts)                                        |
| **Page headings & body copy** (e.g. the "Recently Added" intro line)                                                                                             | the matching page in [`src/features/<page>/`](src/features)                           |
| **Footer / Navbar / Logo text**                                                                                                                                  | [`src/components/layout/`](src/components/layout)                                     |

### Replacing pictures

There are two ways an image can be referenced:

1. **Local images (recommended for your own photos).** Drop the file into the
   [`public/`](public) folder, then reference it with a root-relative path starting with
   `/`. For example, `public/lizard.jpg` is referenced as `'/lizard.jpg'`. Use simple
   filenames — lowercase, no spaces or emoji (rename `My Photo 🤫.jpg` → `my-photo.jpg`).

   ```ts
   // in src/data/memories.mock.ts
   imageUrl: '/lizard.jpg',
   ```

2. **Remote / placeholder images.** By default the mock data calls the `img()` helper at
   the top of [`src/data/memories.mock.ts`](src/data/memories.mock.ts), which returns a
   placeholder URL. To use one specific photo for a memory, just replace its `imageUrl`
   (or a collection's `coverUrl` / a profile's `avatarUrl`) with any image URL or a
   `/public` path. Profile avatars and collection covers work exactly the same way.

> **Tip — same picture everywhere:** the `img()` helper is the single function every
> mock file calls for images, so changing what it returns swaps the artwork across the
> whole app at once. To change just one item, edit that item's `imageUrl` directly
> instead.

### Replacing text

- **Memory/collection wording** (the titles and captions under each card): edit the
  `title` and `description` fields in the two mock files above.
- **Site-wide labels** (the "OURFRAME" brand name, the nav menu, the mood/genre filter
  chips, footer links): edit the exported constants in
  [`src/lib/constants.ts`](src/lib/constants.ts).
- **A specific page's heading or intro paragraph:** open that page's component under
  [`src/features/`](src/features) — e.g. the "Recently Added" intro is the `<p>` in
  [`src/features/recently-added/RecentlyAddedPage.tsx`](src/features/recently-added/RecentlyAddedPage.tsx).

All data files conform to the types in [`src/types/index.ts`](src/types/index.ts), so keep
the field names (`title`, `imageUrl`, `date`, …) intact — just change their values.

---

## Design tokens

Defined in `tailwind.config.ts` and mirrored as CSS variables in
`src/styles/globals.css`.

**Colors**

| Token                  | Value     |
| ---------------------- | --------- |
| `background`           | `#131313` |
| `canvas`               | `#000000` |
| `surface`              | `#181818` |
| `surface-container`    | `#201f1f` |
| `surface-high`         | `#2a2a2a` |
| `primary` (brand red)  | `#e50914` |
| `primary-accent`       | `#ffb4aa` |
| `on-surface` (text)    | `#e5e2e1` |
| `metadata` (secondary) | `#b3b3b3` |
| `outline`              | `#af8782` |
| `outline-variant`      | `#5e3f3b` |

**Typography** (Inter): `display-lg` 56/800, `headline-lg` 32/700 (mobile 24),
`title-md` 18/600, `body-md` 16/400, `label-sm` 12/500.

**Shape & spacing:** media cards & buttons `rounded-card` (4px), avatars
`rounded-avatar` (8px), chips/pills `rounded-full`. Container max-width `1440px`,
`4%` horizontal edge padding (`px-edge` / `.container-edge`), `40px` row gaps and
`64px` section gaps.

**Elevation** uses luminance + scale, not shadows: cards scale to `1.1` on hover with
a brand-red glow; heroes use a bottom-vignette gradient for text legibility.
