const rootURL = 'https://zapierorg.atlassian.net';
const browseURL = `${rootURL}/browse`;
const apiURL = `${rootURL}/rest/api/latest`;

const basicAuth = `Basic ${process.env.basicAuth}`;

const URLS = {
  rootURL, browseURL, apiURL,
};

const defaultURLOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: basicAuth,
  },
  maxAge: 10000,
};

const iconPath = './icons';
const mapIssueTypeToIconName = (issueType) => {
  const map = {
    Task: 'task',
    Bug: 'bug',
    'Sub-task': 'subtask',
    Idea: 'idea',
    'Security Bug': 'security-bug',
    Story: 'story',
    Migration: 'migration',
  };
  return map[issueType] || 'default';
};
const getIconPathForIssueType = (issueType) => `${iconPath}/jira-icon-${mapIssueTypeToIconName(issueType)}.png`;

const filterItemsToMatchTitle = (items, filterText) => items.filter((item) => {
  const matchesTitle = item.title.toLowerCase().includes(filterText);
  const matchesArg = item.arg.includes(filterText);
  return matchesTitle || matchesArg;
});

module.exports = {
  URLS,
  defaultURLOptions,
  iconPath,
  getIconPathForIssueType,
  filterItemsToMatchTitle,
};
