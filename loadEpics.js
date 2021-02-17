const alfy = require('alfy');
const {
  URLS, defaultURLOptions, iconPath, validateAgainstSchema,
} = require('./utils');

const createSearchItem = (searchText) => ({
  title: searchText,
  subtitle: `Search ${process.env.epicKey} for "${searchText}"`,
  arg: `SEARCH ${searchText}`,
});

const transformRawEpicToItem = (epic) => {
  // Make sure the structure of the `epic` matches what we expect.
  const validationError = validateAgainstSchema(epic, 'epic');
  if (validationError) {
    alfy.error(validationError);
  }

  return {
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
  };
};

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
  const fetchedEpics = await fetchEpics();
  let displayItems = fetchedEpics; // Show all epics by default.

  if (filterText) {
    displayItems = fetchedEpics.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(filterText);
      const matchesArg = item.arg.includes(filterText);
      return matchesTitle || matchesArg;
    });
  }
  // Add a "search item" so that the user can also do a generic search
  displayItems.push(createSearchItem(filterText));
  alfy.output(displayItems);
})();
