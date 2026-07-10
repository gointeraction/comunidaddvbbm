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

// ── Login Page ─────────────────────────────────────────
function LoginPage() {
  const navigate = useAppStore((s) => s.navigate);
  const login = useAppStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      <CardContent>
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

        <div className="flex justify-between mt-6 text-sm">
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
    </>
  );
}

// ── Register Page ──────────────────────────────────────
function RegisterPage() {
  const navigate = useAppStore((s) => s.navigate);
  const register = useAppStore((s) => s.register);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
      <CardContent>
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

        <div className="mt-6 text-sm text-center">
          <button
            onClick={() => navigate('login')}
            className="terminal-text text-[#6EE7B7] hover:underline cursor-pointer bg-transparent border-none p-0"
          >
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