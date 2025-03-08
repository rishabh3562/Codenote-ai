import React from 'react';
import { Plus, GitBranch, Users, Brain, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RepoCard } from '@/components/repository/repo-card';
import { MetricsSection } from '@/components/dashboard/metrics-section';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { FeatureCta } from '@/components/marketing/feature-cta';

const DUMMY_REPOS = [
  {
    id: '1',
    name: 'next-auth',
    lastUpdated: '2 hours ago',
    status: 'Completed' as const,
  },
  {
    id: '2',
    name: 'react-query',
    lastUpdated: '5 hours ago',
    status: 'Processing' as const,
  },
  {
    id: '3',
    name: 'tailwindcss',
    lastUpdated: '1 day ago',
    status: 'Fetched' as const,
  },
];

const DUMMY_METRICS = {
  totalRepos: 15,
  processedRepos: 12,
  pendingRepos: 3,
  avgProcessingTime: '2.5 min',
};

const DUMMY_FILE_TYPES = [
  { name: 'TypeScript', value: 45 },
  { name: 'JavaScript', value: 25 },
  { name: 'JSON', value: 15 },
  { name: 'CSS', value: 10 },
  { name: 'Other', value: 5 },
];

const DUMMY_MODIFIED_FILES = [
  { name: 'src/App.tsx', count: 25 },
  { name: 'components/Button.tsx', count: 18 },
  { name: 'utils/api.ts', count: 15 },
  { name: 'styles/main.css', count: 12 },
  { name: 'hooks/useAuth.ts', count: 10 },
];

const DUMMY_ACTIVITY = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
  commits: Math.floor(Math.random() * 20) + 1,
})).reverse();

const DUMMY_COMPLEX_FILES = [
  {
    name: 'src/components/DataGrid.tsx',
    complexity: 85,
    lines: 456,
    dependencies: 12,
  },
  {
    name: 'src/hooks/useDataFetching.ts',
    complexity: 72,
    lines: 234,
    dependencies: 8,
  },
  {
    name: 'src/utils/dataTransform.ts',
    complexity: 68,
    lines: 189,
    dependencies: 5,
  },
];

const DUMMY_AI_INSIGHTS = [
  {
    title: 'Code Duplication Detected',
    description: 'Found similar authentication logic in multiple components. Consider extracting to a shared hook.',
  },
  {
    title: 'Performance Optimization',
    description: 'Large component re-renders detected in DataGrid. Implement React.memo or useMemo for better performance.',
  },
  {
    title: 'Security Enhancement',
    description: 'API endpoints lack proper error handling. Consider implementing a global error boundary.',
  },
];

export function DashboardPage() {
  return (
    <div className="p-6">
      <Breadcrumb
        segments={[
          { name: 'Home', href: '/' },
          { name: 'Dashboard' },
        ]}
        className="mb-6"
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Repository
        </Button>
      </div>

      <div className="grid gap-6 mb-8">
        <FeatureCta
          title="Analyze Your Repositories"
          description="Get detailed insights into your code quality, performance, and security with our AI-powered analysis."
          icon={<GitBranch className="h-6 w-6 text-primary" />}
          href="/repositories"
          buttonText="View Repositories"
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCta
            title="User Analysis"
            description="Compare your coding patterns with other developers and discover areas for improvement."
            icon={<Users className="h-6 w-6 text-primary" />}
            href="/user-analysis"
            buttonText="Analyze Users"
          />
          
          <FeatureCta
            title="AI Insights"
            description="Get personalized recommendations and insights powered by advanced AI analysis."
            icon={<Brain className="h-6 w-6 text-primary" />}
            href="/ai-insights"
            buttonText="View Insights"
          />
        </div>
      </div>

      <MetricsSection {...DUMMY_METRICS} />
      
      <ChartsSection
        fileTypes={DUMMY_FILE_TYPES}
        modifiedFiles={DUMMY_MODIFIED_FILES}
        activityData={DUMMY_ACTIVITY}
      />

      <AIInsights
        complexFiles={DUMMY_COMPLEX_FILES}
        latestInsights={DUMMY_AI_INSIGHTS}
      />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Recent Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_REPOS.map((repo) => (
          <RepoCard key={repo.id} {...repo} />
        ))}
      </div>
    </div>
  );
}