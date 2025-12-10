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
import { UsersList } from './pages/users/list';
import { SubjectsList } from './pages/subjects/list';
import { SubjectsCreate } from './pages/subjects/create';
import { ClassesList } from './pages/classes/list';
import { EnrollmentList } from './pages/enrollments';
import { dataProvider } from './providers/dataProvider';
import { UsersEdit } from './pages/users/edit';
import { SubjectsEdit } from './pages/subjects/edit';
import { ClassesCreate } from './pages/classes/create';
import { ClassesEdit } from './pages/classes/edit';
import { ClassesShow } from './pages/classes/show';
import { BookOpen, GraduationCap, Home, Layers, User } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            routerProvider={routerProvider}
            authProvider={authProvider}
            dataProvider={dataProvider}
            resources={[
              {
                name: 'dashboard',
                list: '/dashboard',
                meta: {
                  label: 'Dashboard',
                  icon: <Home className='text-gray-200' />,
                },
              },
              {
                name: 'enrollments',
                list: '/enrollments',
                meta: {
                  label: 'Join Classes',
                  icon: <Layers className='text-gray-200' />,
                },
              },
              {
                name: 'users',
                list: '/users',
                edit: '/users/edit/:id',
                show: '/users/show/:id',
                meta: {
                  label: 'Faculty',
                  icon: <User className='text-gray-200' />,
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
                  icon: <BookOpen className='text-gray-200' />,
                },
              },
              {
                name: 'classes',
                list: '/classes',
                create: '/classes/create',
                edit: '/classes/edit/:id',
                show: '/classes/show/:id',
                meta: {
                  label: 'Classes',
                  icon: <GraduationCap className='text-gray-200' />,
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

                <Route path='/dashboard' element={<Dashboard />} />

                <Route path='users'>
                  <Route index element={<UsersList />} />
                  <Route path='edit/:id' element={<UsersEdit />} />
                </Route>

                <Route path='subjects'>
                  <Route index element={<SubjectsList />} />
                  <Route path='create' element={<SubjectsCreate />} />
                  <Route path='edit/:id' element={<SubjectsEdit />} />
                </Route>

                <Route path='classes'>
                  <Route index element={<ClassesList />} />
                  <Route path='create' element={<ClassesCreate />} />
                  <Route path='edit/:id' element={<ClassesEdit />} />
                  <Route path='show/:id' element={<ClassesShow />} />
                </Route>

                <Route path='/enrollments' element={<EnrollmentList />} />

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
