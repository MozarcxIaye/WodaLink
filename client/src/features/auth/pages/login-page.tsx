import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../providers/auth-provider';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginSchemaInput = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sessionExpired = searchParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaInput) => {
    setErrorMsg(null);
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      // Navigate to correct dashboard based on role inside AuthProvider (or here since we refresh me)
      // We can fetch me and get user role
      // Let's redirect dynamically. We can get user from localStorage / me request
      // Let's redirect to me.
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        // Parse JWT payload to determine role
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        navigate(`/${payload.role}/dashboard`);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setErrorMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-neutral-500">Enter your credentials to access your procurement panel.</p>
      </div>

      {sessionExpired && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Session expired. Please log in again.</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                errors.password
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 outline-none transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
