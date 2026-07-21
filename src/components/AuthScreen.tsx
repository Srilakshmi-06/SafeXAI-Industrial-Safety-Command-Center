import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User as UserIcon, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function AuthScreen() {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError(null);
  };

  return (
    <div className="app-bg min-h-screen grid place-items-center p-4 text-slate-100">
      <div className="grid-overlay fixed inset-0 pointer-events-none opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500/30 to-emerald-500/20 border border-sky-400/30 text-sky-200 shadow-glow mb-3">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-bold text-grad">SafeXAI</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-[0.18em]">Industrial Safety Command</p>
        </div>

        <div className="glass-strong rounded-2xl p-6 shadow-card">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`relative py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === m ? 'text-sky-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="authTab"
                    className="absolute inset-0 rounded-lg bg-sky-500/20 border border-sky-400/30"
                  />
                )}
                <span className="relative">{m === 'login' ? 'Sign In' : 'Create Account'}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 12 : -12 }}
              transition={{ duration: 0.2 }}
              onSubmit={submit}
              className="space-y-4"
            >
              {mode === 'register' && (
                <Field
                  icon={<UserIcon size={16} />}
                  label="Full name"
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="Ravi Sharma"
                  required
                />
              )}
              <Field
                icon={<Mail size={16} />}
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="ravi.sharma@safexai.in"
                required
              />
              <Field
                icon={<Lock size={16} />}
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required
                minLength={6}
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-xs text-red-200"
                  >
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-100 font-semibold text-sm hover:bg-sky-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-5 text-center text-[11px] text-slate-500">
            {mode === 'login' ? (
              <>
                No account?{' '}
                <button onClick={() => switchMode('register')} className="text-sky-300 hover:text-sky-200 font-medium">
                  Register
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button onClick={() => switchMode('login')} className="text-sky-300 hover:text-sky-200 font-medium">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-4">
          Demo auth · accounts stored locally in your browser
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/40 transition-colors"
        />
      </div>
    </label>
  );
}
