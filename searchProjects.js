const alfy = require('alfy');
const { URLS, defaultURLOptions, validateAgainstSchema } = require('./utils');

const buildProjectSearchURL = (searchForProjName) => `${URLS.apiURL}/project/search?query=${encodeURI(searchForProjName)}`;

const transformRawProjectToItem = (rawProj) => {
  // Make sure the structure of the `rawProj` matches what we expect.
  const validationError = validateAgainstSchema(rawProj, 'project');
  if (validationError) {
    alfy.error(validationError);
  }

  // convert it to the format Alfred expects
  return {
    title: rawProj.name,
    subtitle: rawProj.key,
    arg: rawProj.key,
    mods: {
      cmd: {
        subtitle: `Open '${rawProj.key}' in your browser.`,
        arg: `${URLS.browseURL}/${rawProj.key}`,
      },
    },
  };
};

(async () => {
  const url = buildProjectSearchURL(alfy.input);
  const options = {
    ...defaultURLOptions,
    transform: (body) => {
      const rawProjects = body.values;
      return rawProjects.map(transformRawProjectToItem);
    },
  };
  const items = await alfy.fetch(url, options);
  alfy.output(items);
})();
