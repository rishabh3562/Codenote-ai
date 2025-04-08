import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CodeNote.ai</h3>
            <p className="text-sm text-muted-foreground">
              Transform your development workflow with AI-powered insights
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Features</li>
              <li>Pricing</li>
              <li>Documentation</li>
              <li>API</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2024 CodeNote.ai. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
