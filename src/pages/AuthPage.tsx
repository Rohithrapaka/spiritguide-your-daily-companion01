import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Sparkles, Mail, Lock, User, BookOpen, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<'auth' | 'onboarding'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message || 'Failed to sign in');
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        setStep('onboarding');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(email, password, {
        name,
        age: parseInt(age) || null,
        major: major || null
      });
      
      if (error) {
        if (error.message?.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
          setIsLogin(true);
          setStep('auth');
        } else {
          toast.error(error.message || 'Failed to create account');
        }
      } else {
        toast.success(`Welcome to SpiritGuide, ${name}!`);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4",
      theme === 'warm'
        ? "bg-gradient-to-br from-background via-cream to-secondary/30"
        : "bg-gradient-to-br from-background via-background to-secondary/20"
    )}>
      {/* Theme toggle in corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-20",
          theme === 'warm' ? "bg-sage" : "bg-primary"
        )} />
        <div className={cn(
          "absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-15",
          theme === 'warm' ? "bg-accent" : "bg-accent"
        )} />
      </div>

      <div className={cn(
        "w-full max-w-md relative z-10",
        "animate-scale-in"
      )}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className={cn(
            "inline-flex items-center justify-center p-4 rounded-2xl mb-4 float-animation",
            theme === 'warm'
              ? "bg-gradient-to-br from-sage-light to-sage/30 shadow-glow"
              : "glass-card"
          )}>
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold gradient-text">
            SpiritGuide
          </h1>
          <p className="text-muted-foreground mt-2">
            Your holistic mental wellness companion
          </p>
        </div>

        {/* Auth Card */}
        <div className={cn(
          "rounded-3xl p-8 transition-all duration-500",
          theme === 'warm' ? "warm-card" : "glass-card"
        )}>
          {step === 'auth' ? (
            <>
              <div className="flex mb-6 p-1 rounded-full bg-secondary">
                <button
                  onClick={() => setIsLogin(true)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300",
                    isLogin 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300",
                    !isLogin 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(
                      "pl-12 h-12 rounded-xl border-border",
                      "focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={cn(
                      "pl-12 pr-12 h-12 rounded-xl border-border",
                      "focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full h-12 rounded-xl font-semibold",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "shadow-glow transition-all duration-300"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Continue'}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('auth')}
                className="text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                ← Back
              </button>

              <h2 className="font-serif text-xl font-semibold mb-2">
                Tell us about yourself
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                This helps us personalize your experience
              </p>

              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={cn(
                      "pl-12 h-12 rounded-xl border-border",
                      "focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                    🎂
                  </span>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min={13}
                    max={100}
                    className={cn(
                      "pl-12 h-12 rounded-xl border-border",
                      "focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>

                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Academic major (e.g., Psychology)"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                    className={cn(
                      "pl-12 h-12 rounded-xl border-border",
                      "focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full h-12 rounded-xl font-semibold",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "shadow-glow transition-all duration-300"
                  )}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Begin Your Journey
                      <Sparkles className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our commitment to your mental wellbeing ✨
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
