const { map, find, isEmpty } = require("lodash/fp");
const { getLogger } = require("./logger");
const { ApiRequestError } = require("./errors");
const { authenticatedPolarityRequest } = require("./polarity-request");

const SUCCESS_CODES = [200, 404];

const getUserWithGroup = async (entities) => {
  const Logger = getLogger();

  const searchedUsers = await searchUsers(entities);
  Logger.trace({ searchedUsers }, "Searched Users");

  if (!isEmpty(searchedUsers)) {
    const userGroups = await searchUserGroupById(searchedUsers);
    const userWithGroup = groupUserWithUserGroup(searchedUsers, userGroups);
    return userWithGroup;
  }
};

const searchUsers = async (entities) => {
  const Logger = getLogger();

  const requestOptions = map(
    (entity) => ({
      entity,
      method: "GET",
      path: `/api/v1/users/${entity.value}`
    }),
    entities
  );

  const responses = await authenticatedPolarityRequest.makeAuthenticatedRequest(
    requestOptions
  );

  Logger.trace({ responses }, "Responses");
  // check for Unexpected status codes
  // 200 means we found a user and had success
  // 404 means no user.
  for (const response of responses) {
    if (!SUCCESS_CODES.includes(response.result.statusCode)) {
      throw new ApiRequestError(`Unexpected status code ${response.result.statusCode}`, {
        statusCode: response.result.statusCode,
        body: response.result.body,
        requestOptions: requestOptions
      });
    }
  }

  return responses;
};

const searchUserGroupById = async (users) => {
  const Logger = getLogger();
  Logger.trace({ users }, "Users");

  const requestOptions = map(
    (user) => ({
      entity: user.entity,
      method: "GET",
      path: `/api/v1/users/${user.result.body.id}/groups`
    }),
    users
  );

  const responses = await authenticatedPolarityRequest.makeAuthenticatedRequest(
    requestOptions
  );

  for (const response of responses) {
    if (!SUCCESS_CODES.includes(response.result.statusCode)) {
      throw new ApiRequestError(`Unexpected status code ${response.result.statusCode}`, {
        statusCode: response.result.statusCode,
        body: response.result.body,
        requestOptions: requestOptions
      });
    }
  }

  return responses;
};

const groupUserWithUserGroup = (users, userGroups) => {
  const userWithGroup = map((user) => {
    const userGroup = find(
      (userGroup) => userGroup.entity.value === user.entity.value,
      userGroups
    );

    return {
      entity: user.entity,
      user,
      userGroup
    };
  }, users);

  return userWithGroup;
};

module.exports = {
  searchUsers,
  getUserWithGroup
};
