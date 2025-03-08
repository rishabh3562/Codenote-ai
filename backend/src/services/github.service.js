import { Octokit } from '@octokit/rest';
import logger from '../config/logger.js';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const fetchRepositoryDetails = async (owner, repo) => {
  try {
    const { data } = await octokit.repos.get({
      owner,
      repo,
    });

    return {
      name: data.name,
      description: data.description,
      url: data.html_url,
      defaultBranch: data.default_branch,
      private: data.private,
      stats: {
        stars: data.stargazers_count,
        forks: data.forks_count,
        watchers: data.watchers_count,
        issues: data.open_issues_count,
      },
    };
  } catch (error) {
    logger.error('GitHub API Error:', error);
    throw new Error('Failed to fetch repository details');
  }
};

export const fetchRepositoryContent = async (owner, repo, path = '') => {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        url: item.html_url,
      }));
    }

    return {
      content: Buffer.from(data.content, 'base64').toString(),
      path: data.path,
      size: data.size,
      url: data.html_url,
    };
  } catch (error) {
    logger.error('GitHub API Error:', error);
    throw new Error('Failed to fetch repository content');
  }
};

export const fetchUserContributions = async (username) => {
  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await octokit.graphql(query, { username });
    return data.user.contributionsCollection;
  } catch (error) {
    logger.error('GitHub API Error:', error);
    throw new Error('Failed to fetch user contributions');
  }
};

export const fetchUserStats = async (username) => {
  try {
    const [user, repos] = await Promise.all([
      octokit.users.getByUsername({ username }),
      octokit.repos.listForUser({ username }),
    ]);

    const languages = new Map();
    const languagePromises = repos.data.map(repo =>
      octokit.repos.listLanguages({
        owner: username,
        repo: repo.name,
      })
    );

    const languageResults = await Promise.all(languagePromises);
    languageResults.forEach(result => {
      Object.entries(result.data).forEach(([lang, bytes]) => {
        languages.set(lang, (languages.get(lang) || 0) + bytes);
      });
    });

    return {
      profile: user.data,
      repositories: repos.data,
      languages: Object.fromEntries(languages),
    };
  } catch (error) {
    logger.error('GitHub API Error:', error);
    throw new Error('Failed to fetch user statistics');
  }
};