const alfy = require('alfy');
const {
  URLS, defaultURLOptions, getIconPathForIssueType, filterItemsToMatchTitle,
} = require('./utils');

const transformRawIssueToItem = (issue) => {
  const subtitle = `${issue.key} -- ${issue.fields.status.name} -- P ${issue.fields.priority.id}`;

  return {
    title: issue.fields.summary,
    subtitle,
    arg: `${URLS.browseURL}/${issue.key}`,
    icon: {
      path: getIconPathForIssueType(issue.fields.issuetype.name),
    },
    mods: {
      cmd: {
        subtitle: `Open '${issue.key}' in your browser.`,
        arg: `${URLS.browseURL}/${issue.key}`,
      },
    },
  };
};

const buildIssuesURL = (epicKey) => {
  const jql = `"Epic Link" = ${epicKey}`;
  const fields = 'summary, status, assignee, priority, issuetype';
  const url = `${URLS.apiURL}/search?jql=${encodeURI(jql)}&fields=${encodeURI(fields)}`;
  return url;
};

const fetchIssues = async () => {
  const url = buildIssuesURL(process.env.epicId);
  const options = {
    ...defaultURLOptions,
    transform: (body) => {
      const rawIssues = body.issues;
      return rawIssues.map(transformRawIssueToItem);
    },
  };
  return alfy.fetch(url, options);
};

const extractFilterText = (input) => {
  // remove the pattern '${EPIC ID} > ' from the beginning of the text
  const patternToRemove = new RegExp(`${process.env.epicId} > `);
  return input.replace(patternToRemove, '');
};

(async () => {
  const filterText = extractFilterText(alfy.input).toLowerCase();
  const items = await fetchIssues();

  if (filterText) {
    const matchedItems = filterItemsToMatchTitle(items, filterText);
    alfy.output(matchedItems);
  } else {
    alfy.output(items);
  }
})();
