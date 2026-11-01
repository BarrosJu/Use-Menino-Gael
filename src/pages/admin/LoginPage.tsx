import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Brand from '@/components/layout/Brand';
import { LoadingState } from '@/components/ui/StateMessages';
import { useAuth } from '@/hooks/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { session, isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingState label="Verificando sessão..." />;
  if (session && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    const nextErrors: typeof fieldErrors = {};
    if (!EMAIL_PATTERN.test(trimmedEmail)) nextErrors.email = 'Informe um e-mail válido.';
    if (password.length < 6) nextErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const error = await signIn(trimmedEmail, password);
    setSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Brand />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="login-titulo"
          className="animate-fade-up space-y-6 rounded-3xl bg-white p-8 shadow-lift sm:p-10"
        >
          <div className="space-y-2 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 id="login-titulo" className="text-2xl font-extrabold">Área administrativa</h1>
            <p className="text-sm text-stone-600">Entre com o e-mail e a senha de administrador.</p>
          </div>

          {formError && <Alert tone="error">{formError}</Alert>}

          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-sm font-bold text-stone-800">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-erro' : undefined}
              className="w-full rounded-2xl border border-primary-100 px-4 py-3 text-base text-stone-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {fieldErrors.email && (
              <p id="login-email-erro" className="text-sm font-semibold text-error-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="login-senha" className="block text-sm font-bold text-stone-800">
              Senha
            </label>
            <div className="relative">
              <input
                id="login-senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-senha-erro' : undefined}
                className="w-full rounded-2xl border border-primary-100 py-3 pl-4 pr-12 text-base text-stone-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-stone-500 transition hover:bg-primary-50 hover:text-primary-800"
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="login-senha-erro" className="text-sm font-semibold text-error-600">{fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
