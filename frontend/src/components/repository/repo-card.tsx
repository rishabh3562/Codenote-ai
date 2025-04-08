import React from 'react';
import { Link } from 'react-router-dom';
import { GitFork, Clock, CheckCircle, Loader2, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RepoCardProps {
  id: string;
  name: string;
  lastUpdated: string;
  status: 'Fetched' | 'Processing' | 'Completed';
}

export function RepoCard({ id, name, lastUpdated, status }: RepoCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'Fetched':
        return <GitFork className="h-5 w-5 text-blue-500" />;
      case 'Processing':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        {getStatusIcon()}
      </div>

      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Clock className="h-4 w-4 mr-1" />
        <span>Last updated: {lastUpdated}</span>
      </div>

      <div className="flex justify-end space-x-2">
        <Link to={`/repository/${id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link to={`/repository/${id}/stats`}>
          <Button variant="outline" size="sm">
            <BarChart className="h-4 w-4 mr-1" />
            Stats
          </Button>
        </Link>
      </div>
    </div>
  );
}
