import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { PageContainer } from '@/components/layout';
import { LoginPage, SignUpPage } from '@/features/auth';
import { ProfileSelectionPage } from '@/features/profiles';
import { HomePage } from '@/features/memories';
import { VideosPage } from '@/features/videos';
import { PhotosPage } from '@/features/photos';
import { CollectionPage } from '@/features/collection';
import { RecentlyAddedPage } from '@/features/recently-added';
import { SearchPage } from '@/features/search';
import { UploadPage } from '@/features/upload';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Full-bleed routes without the content shell.
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/profiles', element: <ProfileSelectionPage /> },

      // Content routes share the Navbar + Footer shell.
      {
        element: <PageContainer />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/videos', element: <VideosPage /> },
          { path: '/photos', element: <PhotosPage /> },
          { path: '/recently-added', element: <RecentlyAddedPage /> },
          { path: '/collection', element: <CollectionPage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/upload', element: <UploadPage /> },
        ],
      },
    ],
  },
]);
