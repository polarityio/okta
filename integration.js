"use strict";

const { map, reduce } = require("lodash/fp");

const { setLogger } = require("./src/logger");
const { parseErrorToReadableJSON } = require("./src/errors");
const { authenticatedPolarityRequest } = require("./src/polarity-request");
const { createResultObject } = require("./src/create-result-object");

const { getUserWithGroup } = require("./src/get-user-with-group");

let Logger = null;

const startup = (logger) => {
  Logger = logger;
  setLogger(Logger);
};

/**
 * @param entities
 * @param options
 * @param cb
 * @returns {Promise<void>}
 */

const doLookup = async (entities, options, cb) => {
  try {
    Logger.trace({ options }, "options");

    const emailsToSearch =
      options.defaultDomains.trim().length > 0
        ? splitOutIgnoredDomains(options, entities)
        : entities;

    if (emailsToSearch.length === 0) {
      return cb(null, []);
    }

    authenticatedPolarityRequest.setRequestHeadersAndOptions({
      url: options.url,
      headers: {
        Authorization: `SSWS ${options.apiToken}`
      }
    });

    const usersWithGroups = await getUserWithGroup(emailsToSearch);
    Logger.trace({ usersWithGroups }, "Users with Groups");

    const lookupResults = map(
      (userWithGroup) => createResultObject(userWithGroup),
      usersWithGroups
    );
    Logger.trace({ lookupResults }, "Lookup Results");

    cb(null, lookupResults);
  } catch (error) {
    const errorAsPojo = parseErrorToReadableJSON(error);
    Logger.error({ error: errorAsPojo }, "Error in doLookup");
    cb(errorAsPojo);
  }
};

const splitOutIgnoredDomains = (options, entities) => {
  const defaultDomains = options.defaultDomains.split(",").map((domain) => domain.trim());
  Logger.trace({ defaultDomains }, "Default Domains");

  const results = reduce(
    (acc, entity) => {
      const domain = entity.value.split("@")[1];
      Logger.trace({ domain }, "Domain");
      if (defaultDomains.includes(domain)) {
        acc.push(entity);
      }
      return acc;
    },
    [],
    entities
  );

  Logger.trace({ results }, "Emails to search");
  return results;
};

const validateOption = (errors, options, optionName, errMessage) => {
  if (!(typeof options[optionName].value === "string" && options[optionName].value)) {
    errors.push({
      key: optionName,
      message: errMessage
    });
  }
};

const validateOptions = (options, callback) => {
  let errors = [];

  validateOption(errors, options, "url", "You must provide an api url.");
  validateOption(errors, options, "apiToken", "You must provide a valid access key.");

  callback(null, errors);
};

module.exports = {
  startup,
  doLookup,
  validateOptions,
  Logger
};
