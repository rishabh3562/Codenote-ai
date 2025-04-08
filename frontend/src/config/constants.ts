// Application Constants
export const APP_NAME = 'CodeNote.ai';
export const APP_DESCRIPTION = 'AI-Powered Code Analysis';

// Feature Flags
export const FEATURES = {
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
};

// Status Styles
export const STATUS_STYLES = {
  active: 'bg-green-500/10 text-green-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
  completed: 'bg-blue-500/10 text-blue-500',
  error: 'bg-red-500/10 text-red-500',
};
