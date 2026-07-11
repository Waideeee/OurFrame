import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { PageContainer } from '@/components/layout';
import { ForgotPasswordPage, LoginPage, SignUpPage, VerifyForgotPasswordPage , NewPasswordPage} from '@/features/auth';
import { ProfileSelectionPage, AddProfilePage, EditProfilePage } from '@/features/profiles';
import { ProfilePage } from '@/features/profile';
import { SettingsPage, ChangeEmailPage, ChangePasswordPage } from '@/features/settings';
import { HomePage, EditMemoryPage } from '@/features/memories';
import { VideosPage } from '@/features/videos';
import { PhotosPage } from '@/features/photos';
import { MyListsPage } from '@/features/my-lists';
import { RecentlyAddedPage } from '@/features/recently-added';
import { SearchPage } from '@/features/search';
import { UploadPage } from '@/features/upload';
import { VerifyEmailPage } from '@/features/auth/VerifyEmailPage';
import { VerifyEmailChangePage } from '@/features/settings/VerifyEmailChangePage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { GuestRoute } from '@/features/auth/GuestRoute';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Full-bleed routes without the content shell.
      { path: '/login', element: (<GuestRoute><LoginPage /></GuestRoute>) },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/profiles', element: <ProfileSelectionPage /> },
      { path: '/profiles/new', element: <AddProfilePage /> },
      { path: '/profiles/edit/:id', element: <EditProfilePage /> },
      {path: '/forgot-password', element: <ForgotPasswordPage/>},
      {path: '/verify-forgot-password', element: <VerifyForgotPasswordPage />},
      {path: '/new-password', element: <NewPasswordPage  />},
      { path: '/verify-email', element: <VerifyEmailPage /> },

      // Content routes share the Navbar + Footer shell.
      {
        element: (
          <ProtectedRoute> 
            <PageContainer />
          </ProtectedRoute>
       
      ),
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/settings/change-email', element: <ChangeEmailPage /> },
          { path: '/settings/password', element: <ChangePasswordPage /> },
          { path: '/settings/change-email/verify', element: <VerifyEmailChangePage /> },
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
