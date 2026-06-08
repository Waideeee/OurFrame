import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { PageContainer } from '@/components/layout';
import { LoginPage, SignUpPage } from '@/features/auth';
import { ProfileSelectionPage, AddProfilePage, EditProfilePage } from '@/features/profiles';
import { HomePage, EditMemoryPage } from '@/features/memories';
import { VideosPage } from '@/features/videos';
import { PhotosPage } from '@/features/photos';
import { MyListsPage } from '@/features/my-lists';
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
      { path: '/profiles/new', element: <AddProfilePage /> },
      { path: '/profiles/edit/:id', element: <EditProfilePage /> },

      // Content routes share the Navbar + Footer shell.
      {
        element: <PageContainer />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/memories/edit/:id', element: <EditMemoryPage /> },
          { path: '/videos', element: <VideosPage /> },
          { path: '/photos', element: <PhotosPage /> },
          { path: '/recently-added', element: <RecentlyAddedPage /> },
          { path: '/my-lists', element: <MyListsPage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/upload', element: <UploadPage /> },
        ],
      },
    ],
  },
]);
