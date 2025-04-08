import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RepoCard } from '@/components/repository/repo-card';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';

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

export function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredRepos = DUMMY_REPOS.filter((repo) => {
    const matchesSearch = repo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && repo.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Repositories"
        description="Manage and analyze your GitHub repositories"
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Repositories' }]}
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Repository
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="fetched">Fetched</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} {...repo} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No repositories found"
            description={
              searchQuery
                ? 'No repositories match your search criteria'
                : 'Add your first repository to get started'
            }
            action={{
              label: 'Add Repository',
              onClick: () => {
                /* Add repository logic */
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
