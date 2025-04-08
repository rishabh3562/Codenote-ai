import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Code2,
  GitBranch,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/page-header';
import { useToast } from '@/components/ui/use-toast';

interface CodeAnalysis {
  quality: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  complexity: {
    score: number;
    details: string[];
  };
  security: {
    score: number;
    vulnerabilities: string[];
    recommendations: string[];
  };
  performance: {
    score: number;
    optimizations: string[];
  };
}

export function AIInsightsPage() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some code to analyze',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Dummy analysis result
    setAnalysis({
      quality: {
        score: 85,
        issues: [
          'Inconsistent error handling patterns',
          'Some functions lack proper TypeScript types',
          'Missing input validation in form handlers',
        ],
        suggestions: [
          'Implement consistent error handling using try/catch blocks',
          'Add TypeScript interfaces for all function parameters',
          'Add input validation using Zod or similar libraries',
        ],
      },
      complexity: {
        score: 75,
        details: [
          'Multiple nested conditional statements',
          'Complex state management logic',
          'Long function bodies could be split into smaller functions',
        ],
      },
      security: {
        score: 90,
        vulnerabilities: [
          'Potential XSS vulnerability in rendered content',
          'Unsanitized user input in API calls',
        ],
        recommendations: [
          'Use DOMPurify for user-generated content',
          'Implement input sanitization for all API parameters',
        ],
      },
      performance: {
        score: 80,
        optimizations: [
          'Implement React.memo for expensive components',
          'Add proper dependency arrays to useEffect hooks',
          'Consider using virtualization for long lists',
        ],
      },
    });

    setIsAnalyzing(false);
    toast({
      title: 'Analysis Complete',
      description: 'Your code has been analyzed successfully',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6">
      <PageHeader
        title="AI Code Analysis"
        description="Get instant feedback and suggestions for your code"
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'AI Insights' }]}
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Code Input
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-64 p-4 font-mono text-sm bg-muted rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Tabs defaultValue="quality" className="space-y-4">
            <TabsList>
              <TabsTrigger value="quality">Code Quality</TabsTrigger>
              <TabsTrigger value="complexity">Complexity</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="quality">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Code Quality Analysis</span>
                    <span className={getScoreColor(analysis.quality.score)}>
                      Score: {analysis.quality.score}/100
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Issues Found
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {analysis.quality.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Suggestions
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {analysis.quality.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="complexity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Code Complexity</span>
                    <span className={getScoreColor(analysis.complexity.score)}>
                      Score: {analysis.complexity.score}/100
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {analysis.complexity.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Security Analysis</span>
                    <span className={getScoreColor(analysis.security.score)}>
                      Score: {analysis.security.score}/100
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Vulnerabilities
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {analysis.security.vulnerabilities.map(
                        (vulnerability, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            {vulnerability}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {analysis.security.recommendations.map(
                        (recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500">•</span>
                            {recommendation}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Performance Analysis</span>
                    <span className={getScoreColor(analysis.performance.score)}>
                      Score: {analysis.performance.score}/100
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {analysis.performance.optimizations.map(
                      (optimization, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {optimization}
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
