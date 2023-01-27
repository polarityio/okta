const { DateTime } = require("luxon");
const { get } = require("lodash/fp");
const { getLogger } = require("./logger");

/**
 * Return a Result Object or a Result Miss Object based on the REST API response.
 * @param entity - entity object
 * @param apiResponse - response object from API Rest request
 * @returns {{data: null, entity}|{data: {summary: [string], details}, entity}}
 */
const createResultObject = (results) => {
  if (isMiss(results)) {
    return {
      entity: results.entity,
      data: null
    };
  }

  return {
    entity: results.entity,
    data: {
      summary: createSummaryTags(results),
      details: {
        user: results.user.result.body,
        userGroup: results.userGroup.result.body
      }
    }
  };
};

const createSummaryTags = (resultsForThisEntity) => {
  const tags = [];
  const Logger = getLogger();

  Logger.trace({ resultsForThisEntity }, "Results for this entity");

  tags.push(`Status: ${get("status", resultsForThisEntity.user.result.body)}`);
  // if a user never logged in before then lastlogin will be null
  const lastLogin = get("lastLogin", resultsForThisEntity.user.result.body);
  tags.push(
    `Last Login: ${
      lastLogin === null ? "none" : DateTime.fromISO(lastLogin).toRelative()
    }`
  );

  return tags;
};

/**
 * Okta API returns a 404 status code if a particular IP has no data on it.
 *
 * @param apiResponse
 * @returns {boolean}
 */
const isMiss = (results) => results.user.result.statusCode === 404;

module.exports = { createResultObject, isMiss };
