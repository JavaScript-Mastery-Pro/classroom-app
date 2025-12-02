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

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine routerProvider={routerProvider} resources={[]}>
            <Routes>
              {/* Auth routes */}
              <Route
                element={
                  <Authenticated key='auth-pages' fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>

              {/* Protected routes */}
              <Route
                element={
                  <Authenticated key='protected-routes'>
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource />} />
                <Route path='/dashboard' element={<Dashboard />} />
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
