const { map, find, isEmpty } = require("lodash/fp");
const { getLogger } = require("./logger");
const { ApiRequestError } = require("./errors");
const { authenticatedPolarityRequest } = require("./polarity-request");

const { SUCCESS_CODES } = require("./constants");

const getUserWithGroup = async (entities) => {
  const Logger = getLogger();

  const searchedUsers = await searchUsers(entities);
  Logger.trace({ searchedUsers }, "Searched Users");

  if (!isEmpty(searchedUsers)) {
    const userGroups = await searchUserGroupById(searchedUsers);
    const userWithGroup = groupUserWithUserGroup(searchedUsers, userGroups);
    return userWithGroup;
  }

  return [];
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

  const response = await authenticatedPolarityRequest.makeAuthenticatedRequest(
    requestOptions
  );

  Logger.trace({ response }, "Response");

  return response;
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

  const response = await authenticatedPolarityRequest.makeAuthenticatedRequest(
    requestOptions
  );

  return response;
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
