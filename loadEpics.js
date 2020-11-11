const alfy = require('alfy');
const { URLS, defaultURLOptions, iconPath } = require('./utils');

const transformRawEpicToItem = (epic) => ({
  title: epic.fields.summary,
  subtitle: epic.key,
  arg: epic.key,
  icon: {
    path: `${iconPath}/jira-icon-epic.png`,
  },
  mods: {
    cmd: {
      subtitle: `Open '${epic.key}' in your browser.`,
      arg: `${URLS.browseURL}/${epic.key}`,
    },
  },
});

const buildEpicsURL = (epicKey) => {
  const jql = `project = ${epicKey} AND issuetype = Epic AND resolution = Unresolved`;
  const fields = 'summary, status';
  const url = `${URLS.apiURL}/search?jql=${encodeURI(jql)}&fields=${encodeURI(fields)}`;
  return url;
};

const fetchEpics = async () => {
  const url = buildEpicsURL(process.env.epicKey);
  const options = {
    ...defaultURLOptions,
    transform: (body) => {
      const rawEpics = body.issues;
      return rawEpics.map(transformRawEpicToItem);
    },
  };
  return alfy.fetch(url, options);
};

const extractFilterText = (input) => {
  // remove the pattern '${projectKey} > ' from the beginning of the text
  const patternToRemove = new RegExp(`${process.env.epicKey} > `);
  return input.replace(patternToRemove, '');
};

(async () => {
  const filterText = extractFilterText(alfy.input).toLowerCase();
  const items = await fetchEpics();

  if (filterText) {
    const matchedItems = items.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(filterText);
      const matchesArg = item.arg.includes(filterText);
      return matchesTitle || matchesArg;
    });
    alfy.output(matchedItems);
  } else {
    alfy.output(items);
  }
})();
