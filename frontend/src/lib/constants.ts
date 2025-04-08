// Application-wide constants
export const APP_NAME = 'CodeNote.ai';
export const APP_DESCRIPTION = 'AI-Powered Code Analysis';

// API endpoints and configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const GITHUB_API_URL = 'https://api.github.com';

// Chart colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
};

// Status badges
export const STATUS_STYLES = {
  active: 'bg-green-500/10 text-green-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
  completed: 'bg-blue-500/10 text-blue-500',
  error: 'bg-red-500/10 text-red-500',
};

// Navigation items
export const NAV_ITEMS = {
  main: [
    { icon: 'Home', label: 'Dashboard', path: '/dashboard' },
    { icon: 'GitFork', label: 'Repositories', path: '/repositories' },
  ],
  analysis: [
    { icon: 'User', label: 'User Analysis', path: '/user-analysis' },
    { icon: 'Brain', label: 'AI Insights', path: '/ai-insights' },
    { icon: 'BarChart2', label: 'Statistics', path: '/stats' },
  ],
  repository: [
    { icon: 'GitBranch', label: 'Branches', path: '/branches' },
    { icon: 'GitPullRequest', label: 'Pull Requests', path: '/pull-requests' },
  ],
};
