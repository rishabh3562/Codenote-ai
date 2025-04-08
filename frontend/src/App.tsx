import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from './lib/auth';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import { TailSpin } from 'react-loader-spinner';
// 👇 lazyNamed util
export function lazyNamed<T>(
  factory: () => Promise<T>,
  name: keyof T
): React.LazyExoticComponent<React.ComponentType<any>> {
  return lazy(() =>
    factory().then((module) => ({
      default: module[name] as unknown as React.ComponentType<any>,
    }))
  );
}

// 👇 Lazy imports
const LandingPage = lazyNamed(() => import('@/pages/landing'), 'LandingPage');
const LoginPage = lazyNamed(() => import('@/pages/auth/login'), 'LoginPage');
const SignupPage = lazyNamed(() => import('@/pages/auth/signup'), 'SignupPage');
const DashboardPage = lazyNamed(
  () => import('@/pages/dashboard'),
  'DashboardPage'
);
const RepositoriesPage = lazyNamed(
  () => import('@/pages/repositories'),
  'RepositoriesPage'
);
const RepositoryPage = lazyNamed(
  () => import('@/pages/repository'),
  'RepositoryPage'
);
const RepositoryStatsPage = lazyNamed(
  () => import('@/pages/repository-stats'),
  'RepositoryStatsPage'
);
const BranchesPage = lazyNamed(
  () => import('@/pages/branches'),
  'BranchesPage'
);
const PullRequestsPage = lazyNamed(
  () => import('@/pages/pull-requests'),
  'PullRequestsPage'
);
const UserAnalysisPage = lazyNamed(
  () => import('@/pages/user-analysis'),
  'UserAnalysisPage'
);
const SettingsPage = lazyNamed(
  () => import('@/pages/settings'),
  'SettingsPage'
);
const AIInsightsPage = lazyNamed(
  () => import('@/pages/ai-insights'),
  'AIInsightsPage'
);
const StatsPage = lazyNamed(() => import('@/pages/stats'), 'StatsPage');

const Loader = () => (
  <div className="flex justify-center items-center h-full w-full p-8">
    <TailSpin
      height="40"
      width="40"
      color="currentColor"
      ariaLabel="loading"
      wrapperStyle={{}}
      visible={true}
    />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  const { init, user, isAuthenticated, isLoading } = useAuth();
  const hasInitialized = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      init().finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  console.log('after loading in app.tsx', user, isAuthenticated, isLoading);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {user && (
              <Route element={<AuthenticatedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/repositories" element={<RepositoriesPage />} />
                <Route path="/repository/:id" element={<RepositoryPage />} />
                <Route
                  path="/repository/:id/stats"
                  element={<RepositoryStatsPage />}
                />
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/pull-requests" element={<PullRequestsPage />} />
                <Route path="/user-analysis" element={<UserAnalysisPage />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
