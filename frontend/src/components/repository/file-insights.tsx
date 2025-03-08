import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileNode } from '@/components/repository/file-explorer';
import { Brain, GitCommit, GitPullRequest, AlertTriangle, Code2 } from 'lucide-react';

interface FileInsight {
  complexity: {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    details: string;
  };
  dependencies: string[];
  suggestions: string[];
  codeSmells: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  metrics: {
    lines: number;
    functions: number;
    classes: number;
    imports: number;
  };
}

const DUMMY_INSIGHTS: Record<string, FileInsight> = {
  'src/App.tsx': {
    complexity: {
      score: 25,
      level: 'Medium',
      details: 'Moderate cyclomatic complexity due to nested routing logic',
    },
    dependencies: ['react-router-dom', '@tanstack/react-query', 'components/Sidebar'],
    suggestions: [
      'Consider splitting routing configuration into a separate file',
      'Implement lazy loading for routes to improve initial load time',
      'Add error boundaries for better error handling',
    ],
    codeSmells: [
      {
        type: 'Large Component',
        description: 'Component has too many responsibilities',
        severity: 'medium',
      },
      {
        type: 'Prop Drilling',
        description: 'Consider using context for shared state',
        severity: 'low',
      },
    ],
    metrics: {
      lines: 120,
      functions: 5,
      classes: 1,
      imports: 8,
    },
  },
  'src/components/Button.tsx': {
    complexity: {
      score: 15,
      level: 'Low',
      details: 'Well-structured component with clear responsibilities',
    },
    dependencies: ['react', 'class-variance-authority', 'utils'],
    suggestions: [
      'Add unit tests for different button variants',
      'Consider adding loading state handling',
    ],
    codeSmells: [
      {
        type: 'Duplicate Styles',
        description: 'Some style definitions are repeated',
        severity: 'low',
      },
    ],
    metrics: {
      lines: 85,
      functions: 2,
      classes: 0,
      imports: 4,
    },
  },
};

interface FileInsightsProps {
  file: FileNode | null;
}

export function FileInsights({ file }: FileInsightsProps) {
  if (!file || file.type !== 'file') {
    return (
      <div className="text-center text-muted-foreground p-8">
        Select a file to view its insights
      </div>
    );
  }

  const insights = DUMMY_INSIGHTS[file.name] || null;

  if (!insights) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No insights available for this file
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complexity Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.complexity.score}</div>
            <p className="text-xs text-muted-foreground mt-1">{insights.complexity.level} Complexity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Functions</CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.metrics.functions}</div>
            <p className="text-xs text-muted-foreground mt-1">{insights.metrics.lines} Lines of Code</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.dependencies.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{insights.metrics.imports} Direct Imports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Smells</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.codeSmells.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Potential Issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Code Smells</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.codeSmells.map((smell, index) => (
                <div key={index} className="border-b pb-2 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{smell.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      smell.severity === 'high' ? 'bg-red-100 text-red-700' :
                      smell.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {smell.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {smell.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}