import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center app-gradient-background p-4">
      <AuthForm type="login" />
    </main>
  );
}
