import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCtaProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

export function FeatureCta({ title, description, icon, href, buttonText }: FeatureCtaProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="bg-primary/10 rounded-lg p-3">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Button onClick={() => navigate(href)} variant="outline">
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}