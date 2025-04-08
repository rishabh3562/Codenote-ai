import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { useAuth } from '@/lib/auth';
export function AuthenticatedLayout() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  if (user === null) {
    return <div>Loading...</div>; // Show loading while fetching user session
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-16">
        <Outlet />
      </main>
    </div>
  );
}

// import React from 'react';
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { Sidebar } from './sidebar';
// import { useAuth } from '@/lib/auth';

// export function AuthenticatedLayout() {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar />
//       <main className="pl-16">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
