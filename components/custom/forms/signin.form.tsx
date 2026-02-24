"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Suspense Fallback Component (used while waiting for async components)
const SuspenseFallback = () => {
  return <div>Loading...</div>; // You can replace this with a spinner or custom loader
};

function SigninForm() {
  const searchParams = useSearchParams();
  const newUser = searchParams.get("newUser");
  const navigate = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Both fields are required.");
      return false;
    }
    return true;
  };

  async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Login failed: ${error.message}`);
        setLoading(false);
        return;
      }

      toast.success("Login successful!");
      navigate.replace("/d/reference-check/1");
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Apple or Google account
        </CardDescription>

        {newUser && (
          <Alert className="bg-green-700 text-white border-green-400">
            <InfoIcon />
            <AlertTitle>Account Registered!</AlertTitle>
            <AlertDescription className="text-white">
              Please wait for the administrator's approval.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/a/rcp"
                  className="ml-auto text-xs underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>

            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <FieldDescription className="text-center">
              Don&apos;t have an account? <Link href="/a/signup">Sign up</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

// Wrapping the SigninForm in Suspense boundary for client-side
export default function SigninPage() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SigninForm />
    </Suspense>
  );
}
