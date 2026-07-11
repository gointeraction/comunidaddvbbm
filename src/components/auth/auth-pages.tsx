'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useAppStore } from '@/stores/app-store';
import { signInWithGoogleFirebase, resetPassword } from '@/lib/firebase';
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
      <span className="text-[#10B981]">bbmdev</span>{' '}
      <span className="text-[#34D399]">~/{path}</span>
    </div>
  );
}

// ── Firebase Error Messages (Spanish) ──────────────────
function getFirebaseErrorMessage(code: string): string {
  const errors: Record<string, string> = {
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con este email',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/popup-closed-by-user': 'Ventana de Google cerrada',
  };
  return errors[code] || code || 'Error al procesar la solicitud';
}

// ── Google Sign-In Button ──
function GoogleSignInButton({ label = 'Continuar con Google', onClick, loading = false }: { label?: string; onClick: () => void; loading?: boolean }) {
  return (
    <Button type="button" onClick={onClick} disabled={loading} variant="outline" className="w-full bg-[#030712] hover:bg-white/5 border border-white/15 hover:border-white/30 text-gray-200 font-medium py-5 rounded-xl shadow-sm transition flex items-center justify-center gap-3 cursor-pointer group">
      <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      <span>{loading ? 'Conectando...' : label}</span>
    </Button>
  );
}

// ── Login Page ─────────────────────────────────────────
function LoginPage() {
  const navigate = useAppStore((s) => s.navigate);
  const login = useAppStore((s) => s.login);
  const loginWithGoogle = useAppStore((s) => s.loginWithGoogle);
  const authError = useAppStore((s) => s.authError);
  const clearAuthError = useAppStore((s) => s.clearAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const failedAttemptsRef = useRef(0);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    clearAuthError();
    const googleUser = await signInWithGoogleFirebase();
    if (googleUser) {
      loginWithGoogle(googleUser);
    } else {
      useAppStore.setState({ authError: 'auth/popup-closed-by-user' });
    }
    setGoogleLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (!email || !password) return;

    // RF-007: Rate limiting check
    if (lockedUntil && Date.now() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
      return;
    }

    setLoading(true);
    await login(email, password);
    setLoading(false);

    // If login failed (authError is set), increment counter
    const currentError = useAppStore.getState().authError;
    if (currentError) {
      failedAttemptsRef.current += 1;
      if (failedAttemptsRef.current >= 5) {
        setLockedUntil(Date.now() + 15 * 60 * 1000);
        failedAttemptsRef.current = 0;
      }
    } else {
      failedAttemptsRef.current = 0;
    }
  };

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const lockMinutesLeft = isLocked ? Math.ceil((lockedUntil! - Date.now()) / 60000) : 0;
  const displayError = isLocked
    ? `Demasiados intentos. Intenta de nuevo en ${lockMinutesLeft} minutos`
    : authError ? getFirebaseErrorMessage(authError) : null;

  return (
    <>
      <TerminalHeader path="auth/login" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 terminal-text">
          Iniciar sesión
        </CardTitle>
        <p className="text-sm text-gray-400 terminal-text mt-1">
          Accede a tu cuenta de BBMDev
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Label htmlFor="login-email" className="terminal-text text-sm text-gray-500">Email</Label>
            <Input id="login-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]" autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="terminal-text text-sm text-gray-500">Contraseña</Label>
            <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]" autoComplete="current-password" />
          </div>

          {displayError && (
            <div className="text-sm terminal-text terminal-error animate-slide-in">
              {'>'} Error: {displayError}
            </div>
          )}

          <Button type="submit" disabled={loading || isLocked} className="w-full bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer">
            {loading ? 'Conectando...' : isLocked ? `Bloqueado (${lockMinutesLeft}min)` : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="flex justify-between pt-2 text-sm">
          <button onClick={() => navigate('registro')} className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0">
            ¿No tienes cuenta? Regístrate
          </button>
          <button onClick={() => navigate('recuperar-contrasena')} className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0">
            Recuperar contraseña
          </button>
        </div>
      </CardContent>

      {displayError && (
        <div className="text-sm terminal-text terminal-error animate-slide-in">
          {'>'} Error: {displayError}
        </div>
      )}
    </>
  );
}

// ── Register Page ──────────────────────────────────────
function RegisterPage() {
  const navigate = useAppStore((s) => s.navigate);
  const register = useAppStore((s) => s.register);
  const loginWithGoogle = useAppStore((s) => s.loginWithGoogle);
  const authError = useAppStore((s) => s.authError);
  const clearAuthError = useAppStore((s) => s.clearAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    clearAuthError();
    const googleUser = await signInWithGoogleFirebase();
    if (googleUser) {
      loginWithGoogle(googleUser);
    } else {
      useAppStore.setState({ authError: 'auth/popup-closed-by-user' });
    }
    setGoogleLoading(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = 'Email inválido';
    if (password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (!validate()) return;

    setLoading(true);
    await register(email, password);
    setLoading(false);
  };

  const displayError = authError ? getFirebaseErrorMessage(authError) : null;

  return (
    <>
      <TerminalHeader path="auth/register" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 terminal-text">Crear cuenta</CardTitle>
        <p className="text-sm text-gray-400 terminal-text mt-1">Únete a la comunidad de BBMDev</p>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Label htmlFor="reg-email" className="terminal-text text-sm text-gray-500">Email</Label>
            <Input id="reg-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]" autoComplete="email" />
            {errors.email && <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password" className="terminal-text text-sm text-gray-500">Contraseña</Label>
            <Input id="reg-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]" autoComplete="new-password" />
            {errors.password && <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-confirm" className="terminal-text text-sm text-gray-500">Confirmar contraseña</Label>
            <Input id="reg-confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]" autoComplete="new-password" />
            {errors.confirmPassword && <p className="text-xs terminal-text terminal-error animate-slide-in">{'>'} {errors.confirmPassword}</p>}
          </div>

          {displayError && (
            <div className="text-sm terminal-text terminal-error animate-slide-in">
              {'>'} Error: {displayError}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer">
            {loading ? 'Creando cuenta...' : 'Regístrate'}
          </Button>
        </form>

        <div className="pt-2 text-sm text-center">
          <button onClick={() => navigate('login')} className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </CardContent>

    </>
  );
}

// ── Recovery Page ──────────────────────────────────────
function RecoveryPage() {
  const navigate = useAppStore((s) => s.navigate);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err instanceof Error ? err.message : ''));
    }
    setLoading(false);
  };

  return (
    <>
      <TerminalHeader path="auth/recover" />
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-100 terminal-text">Recuperar contraseña</CardTitle>
        <p className="text-sm text-gray-400 terminal-text mt-1">Te enviaremos un enlace de recuperación</p>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-4">
              <p className="terminal-text text-sm text-[#10B981]">{'>'} ✓ Se ha enviado un enlace de recuperación a tu email</p>
            </div>
            <button onClick={() => navigate('login')} className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0 text-sm">← Volver a iniciar sesión</button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recovery-email" className="terminal-text text-sm text-gray-500">Email</Label>
                <Input id="recovery-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#030712] border-white/10 text-gray-100 placeholder:text-gray-600 terminal-text focus:border-[#10B981]" autoComplete="email" />
              </div>
              {error && <div className="text-sm terminal-text terminal-error animate-slide-in">{'>'} Error: {error}</div>}
              <Button type="submit" disabled={loading || !email} className="w-full bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer">
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => navigate('login')} className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0 text-sm">← Volver a iniciar sesión</button>
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
