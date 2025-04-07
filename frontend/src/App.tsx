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
import axios from "axios";
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
  const { init, user } = useAuth(); // Zustand: no re-renders
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

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const hasFetched = useRef(false);

//   useEffect(() => {
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       axios
//         .get("http://localhost:5000/api/auth/session", {
//           withCredentials: true,
//         })
//         .then((res) => setUser(res.data.user))
//         .catch(() => setUser(null))
//         .finally(() => setLoading(false));
//     }
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />

//           {/* Protected Routes */}
//           {user && (
//             <Route element={<AuthenticatedLayout />}>
//               <Route path="/dashboard" element={<DashboardPage />} />
//               <Route path="/repositories" element={<RepositoriesPage />} />
//               <Route path="/repository/:id" element={<RepositoryPage />} />
//               <Route path="/repository/:id/stats" element={<RepositoryStatsPage />} />
//               <Route path="/branches" element={<BranchesPage />} />
//               <Route path="/pull-requests" element={<PullRequestsPage />} />
//               <Route path="/user-analysis" element={<UserAnalysisPage />} />
//               <Route path="/ai-insights" element={<AIInsightsPage />} />
//               <Route path="/stats" element={<StatsPage />} />
//               <Route path="/settings" element={<SettingsPage />} />
//             </Route>
//           )}

//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//         <Toaster />
//       </BrowserRouter>
//     </QueryClientProvider>
//   );
// }

export default App;



// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// const getSession = async () => {
//   const res = await axios.get("http://localhost:5000/api/auth/session", {
//     withCredentials: true, // sends cookies
//   });
//   return res.data.user;
// };

// const App = () => {
//   const [user, setUser] = useState(null);
//   const fetched = useRef(false); // guard

//   useEffect(() => {
//     if (fetched.current) return;
//     fetched.current = true;

//     getSession()
//       .then(setUser)
//       .catch((err) => console.error("Session error:", err));
//   }, []);

//   return <div>{user ? `Hello, ${user.name as string}` : "Loading..."}</div>;
// };


// export default App;
