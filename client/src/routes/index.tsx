import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from '../providers/auth-provider';

// Layouts
import { AuthLayout } from '../layouts/auth-layout';
import { DashboardLayout } from '../layouts/dashboard-layout';
import { ProtectedRoute } from './protected-route';

// Public pages
import { HomePage } from '../pages/landing/home-page';

// Auth pages
import { LoginPage } from '../features/auth/pages/login-page';
import { RegisterPage } from '../features/auth/pages/register-page';

// Expat pages
import { ExpatDashboard } from '../features/expat/pages/expat-dashboard';
import { RequestsList } from '../features/expat/pages/requests-list';
import { CreateRequest } from '../features/expat/pages/create-request';
import { RequestDetail } from '../features/expat/pages/request-detail';
import { ExpatProfile } from '../features/expat/pages/expat-profile';
import { PaymentCallbackPage } from '../features/procurement/pages/payment-callback';

// Runner pages
import { RunnerDashboard } from '../features/runner/pages/runner-dashboard';
import { OpenJobs } from '../features/runner/pages/open-jobs';
import { JobDetail } from '../features/runner/pages/job-detail';
import { RunnerProfile } from '../features/runner/pages/runner-profile';

// Admin pages
import { AdminDashboard } from '../features/admin/pages/admin-dashboard';
import { AdminRequestsList } from '../features/admin/pages/admin-requests-list';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#0b0c10] text-neutral-900 dark:text-neutral-100">
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <p className="text-neutral-500 mt-2">Page not found.</p>
      <a href="/" className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        Go back home
      </a>
    </div>
  );
}

function RoleRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes (redirects if already logged in) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/procurement/payment/callback" element={<PaymentCallbackPage />} />

        {/* Dashboard redirect */}
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* Expat Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['expat']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/expat/dashboard" element={<ExpatDashboard />} />
            <Route path="/expat/requests" element={<RequestsList />} />
            <Route path="/expat/requests/new" element={<CreateRequest />} />
            <Route path="/expat/requests/:id" element={<RequestDetail />} />
            <Route path="/expat/profile" element={<ExpatProfile />} />
          </Route>
        </Route>

        {/* Runner Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['runner']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/runner/dashboard" element={<RunnerDashboard />} />
            <Route path="/runner/jobs" element={<OpenJobs />} />
            <Route path="/runner/jobs/:id" element={<JobDetail />} />
            <Route path="/runner/profile" element={<RunnerProfile />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<AdminRequestsList />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
