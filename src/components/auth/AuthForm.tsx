import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface AuthFormProps {
  defaultMode?: "signin" | "signup";
}

export function AuthForm({ defaultMode = "signin" }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(defaultMode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailConfirmationError, setEmailConfirmationError] = useState(false);
  const navigate = useNavigate();

  // Check URL parameters for sign-up mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailConfirmationError(false);
    
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
        navigate("/profile");
      }
    } catch (error: any) {
      console.error(error);
      if (error.message === "Email not confirmed") {
        setEmailConfirmationError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create an account" : "Sign in"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Enter your email and password to create an account"
            : "Enter your email and password to sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailConfirmationError && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <InfoIcon className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Your email needs to be verified before you can sign in. Please check your inbox for the verification link.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign up" : "Sign in"}
          </Button>
          <div className="text-center text-sm text-muted-foreground mt-2">
            {emailConfirmationError && !isSignUp && (
              <p className="mb-2">
                For testing purposes, you can disable email verification in the Supabase dashboard.
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmailConfirmationError(false);
              // Update URL when switching modes
              navigate(isSignUp ? '/auth' : '/auth?mode=signup');
            }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
