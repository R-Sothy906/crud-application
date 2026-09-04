import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';

const Login = () => {
  const navigate = useNavigate();

  const { login, loading, error, clearError } = useAuthStore();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) clearError();
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!data.email.trim()) {
      setLocalError('Email is required.');
      return;
    }

    if (!data.password.trim()) {
      setLocalError('Password is required.');
      return;
    }

    try {
      await login({
        email: data.email.trim(),
        password: data.password,
        rememberMe,
      });

      navigate('/tasks');
    } catch (err) {

      setLocalError(
        err.response?.data?.message ||
          err.message ||
          'Login failed. Please check your email and password.'
      );
    }
  };

  const displayError = error || localError;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid lg:grid-cols-2">

        {/* Left side */}
        <section className="relative hidden min-h-[680px] overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

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
              Welcome back
            </span>

            <h2 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Your tasks.
              <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Your progress.
              </span>
            </h2>

            <p className="mt-6 leading-relaxed text-slate-400">
              Sign in to access your workspace, manage your tasks, and stay
              focused on what matters most.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Manage your tasks easily',
                'Track your daily progress',
                'Stay organized and productive',
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

        {/* Login form */}
        <section className="relative flex min-h-[650px] items-center justify-center bg-slate-900 p-5 sm:p-8 md:p-10 lg:p-12">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl lg:hidden" />

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
                WELCOME BACK
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Sign in to your account
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Enter your details to continue to TaskFlow.
              </p>
            </div>

            {displayError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-sm text-red-400">
                  !
                </span>

                <p className="flex-1 text-sm leading-relaxed text-red-300">
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

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  EMAIL ADDRESS
                </label>

                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                    />
                  </svg>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={loading}
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  PASSWORD
                </label>

                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="11"
                      rx="2"
                      strokeWidth="1.8"
                    />
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.8"
                      d="M8 10V7a4 4 0 018 0v3"
                    />
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type={show ? 'text' : 'password'}
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                  />

                  <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-700/50 hover:text-indigo-400 disabled:opacity-50"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="group flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />

                  <span className="text-sm text-slate-400 transition group-hover:text-slate-300">
                    Remember me
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                {loading ? (
                  <span className="relative flex items-center justify-center gap-2">
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
                    Signing in...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    Sign In
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-600">OR</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                Create account
              </Link>
            </p>

            <div className="mt-7 flex items-center justify-center gap-2">
              <span className="text-emerald-500">✓</span>
              <span className="text-xs text-slate-600">
                Secure authentication
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
