// Second major step in the workflow. Now that we have a project from `searchProjects`,
// query the epics in that project.

const alfy = require('alfy');
const {
  URLS, defaultURLOptions, iconPath, validateAgainstSchema,
} = require('./utils');

// Create the "row" that will be displayed representing a search.
const createSearchItem = (searchText) => ({
  title: searchText,
  subtitle: `Search ${process.env.epicKey} for "${searchText}"`,
  arg: `SEARCH ${searchText}`,
});

// Take the raw JSON from the API and transform it into the format Alfred expects.
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

// Build a URL that will search within a project for only Epics that are unresolved.
const buildEpicsURL = (epicKey) => {
  const jql = `project = ${epicKey} AND issuetype = Epic AND resolution = Unresolved`;
  const fields = 'summary, status';
  const url = `${URLS.apiURL}/search?jql=${encodeURI(jql)}&fields=${encodeURI(fields)}`;
  return url;
};

// Fetch all of the epics defined by `buildEpicsURL` from the Jira API and then convert them to
// Alfred's format.
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

// remove the pattern '${projectKey} > ' from the beginning of the text
const extractFilterText = (input) => {
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
