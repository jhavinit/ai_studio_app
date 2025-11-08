import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div
      className="min-h-screen bg-gradient-subtle"
      role="main"
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="inline-flex items-center gap-3 mb-6"
              role="heading"
              aria-level={1}
              id="hero-heading"
            >
              <Sparkles
                className="w-12 h-12 text-primary"
                aria-hidden="true"
              />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Studio
              </h1>
            </div>

            <p className="text-xl text-muted-foreground mb-8">
              Transform your images with the power of AI.
            </p>

            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Get started with AI Studio by signing up"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Login to your AI Studio account"
                >
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {[
              {
                icon: <Zap className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />,
                title: "Fast Generation",
                desc: "Create stunning AI-generated images in seconds",
              },
              {
                icon: <Shield className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />,
                title: "Secure & Private",
                desc: "Your data is protected with industry-standard security",
              },
              {
                icon: <Clock className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />,
                title: "History Tracking",
                desc: "Access your recent generations anytime",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                role="region"
                aria-labelledby={`feature-${idx}-title`}
                className="p-6 rounded-lg bg-card border border-primary/10 shadow-elegant focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2"
                tabIndex={0}
                whileHover={{ scale: 1.03 }}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
              >
                {feature.icon}
                <h3
                  id={`feature-${idx}-title`}
                  className="text-xl font-semibold mb-2"
                >
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
