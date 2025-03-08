import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  GitFork,
  Settings,
  Moon,
  Sun,
  User,
  Brain,
  LogOut,
  BarChart2,
  GitBranch,
  GitPullRequest,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: GitFork, label: 'Repositories', path: '/repositories' },
];

const analysisNavItems: NavItem[] = [
  { icon: User, label: 'User Analysis', path: '/user-analysis' },
  { icon: Brain, label: 'AI Insights', path: '/ai-insights' },
  { icon: BarChart2, label: 'Statistics', path: '/stats' },
];

const repoNavItems: NavItem[] = [
  { icon: GitBranch, label: 'Branches', path: '/branches' },
  { icon: GitPullRequest, label: 'Pull Requests', path: '/pull-requests' },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ icon: Icon, label, path }: NavItem) => (
    <Link to={path}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isActive(path) ? 'secondary' : 'ghost'}
              size="icon"
              className="w-10 h-10"
            >
              <Icon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-background border-r flex flex-col items-center py-4 space-y-4">
      <div className="w-10 h-10 rounded-full overflow-hidden mb-2">
        <img
          src={user?.avatarUrl}
          alt={user?.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          {mainNavItems.map((item) => (
            <NavButton key={item.path} {...item} />
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          {analysisNavItems.map((item) => (
            <NavButton key={item.path} {...item} />
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          {repoNavItems.map((item) => (
            <NavButton key={item.path} {...item} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/settings">
                <Button
                  variant={isActive('/settings') ? 'secondary' : 'ghost'}
                  size="icon"
                  className="w-10 h-10"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}