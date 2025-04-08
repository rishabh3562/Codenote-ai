import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";
import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import { DashboardPage } from "@/pages/dashboard";
import { RepositoriesPage } from "@/pages/repositories";
import { RepositoryPage } from "@/pages/repository";
import { RepositoryStatsPage } from "@/pages/repository-stats";
import { BranchesPage } from "@/pages/branches";
import { PullRequestsPage } from "@/pages/pull-requests";
import { UserAnalysisPage } from "@/pages/user-analysis";
import { SettingsPage } from "@/pages/settings";
import { AIInsightsPage } from "@/pages/ai-insights";
import { StatsPage } from "@/pages/stats";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "./lib/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  const { init, user } = useAuth();
  const hasInitialized = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      init().finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          {user && (
            <Route element={<AuthenticatedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/repositories" element={<RepositoriesPage />} />
              <Route path="/repository/:id" element={<RepositoryPage />} />
              <Route path="/repository/:id/stats" element={<RepositoryStatsPage />} />
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
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
