const Joi = require('joi');

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

const schemas = {
  project: Joi.object().keys({
    name: Joi.string().required(),
    key: Joi.string().required(),
  }).unknown(true),
  epic: Joi.object().keys({
    key: Joi.string().required(),
    fields: Joi.object().keys({
      summary: Joi.string().required(),
      status: Joi.object().keys({
        name: Joi.string().required(),
      }).unknown(true),
    }).unknown(true),
  }).unknown(true),
  issue: Joi.object().keys({
    key: Joi.string().required(),
    fields: Joi.object().keys({
      summary: Joi.string().required(),
      issuetype: Joi.object().keys({
        name: Joi.string().required(),
      }).unknown(true),
      priority: Joi.object().keys({
        name: Joi.string().required(),
        id: Joi.number().integer().required(),
      }).unknown(true),
      status: Joi.object().keys({
        name: Joi.string().required(),
      }).unknown(true),
    }).unknown(true),
  }).unknown(true),
};

const validateAgainstSchema = (obj, schemaName) => {
  const schema = schemas[schemaName];
  const validation = schema.validate(obj);
  if (validation.error) {
    return `${schemaName} Schema does not match: ${validation.error}`;
  }
  return undefined;
};

module.exports = {
  URLS,
  defaultURLOptions,
  iconPath,
  getIconPathForIssueType,
  filterItemsToMatchTitle,
  validateAgainstSchema,
};
