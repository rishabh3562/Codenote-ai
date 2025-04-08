const GITHUB_API_URL = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface GitHubStats {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: { [key: string]: number };
  contributions: number;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_URL}/users/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${username}/repos?sort=updated`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchUserStats(username: string): Promise<GitHubStats> {
  const [user, repos] = await Promise.all([
    fetchGitHubUser(username),
    fetchUserRepos(username),
  ]);

  const languages = repos.reduce(
    (acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    },
    {} as { [key: string]: number }
  );

  return {
    user,
    repos,
    languages,
    contributions: repos.length, // This is a simplified metric
  };
}
