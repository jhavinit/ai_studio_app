import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password);
      toast({
        title: "Account Created!",
        description: "Welcome to AI Studio",
      });
      navigate("/studio");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4"
      role="main"
      aria-labelledby="signup-heading"
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-8" role="banner">
          <div
            className="inline-flex items-center gap-2 mb-4"
            aria-label="AI Studio signup header"
          >
            <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
            <h1
              id="signup-heading"
              className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            >
              AI Studio
            </h1>
          </div>
          <p className="text-muted-foreground">
            Create your account and start generating
          </p>
        </div>

        {/* Form Card */}
        <Card
          className="shadow-elegant border-primary/10 focus-within:ring-2 focus-within:ring-primary/50"
          role="form"
          aria-labelledby="form-title"
        >
          <CardHeader>
            <CardTitle id="form-title">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to get started.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-describedby="email-desc"
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <p id="email-desc" className="sr-only">
                  Enter your email address
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-describedby="password-desc"
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <p id="password-desc" className="sr-only">
                  Enter a password at least 6 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-describedby="confirm-desc"
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
                <p id="confirm-desc" className="sr-only">
                  Re-enter your password to confirm it matches
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                disabled={isLoading}
                aria-label={
                  isLoading ? "Creating your account..." : "Sign up for an account"
                }
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="mr-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                  aria-label="Go to login page"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  );
};

export default Signup;
