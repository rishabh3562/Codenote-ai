import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileCode, GitBranch, GitCommit, GitPullRequest } from 'lucide-react';

const DUMMY_REPO_METRICS = {
  totalFiles: '234',
  branches: '12',
  commits: '567',
  pullRequests: '45',
};

const DUMMY_COMPLEXITY_DATA = [
  { file: 'src/App.tsx', complexity: 25 },
  { file: 'src/components/Header.tsx', complexity: 15 },
  { file: 'src/utils/api.ts', complexity: 35 },
  { file: 'src/hooks/useAuth.ts', complexity: 20 },
  { file: 'src/pages/Dashboard.tsx', complexity: 30 },
];

const DUMMY_COMMIT_ACTIVITY = Array.from({ length: 12 }, (_, i) => ({
  week: `Week ${i + 1}`,
  commits: Math.floor(Math.random() * 50) + 10,
}));

export function RepositoryStatsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Repository Statistics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DUMMY_REPO_METRICS.totalFiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branches</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DUMMY_REPO_METRICS.branches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DUMMY_REPO_METRICS.commits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DUMMY_REPO_METRICS.pullRequests}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Code Complexity by File</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DUMMY_COMPLEXITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="file" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complexity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commit Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={DUMMY_COMMIT_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="commits" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}