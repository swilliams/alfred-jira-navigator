const alfy = require('alfy');
const { URLS, defaultURLOptions } = require('./utils');

const buildProjectSearchURL = (searchForProjName) => `${URLS.apiURL}/project/search?query=${encodeURI(searchForProjName)}`;

const transformRawProjectToItem = (rawProj) => {
  const title = rawProj.name;
  return {
    title,
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
