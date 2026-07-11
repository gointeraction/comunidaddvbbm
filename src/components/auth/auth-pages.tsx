'use client';

import { useState, type FormEvent } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


// ── Terminal Header ────────────────────────────────────
function TerminalHeader({ path }: { path: string }) {
  return (
    <div className="terminal-text text-sm mb-6">
      <span className="text-[#10B981]">autodev</span>{' '}
      <span className="text-[#34D399]">~/{path}</span>
    </div>
  );
}

import { signInWithGoogleFirebase } from '@/lib/firebase';

// ── Google Account Selector Modal (Fallback para desarrollo/sin API Key de prod) ──
function GoogleAccountModal({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (user: { email: string; displayName: string; avatarUrl?: string }) => void }) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const mockAccounts = [
    { email: 'carlos@autodev.dev', displayName: 'Carlos Dev', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { email: 'lucia@autodev.dev', displayName: 'Lucia AI', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { email: 'developer.google@gmail.com', displayName: 'Dev Google User', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="font-semibold text-gray-100 text-base">Inicia sesión con Google</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
        </div>

        <p className="text-xs text-gray-400">
          Selecciona una cuenta de Google Workspace conectada para ingresar a la comunidad de AutoDev:
        </p>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {mockAccounts.map((acc) => (
            <button
              key={acc.email}
              onClick={() => onSelect(acc)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#10B981]/50 transition text-left cursor-pointer group"
            >
              <img src={acc.avatarUrl} alt={acc.displayName} className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-[#10B981]" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-200 truncate group-hover:text-[#10B981]">{acc.displayName}</div>
                <div className="text-xs text-gray-400 truncate">{acc.email}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="text-xs font-mono text-gray-400">O ingresa con tu cuenta personalizada de Google:</div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Tu Nombre"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="bg-black/40 border-white/10 text-xs text-gray-200 h-9"
            />
            <Input
              placeholder="tu.cuenta@gmail.com"
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="bg-black/40 border-white/10 text-xs text-gray-200 h-9"
            />
          </div>
          <Button
            onClick={() => {
              if (customEmail) {
                onSelect({ email: customEmail, displayName: customName || customEmail.split('@')[0] });
              }
            }}
            disabled={!customEmail}
            className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs h-9 rounded-lg font-medium cursor-pointer"
          >
            Continuar con la cuenta ingresada
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Google Sign-In Button Component ──
function GoogleSignInButton({ label = 'Continuar con Google', onClick, loading = false }: { label?: string; onClick: () => void; loading?: boolean }) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={loading}
      variant="outline"
      className="w-full bg-[#030712] hover:bg-white/5 border border-white/15 hover:border-white/30 text-gray-200 font-medium py-5 rounded-xl shadow-sm transition flex items-center justify-center gap-3 cursor-pointer group"
    >
      <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      <span>{loading ? 'Conectando a Google...' : label}</span>
    </Button>
  );
}

// ── Login Page ─────────────────────────────────────────
function LoginPage() {
  const navigate = useAppStore((s) => s.navigate);
  const login = useAppStore((s) => s.login);
  const loginWithGoogle = useAppStore((s) => s.loginWithGoogle);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const googleUser = await signInWithGoogleFirebase();
    if (googleUser) {
      loginWithGoogle(googleUser);
      setGoogleLoading(false);
    } else {
      setGoogleLoading(false);
      setShowGoogleModal(true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Credenciales inválidas');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <TerminalHeader path="auth/login" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 terminal-text">
          Iniciar sesión
        </CardTitle>
        <p className="text-sm text-gray-400 terminal-text mt-1">
          Accede a tu cuenta de AutoDev
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google OAuth Button */}
        <GoogleSignInButton onClick={handleGoogleLogin} loading={googleLoading} />

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-gray-900 px-3 text-xs uppercase font-mono text-gray-500">
            o con email y contraseña
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="terminal-text text-sm text-gray-500">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="terminal-text text-sm text-gray-500">
              Contraseña
            </Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm terminal-text terminal-error animate-slide-in">
              {'>'} Error: {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            {loading ? 'Conectando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="flex justify-between pt-2 text-sm">
          <button
            onClick={() => navigate('registro')}
            className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            ¿No tienes cuenta? Regístrate
          </button>
          <button
            onClick={() => navigate('recuperar-contrasena')}
            className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Recuperar contraseña
          </button>
        </div>
      </CardContent>

      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelect={(user) => {
          setShowGoogleModal(false);
          loginWithGoogle(user);
        }}
      />
    </>
  );
}

// ── Register Page ──────────────────────────────────────
function RegisterPage() {
  const navigate = useAppStore((s) => s.navigate);
  const register = useAppStore((s) => s.register);
  const loginWithGoogle = useAppStore((s) => s.loginWithGoogle);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    const googleUser = await signInWithGoogleFirebase();
    if (googleUser) {
      loginWithGoogle(googleUser);
      setGoogleLoading(false);
    } else {
      setGoogleLoading(false);
      setShowGoogleModal(true);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = 'Email inválido';
    }
    if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      register(email, password);
      setLoading(false);
    }, 600);
  };

  return (
    <>
      <TerminalHeader path="auth/register" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 terminal-text">
          Crear cuenta
        </CardTitle>
        <p className="text-sm text-gray-400 terminal-text mt-1">
          Únete a la comunidad de AutoDev
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google OAuth Register Button */}
        <GoogleSignInButton label="Registrarse con Google" onClick={handleGoogleRegister} loading={googleLoading} />

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-gray-900 px-3 text-xs uppercase font-mono text-gray-500">
            o con email y contraseña
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-email" className="terminal-text text-sm text-gray-500">
              Email
            </Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password" className="terminal-text text-sm text-gray-500">
              Contraseña
            </Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-confirm" className="terminal-text text-sm text-gray-500">
              Confirmar contraseña
            </Label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            {loading ? 'Creando cuenta...' : 'Regístrate'}
          </Button>
        </form>

        <div className="pt-2 text-sm text-center">
          <button
            onClick={() => navigate('login')}
            className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </CardContent>

      <GoogleAccountModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelect={(user) => {
          setShowGoogleModal(false);
          loginWithGoogle(user);
        }}
      />
    </>
  );
}

// ── Recovery Page ──────────────────────────────────────
function RecoveryPage() {
  const navigate = useAppStore((s) => s.navigate);

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <TerminalHeader path="auth/recover" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 terminal-text">
          Recuperar contraseña
        </CardTitle>
        <p className="text-sm text-gray-400 terminal-text mt-1">
          Te enviaremos un enlace de recuperación
        </p>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
              <p className="terminal-text text-sm text-[#10B981]">
                {'>'} ✓ Se ha enviado un enlace de recuperación a tu email
              </p>
            </div>
            <button
              onClick={() => navigate('login')}
              className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0 text-sm"
            >
              ← Volver a iniciar sesión
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recovery-email" className="terminal-text text-sm text-gray-500">
                  Email
                </Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]"
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('login')}
                className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0 text-sm"
              >
                ← Volver a iniciar sesión
              </button>
            </div>
          </>
        )}
      </CardContent>
    </>
  );
}

// ── Auth Pages Router ──────────────────────────────────
export default function AuthPages() {
  const { route } = useAppStore();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] grid-bg px-4 py-12">
      <Card className="w-full max-w-md bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl shadow-2xl shadow-black/60 animate-fade-in-up">
        {route === 'login' && <LoginPage />}
        {route === 'registro' && <RegisterPage />}
        {route === 'recuperar-contrasena' && <RecoveryPage />}
      </Card>
    </div>
  );
}