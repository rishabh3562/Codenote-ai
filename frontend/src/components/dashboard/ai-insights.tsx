import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, GitCommit, GitPullRequest } from 'lucide-react';

interface ComplexFile {
  name: string;
  complexity: number;
  lines: number;
  dependencies: number;
}

interface AIInsight {
  title: string;
  description: string;
}

interface AIInsightsProps {
  complexFiles: ComplexFile[];
  latestInsights: AIInsight[];
}

export function AIInsights({ complexFiles, latestInsights }: AIInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Most Complex Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complexFiles.map((file) => (
              <div key={file.name} className="border-b pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Score: {file.complexity}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {file.lines} lines • {file.dependencies} dependencies
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" />
            Latest AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {latestInsights.map((insight, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <div className="font-medium">{insight.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
