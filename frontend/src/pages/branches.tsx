import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, GitMerge, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface Branch {
  name: string;
  lastCommit: string;
  author: string;
  updatedAt: string;
  status: 'active' | 'stale' | 'merged';
}

const DUMMY_BRANCHES: Branch[] = [
  {
    name: 'main',
    lastCommit: 'Update dependencies',
    author: 'John Doe',
    updatedAt: '2 hours ago',
    status: 'active',
  },
  {
    name: 'feature/user-auth',
    lastCommit: 'Add OAuth integration',
    author: 'Jane Smith',
    updatedAt: '1 day ago',
    status: 'active',
  },
  {
    name: 'bugfix/login-error',
    lastCommit: 'Fix login validation',
    author: 'Mike Johnson',
    updatedAt: '3 days ago',
    status: 'merged',
  },
];

export function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = DUMMY_BRANCHES.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Branches"
        description="Manage and monitor repository branches"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Branches' },
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search branches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button>
          <GitBranch className="h-4 w-4 mr-2" />
          New Branch
        </Button>
      </div>

      {filteredBranches.length > 0 ? (
        <div className="space-y-4">
          {filteredBranches.map((branch) => (
            <Card key={branch.name}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground">{branch.lastCommit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {branch.updatedAt}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <GitMerge className="h-4 w-4 mr-2" />
                    Merge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No branches found"
          description={
            searchQuery
              ? "No branches match your search criteria"
              : "Create your first branch to get started"
          }
          action={{
            label: "Create Branch",
            onClick: () => {/* Create branch logic */}
          }}
        />
      )}
    </div>
  );
}