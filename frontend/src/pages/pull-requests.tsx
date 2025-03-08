import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { GitPullRequest, Search, MessageSquare, GitCommit, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';

interface PullRequest {
  id: string;
  title: string;
  author: string;
  branch: string;
  status: 'open' | 'closed' | 'merged';
  comments: number;
  commits: number;
  updatedAt: string;
}

const DUMMY_PRS: PullRequest[] = [
  {
    id: '1',
    title: 'Add user authentication',
    author: 'John Doe',
    branch: 'feature/user-auth',
    status: 'open',
    comments: 5,
    commits: 3,
    updatedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'Fix login validation',
    author: 'Jane Smith',
    branch: 'bugfix/login-error',
    status: 'merged',
    comments: 8,
    commits: 2,
    updatedAt: '1 day ago',
  },
];

export function PullRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPRs = DUMMY_PRS.filter(pr =>
    pr.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: PullRequest['status']) => {
    switch (status) {
      case 'open': return 'bg-green-500/10 text-green-500';
      case 'closed': return 'bg-red-500/10 text-red-500';
      case 'merged': return 'bg-purple-500/10 text-purple-500';
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Pull Requests"
        description="Review and manage pull requests"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Pull Requests' },
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search pull requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button>
          <GitPullRequest className="h-4 w-4 mr-2" />
          New Pull Request
        </Button>
      </div>

      {filteredPRs.length > 0 ? (
        <div className="space-y-4">
          {filteredPRs.map((pr) => (
            <Card key={pr.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <GitPullRequest className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {pr.title}
                      <Badge className={getStatusColor(pr.status)}>
                        {pr.status}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pr.author} wants to merge into main from {pr.branch}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {pr.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitCommit className="h-4 w-4" />
                      {pr.commits}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {pr.updatedAt}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pull requests found"
          description={
            searchQuery
              ? "No pull requests match your search criteria"
              : "Create your first pull request to get started"
          }
          action={{
            label: "Create Pull Request",
            onClick: () => {/* Create PR logic */}
          }}
        />
      )}
    </div>
  );
}