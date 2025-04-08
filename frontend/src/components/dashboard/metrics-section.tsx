import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitFork, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface MetricsProps {
  totalRepos: number;
  processedRepos: number;
  pendingRepos: number;
  avgProcessingTime: string;
}

export function MetricsSection({
  totalRepos,
  processedRepos,
  pendingRepos,
  avgProcessingTime,
}: MetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Repositories
          </CardTitle>
          <GitFork className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRepos}</div>
          <p className="text-xs text-muted-foreground">
            Active repositories being analyzed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processedRepos}</div>
          <p className="text-xs text-muted-foreground">
            Successfully analyzed repositories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRepos}</div>
          <p className="text-xs text-muted-foreground">
            Waiting to be processed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Processing Time
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgProcessingTime}</div>
          <p className="text-xs text-muted-foreground">Per repository</p>
        </CardContent>
      </Card>
    </div>
  );
}
