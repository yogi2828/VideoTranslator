import { AuthForm } from '@/components/auth-form';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <AuthForm type="signup" />
    </main>
  );
}
