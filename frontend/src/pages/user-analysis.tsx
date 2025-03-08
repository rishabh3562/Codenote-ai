import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  GitCommit,
  GitPullRequest,
  Users,
  Clock,
  Search,
  Star,
  GitFork,
  Code,
  Calendar,
  Activity,
  Loader2,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface UserData {
  contributionData: Array<{ month: string; commits: number }>;
  languageStats: Array<{ name: string; value: number }>;
  metrics: {
    totalCommits: number;
    pullRequests: number;
    collaborators: number;
    avgDailyActivity: string;
  };
  repoStats: Array<{ name: string; stars: number; forks: number }>;
  activityHeatmap: Array<{ week: string; contributions: number }>;
  impactScore: Array<{ category: string; score: number }>;
}

const generateDummyData = (username: string): UserData => ({
  contributionData: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    commits: Math.floor(Math.random() * 200) + 50,
  })),
  languageStats: [
    { name: 'TypeScript', value: 45 },
    { name: 'JavaScript', value: 25 },
    { name: 'Python', value: 15 },
    { name: 'Go', value: 10 },
    { name: 'Other', value: 5 },
  ],
  metrics: {
    totalCommits: Math.floor(Math.random() * 5000) + 1000,
    pullRequests: Math.floor(Math.random() * 300) + 50,
    collaborators: Math.floor(Math.random() * 50) + 10,
    avgDailyActivity: (Math.random() * 5 + 2).toFixed(1),
  },
  repoStats: Array.from({ length: 5 }, (_, i) => ({
    name: `Project ${i + 1}`,
    stars: Math.floor(Math.random() * 1000),
    forks: Math.floor(Math.random() * 500),
  })),
  activityHeatmap: Array.from({ length: 52 }, (_, week) => ({
    week: `Week ${week + 1}`,
    contributions: Math.floor(Math.random() * 50),
  })),
  impactScore: [
    { category: 'Code Quality', score: Math.floor(Math.random() * 100) },
    { category: 'Documentation', score: Math.floor(Math.random() * 100) },
    { category: 'Testing', score: Math.floor(Math.random() * 100) },
    { category: 'Reviews', score: Math.floor(Math.random() * 100) },
    { category: 'Issues', score: Math.floor(Math.random() * 100) },
    { category: 'Features', score: Math.floor(Math.random() * 100) },
  ],
});

export function UserAnalysisPage() {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleSearch = async () => {
    if (!username.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a GitHub username',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = generateDummyData(username);
      setUserData(data);
      setSearchedUser(username);
      toast({
        title: 'Success',
        description: `Analysis complete for ${username}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze user data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Analysis</TabsTrigger>
          <TabsTrigger value="search">Analyze User</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <h2 className="text-3xl font-bold">Personal Analysis</h2>
          <PersonalAnalysis />
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Enter GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze User
                </>
              )}
            </Button>
          </div>

          {userData && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Analysis for @{searchedUser}</h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Total Commits"
                  value={userData.metrics.totalCommits.toLocaleString()}
                  icon={GitCommit}
                />
                <MetricCard
                  title="Pull Requests"
                  value={userData.metrics.pullRequests.toLocaleString()}
                  icon={GitPullRequest}
                />
                <MetricCard
                  title="Collaborators"
                  value={userData.metrics.collaborators.toLocaleString()}
                  icon={Users}
                />
                <MetricCard
                  title="Daily Activity"
                  value={`${userData.metrics.avgDailyActivity} hrs`}
                  icon={Clock}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userData.contributionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="commits"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Language Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userData.languageStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {userData.languageStats.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Repositories</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userData.repoStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stars" fill="#3b82f6" name="Stars" />
                        <Bar dataKey="forks" fill="#10b981" name="Forks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Developer Impact Score</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%">
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.5}
                          data={userData.impactScore}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contribution Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userData.activityHeatmap} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Tooltip />
                        <Bar dataKey="contributions" fill="#3b82f6">
                          {userData.activityHeatmap.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`rgb(59, 130, 246, ${entry.contributions / 50})`}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PersonalAnalysis() {
  const DUMMY_USER_METRICS = {
    totalCommits: '1,234',
    pullRequests: '156',
    collaborators: '23',
    avgDailyActivity: '4.5 hrs',
  };

  const DUMMY_CONTRIBUTION_DATA = [
    { month: 'Jan', commits: 45 },
    { month: 'Feb', commits: 32 },
    { month: 'Mar', commits: 67 },
    { month: 'Apr', commits: 89 },
    { month: 'May', commits: 54 },
    { month: 'Jun', commits: 78 },
  ];

  const DUMMY_LANGUAGE_STATS = [
    { name: 'TypeScript', value: 45 },
    { name: 'JavaScript', value: 25 },
    { name: 'Python', value: 15 },
    { name: 'Go', value: 10 },
    { name: 'Other', value: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Commits"
          value={DUMMY_USER_METRICS.totalCommits}
          icon={GitCommit}
        />
        <MetricCard
          title="Pull Requests"
          value={DUMMY_USER_METRICS.pullRequests}
          icon={GitPullRequest}
        />
        <MetricCard
          title="Collaborators"
          value={DUMMY_USER_METRICS.collaborators}
          icon={Users}
        />
        <MetricCard
          title="Daily Activity"
          value={DUMMY_USER_METRICS.avgDailyActivity}
          icon={Clock}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contribution Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DUMMY_CONTRIBUTION_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="commits" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DUMMY_LANGUAGE_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DUMMY_LANGUAGE_STATS.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}