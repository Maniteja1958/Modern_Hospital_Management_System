import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../lib/api';
import { Activity, Mail, Lock, Loader2, HeartPulse } from 'lucide-react';
import { Button } from '../components/ui/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data);

      if (data.role === 'Admin') navigate('/dashboard/admin');
      else if (data.role === 'Doctor') navigate('/dashboard/doctor');
      else navigate('/dashboard/patient');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
      
      {/* Left Column: Form Content */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 h-full z-10 mx-auto w-full max-w-[600px] lg:max-w-none">
        <div className="w-full max-w-md mx-auto">
          
          <div className="flex items-center gap-2 mb-12">
            <HeartPulse className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">PharmaCare</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Please sign in to your Smart Hospital System account.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 rounded-xl text-base font-semibold shadow-md active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </span>
              ) : 'Sign In'}
            </Button>
            
          </form>

          <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4">
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Premium Graphic */}
      <div className="hidden lg:flex relative bg-muted overflow-hidden flex-col items-center justify-center p-12">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-12 w-96 h-96 bg-secondary/30 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none"></div>
        
        {/* Glassmorphic Panel Graphic */}
        <div className="relative z-10 w-full max-w-lg glass-card rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
            <Activity className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Empowering Healthcare Providers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our state-of-the-art platform seamlessly connects patients, doctors, and administration to deliver high-quality patient care safely and efficiently.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
