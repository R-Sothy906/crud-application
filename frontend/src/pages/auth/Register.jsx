import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

const Register = () => {
  const navigate = useNavigate();

  const { register, loading, error, clearError } = useAuthStore();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) clearError();
    if (localError) setLocalError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = data;

    if (!name.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email address is required.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (!password) return 'Password is required.';
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (!confirmPassword) {
      return 'Please confirm your password.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError('');
    setSuccess('');
    clearError();

    const validationError = validateForm();

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await register({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      });

      setSuccess('Account created successfully!');

      setData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      setTimeout(() => navigate('/tasks'), 1200);
    } catch (err) {

      setLocalError(
        err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.'
      );
    }
  };

  const displayError = error || localError;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid lg:grid-cols-2">

        {/* Left side */}
        <section className="relative hidden min-h-[700px] overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6l4 2"
                />
              </svg>
            </div>

            <span className="text-xl font-bold">TaskFlow</span>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              Simple. Powerful. Organized.
            </span>

            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Turn your tasks
              <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                into progress.
              </span>
            </h2>

            <p className="mt-6 leading-relaxed text-slate-400">
              Create your account and keep your work, projects, and daily tasks
              organized in one simple workspace.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Organize your daily tasks',
                'Track your progress easily',
                'Keep everything in one place',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-400">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">
            © 2026 TaskFlow. All rights reserved.
          </p>
        </section>

        {/* Register form */}
        <section className="relative flex min-h-[680px] items-center justify-center bg-slate-900 p-5 sm:p-8 md:p-10 lg:p-12">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl lg:hidden" />

          <div className="relative w-full max-w-md">
            <div className="mb-7 flex justify-center lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6l4 2"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-7">
              <p className="mb-2 text-sm font-medium text-indigo-400">
                GET STARTED
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Start organizing your tasks today.
              </p>
            </div>

            {displayError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
                <span className="mt-0.5 text-red-400">⚠</span>

                <p className="flex-1 text-sm text-red-300">
                  {displayError}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    setLocalError('');
                  }}
                  className="text-slate-500 transition hover:text-slate-300"
                >
                  ✕
                </button>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                <span className="text-emerald-400">✓</span>

                <p className="text-sm text-emerald-300">{success}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  FULL NAME
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  PASSWORD
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-700/50 hover:text-indigo-400 disabled:opacity-50"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-[11px] text-slate-600">
                    Minimum 6 characters
                  </span>

                  {data.password && (
                    <span
                      className={`text-[11px] ${
                        data.password.length >= 6
                          ? 'text-emerald-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {data.password.length >= 6
                        ? 'Strong enough'
                        : `${data.password.length}/6`}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  CONFIRM PASSWORD
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="new-password"
                    required
                    className={`w-full rounded-xl border bg-slate-800/60 px-4 py-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 ${
                      data.confirmPassword &&
                      data.password !== data.confirmPassword
                        ? 'border-red-500/60 focus:ring-4 focus:ring-red-500/10'
                        : data.confirmPassword &&
                          data.password === data.confirmPassword
                        ? 'border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10'
                        : 'border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-700/50 hover:text-indigo-400 disabled:opacity-50"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {data.confirmPassword && (
                  <p
                    className={`mt-2 text-[11px] ${
                      data.password === data.confirmPassword
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {data.password === data.confirmPassword
                      ? '✓ Passwords match'
                      : '✕ Passwords do not match'}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  required
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                />

                <span className="text-xs leading-relaxed text-slate-500">
                  I agree to the{' '}
                  <span className="text-indigo-400">Terms of Service</span>{' '}
                  and{' '}
                  <span className="text-indigo-400">Privacy Policy</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-600">OR</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-600 lg:hidden">
              <span className="text-emerald-500">✓</span>
              Secure account registration
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
