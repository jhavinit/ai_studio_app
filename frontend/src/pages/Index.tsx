import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Shield, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <Sparkles className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Studio
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your images with the power of AI
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg bg-card border border-primary/10 shadow-elegant">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Generation</h3>
              <p className="text-muted-foreground">
                Create stunning AI-generated images in seconds
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-primary/10 shadow-elegant">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is protected with industry-standard security
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-primary/10 shadow-elegant">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">History Tracking</h3>
              <p className="text-muted-foreground">
                Access your recent generations anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
