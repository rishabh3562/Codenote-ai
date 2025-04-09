import { Octokit } from '@octokit/rest';
import logger from '../config/logger.js';
import dayjs from 'dayjs';
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
      return data.map((item) => ({
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
    const languagePromises = repos.data.map((repo) =>
      octokit.repos.listLanguages({
        owner: username,
        repo: repo.name,
      })
    );

    const languageResults = await Promise.all(languagePromises);
    languageResults.forEach((result) => {
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

//new
// import { octokit } from '../utils/octokit';
// import dayjs from 'dayjs';

export const fetchGitHubUserAnalysis = async (username) => {
  const query = `
    query ($username: String!) {
      user(login: $username) {
        followers {
          totalCount
        }
        repositoriesContributedTo(contributionTypes: [COMMIT], first: 1) {
          totalCount
        }
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
        repositories(first: 100, orderBy: { field: STARGAZERS, direction: DESC }) {
          nodes {
            name
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
            primaryLanguage {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql(query, { username });

    const user = response.user;
    const contributions = user.contributionsCollection;
    const repositories = user.repositories.nodes;

    const totalCommits = contributions.totalCommitContributions;
    const pullRequests = contributions.totalPullRequestContributions;
    const issues = contributions.totalIssueContributions;
    const totalContributions =
      contributions.contributionCalendar.totalContributions;

    const followers = user.followers.totalCount;
    const contributedRepos = user.repositoriesContributedTo.totalCount;

    const stars = repositories.reduce(
      (sum, repo) => sum + repo.stargazers.totalCount,
      0
    );

    const contributionData = contributions.contributionCalendar.weeks.flatMap(
      (week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          contributions: day.contributionCount,
        }))
    );

    const last15Days = dayjs().subtract(15, 'day');
    const recentActivity = contributionData.filter((d) =>
      dayjs(d.date).isAfter(last15Days)
    );

    // Monthly aggregation for heatmap
    const activityMap = {};
    contributionData.forEach(({ date, contributions }) => {
      const month = dayjs(date).format('YYYY-MM');
      activityMap[month] = (activityMap[month] || 0) + contributions;
    });

    const aggregatedHeatmap = Object.entries(activityMap).map(
      ([date, contributions]) => ({
        date,
        contributions,
      })
    );

    const languageStats = repositories.reduce((acc, repo) => {
      const language = repo.primaryLanguage
        ? repo.primaryLanguage.name
        : 'Unknown';
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {});

    const repoStats = repositories.slice(0, 5).map((repo) => ({
      name: repo.name,
      stars: repo.stargazers.totalCount,
      forks: repo.forks.totalCount,
    }));

    const impactScore = [
      { category: 'Commits', score: totalCommits * 0.2 },
      { category: 'PRs', score: pullRequests * 0.2 },
      { category: 'Issues', score: issues * 0.15 },
      { category: 'Stars', score: stars * 0.15 },
      { category: 'Followers', score: followers * 0.15 },
      { category: 'Contributed Repos', score: contributedRepos * 0.15 },
    ];

    return {
      metrics: {
        totalCommits,
        pullRequests,
        collaborators: followers,
        avgDailyActivity: Math.round(totalContributions / 365),
      },
      contributionData,
      languageStats: Object.entries(languageStats).map(([name, value]) => ({
        name,
        value,
      })),
      repoStats,
      impactScore,
      activityHeatmap: aggregatedHeatmap,
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw new Error('Failed to fetch user analysis');
  }
};
