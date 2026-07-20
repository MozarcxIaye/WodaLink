import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../providers/auth-provider';
import { useNavigate, Link } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User as UserIcon, Building2, ShieldAlert } from 'lucide-react';

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    role: z.enum(['expat', 'runner', 'admin'] as const),
    municipalityId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'runner' && (!data.municipalityId || data.municipalityId.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Municipality is required for Runner registration',
      path: ['municipalityId'],
    }
  );

type RegisterSchemaInput = z.infer<typeof registerSchema>;

// Pre-defined list of major Nepalese Municipalities for selection
const NEPAL_MUNICIPALITIES = [
  { id: 'KTM', name: 'Kathmandu Metropolitan City' },
  { id: 'LAL', name: 'Lalitpur Metropolitan City' },
  { id: 'PKH', name: 'Pokhara Metropolitan City' },
  { id: 'BHT', name: 'Bharatpur Metropolitan City' },
  { id: 'BRT', name: 'Biratnagar Metropolitan City' },
  { id: 'BGN', name: 'Bhaktapur Municipality' },
  { id: 'KIR', name: 'Kirtipur Municipality' },
];

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'expat',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterSchemaInput) => {
    setErrorMsg(null);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        ...(data.role === 'runner' ? { municipalityId: data.municipalityId } : {}),
      };

      await registerUser(payload);
      toast.success('Registration successful!');
      navigate(`/${data.role}/dashboard`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please check inputs and try again.';
      setErrorMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Create account</h2>
        <p className="text-sm text-neutral-500">Sign up below to register as an Expat or verified Runner.</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                errors.name
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
        </div>

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
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Password
          </label>
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

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-2">
            I want to join as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-all ${
                selectedRole === 'expat'
                  ? 'border-blue-500 bg-blue-50/40 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input type="radio" value="expat" {...register('role')} className="sr-only" />
              <span className="text-sm font-semibold">Expat Client</span>
              <span className="text-xxs text-neutral-400 mt-0.5">Need documents</span>
            </label>

            <label
              className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-all ${
                selectedRole === 'runner'
                  ? 'border-blue-500 bg-blue-50/40 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input type="radio" value="runner" {...register('role')} className="sr-only" />
              <span className="text-sm font-semibold">Local Runner</span>
              <span className="text-xxs text-neutral-400 mt-0.5">Procure documents</span>
            </label>

            <label
              className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/20 transition-all ${
                selectedRole === 'admin'
                  ? 'border-blue-500 bg-blue-50/40 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input type="radio" value="admin" {...register('role')} className="sr-only" />
              <span className="text-sm font-semibold">Administrator</span>
              <span className="text-xxs text-neutral-400 mt-0.5">Platform oversight</span>
            </label>
          </div>
        </div>

        {/* Conditional Municipality Selection for Runners */}
        {selectedRole === 'runner' && (
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
              Operational Municipality
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <select
                {...register('municipalityId')}
                className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors appearance-none ${
                  errors.municipalityId
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
                }`}
              >
                <option value="">Select a Municipality</option>
                {NEPAL_MUNICIPALITIES.map((muni) => (
                  <option key={muni.id} value={muni.id}>
                    {muni.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.municipalityId && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.municipalityId.message}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 outline-none transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
