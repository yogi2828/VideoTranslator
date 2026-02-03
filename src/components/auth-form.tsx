'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Film } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { useAuth } from '@/firebase';

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

const loginSchema = signupSchema.extend({
  captcha: z.boolean().refine((val) => val === true, {
    message: "Please confirm you're not a robot.",
  }),
});

interface AuthFormProps {
  type: 'login' | 'signup';
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = type === 'login' ? loginSchema : signupSchema;
  const auth = useAuth();

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(type === 'login' && { captcha: false }),
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const { email, password } = data;

    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Firebase Auth service is not available.',
      });
      setIsLoading(false);
      return;
    }

    try {
      if (type === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Account Created',
          description: "You've successfully signed up!",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Logged In',
          description: 'Welcome back!',
        });
      }
      router.push('/');
      router.refresh(); // to update header state
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'login' ? 'User Login' : 'Create an Account';
  const buttonText = type === 'login' ? 'Login' : 'Sign Up';
  const altActionText =
    type === 'login'
      ? "Don't have an account?"
      : 'Already have an account?';
  const altActionLink = type === 'login' ? '/signup' : '/login';
  const altActionLinkText = type === 'login' ? 'Sign Up' : 'Login';

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader className="text-center">
        <Link href="/" className="flex items-center gap-3 justify-center mb-4">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm">
            <Film className="h-6 w-6" />
          </div>
        </Link>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>Enter your details below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    {type === 'login' && (
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'login' && (
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="captcha"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <label
                        htmlFor="captcha"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I am not a robot
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {altActionText}{' '}
          <Link href={altActionLink} className="underline">
            {altActionLinkText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
