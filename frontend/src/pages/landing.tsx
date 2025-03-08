import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  GitBranch,
  BarChart2,
  Brain,
  Shield,
  ArrowRight,
  Code,
  Users,
  GitPullRequest,
  Zap,
  LineChart,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="relative p-6 border rounded-2xl hover:shadow-lg transition-shadow"
  >
    <div className="absolute top-6 right-6">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="mt-8 text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-muted-foreground">{description}</p>
  </motion.div>
);

const features = [
  {
    icon: GitBranch,
    title: "Repository Analysis",
    description: "Deep insights into your codebase structure and patterns with AI-powered recommendations.",
  },
  {
    icon: Users,
    title: "Developer Insights",
    description: "Compare coding patterns across developers and teams to identify best practices.",
  },
  {
    icon: Brain,
    title: "AI Code Review",
    description: "Automated code reviews with intelligent suggestions for improvements and optimizations.",
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description: "Comprehensive security audits to identify and fix potential vulnerabilities.",
  },
  {
    icon: LineChart,
    title: "Performance Metrics",
    description: "Detailed performance analysis with actionable optimization suggestions.",
  },
  {
    icon: GitPullRequest,
    title: "PR Analytics",
    description: "In-depth analysis of pull requests and code review patterns.",
  },
  {
    icon: Code,
    title: "Code Quality",
    description: "Automated code quality checks and maintainability scoring.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant notifications and updates on your repository's health.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGetStarted = () => {
    // login();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </motion.div>

        <div className="mx-auto max-w-3xl py-32 sm:py-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Transform Your Code with AI-Powered Insights
            </h1>
            <p className="text-lg leading-8 text-muted-foreground mb-8">
              Elevate your development workflow with advanced code analysis, real-time insights,
              and intelligent recommendations powered by cutting-edge AI technology.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-4"
            >
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need to analyze your code
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to help you understand and improve your codebase
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={0.2 * index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/5 py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500K+</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Repositories Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Active Developers
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1M+</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Code Issues Fixed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">99%</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to transform your development workflow?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers who are already using CodeNote.ai to improve their code quality.
            </p>
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}