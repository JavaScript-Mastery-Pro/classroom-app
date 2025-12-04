import { Authenticated, Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';

import routerProvider, {
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';

import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import './App.css';
import { ErrorComponent } from './components/refine-ui/layout/error-component';
import { Layout } from './components/refine-ui/layout/layout';
import { Toaster } from './components/refine-ui/notification/toaster';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Dashboard } from './pages/dashboard';
import { authProvider } from './providers/authProvider';
import { ProfilePage } from './pages/profile';
import { FacultyList } from './pages/faculty/list';
import { SubjectsList } from './pages/subjects/list';
import { ClassesList } from './pages/classes/list';
import { JoinClassesList } from './pages/join-classes';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            routerProvider={routerProvider}
            authProvider={authProvider}
            resources={[
              {
                name: 'dashboard',
                list: '/dashboard',
                meta: {
                  label: 'Dashboard',
                  icon: '📊',
                },
              },
              {
                name: 'faculty',
                list: '/faculty',
                edit: '/faculty/edit/:id',
                show: '/faculty/show/:id',
                meta: {
                  label: 'Faculty',
                  icon: '👨‍🏫',
                },
              },
              {
                name: 'subjects',
                list: '/subjects',
                create: '/subjects/create',
                edit: '/subjects/edit/:id',
                show: '/subjects/show/:id',
                meta: {
                  label: 'Subjects',
                  icon: '📚',
                },
              },
              {
                name: 'classes',
                list: '/classes',
                create: '/classes/create',
                edit: '/classes/edit/:id',
                show: '/classes/details/:id',
                meta: {
                  label: 'Classes',
                  icon: '🏫',
                },
              },
              {
                name: 'join-classes',
                list: '/join-classes',
                meta: {
                  label: 'Join Classes',
                  icon: '🎓',
                },
              },
            ]}
          >
            <Routes>
              {/* Public Routes */}
              <Route
                element={
                  <Authenticated key='public-routes' fallback={<Outlet />}>
                    <NavigateToResource fallbackTo='/dashboard' />
                  </Authenticated>
                }
              >
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>

              {/* Protected Routes */}
              <Route
                element={
                  <Authenticated key='protected-routes'>
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                {/* Default route after login */}
                <Route
                  index
                  element={<NavigateToResource fallbackTo='/dashboard' />}
                />

                {/* Dashboard */}
                <Route path='/dashboard' element={<Dashboard />} />

                {/* Profile */}
                <Route path='/profile' element={<ProfilePage />} />

                <Route path='faculty'>
                  <Route index element={<FacultyList />} />
                  {/* <Route path="edit/:id" element={<FacultyCreate />} /> */}
                </Route>

                <Route path='subjects'>
                  <Route index element={<SubjectsList />} />
                  {/* <Route path="create" element={<SubjectsCreate />} /> */}
                  {/* <Route path="edit/:id" element={<SubjectsEdit />} /> */}
                </Route>

                <Route path='classes'>
                  <Route index element={<ClassesList />} />
                  {/* <Route path="create" element={<ClassesCreate />} /> */}
                  {/* <Route path="edit/:id" element={<ClassesEdit />} /> */}
                </Route>

                {/* Profile */}
                <Route path='/join-classes' element={<JoinClassesList />} />

                {/* Refine resource routes */}
                <Route path='/*' element={<Outlet />} />

                {/* Catch-all */}
                <Route path='*' element={<ErrorComponent />} />
              </Route>
            </Routes>

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
