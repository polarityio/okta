const { map } = require("lodash/fp");
const { requestsInParallel } = require("../request");

const getUserWithGroup = async (options, entities) => {
  const { Logger } = require("../../integration");

  const searchedUsers = await searchUsers(options, entities);
  Logger({ searchedUsers }, "search2", "trace");

  const userGroups = await searchUserGroupById(options, searchedUsers);
  Logger({ userGroups }, "user groups", "trace");

  const userWithGroup = groupUserWithUserGroup(searchedUsers, userGroups);
  Logger({ userWithGroup }, "results", "trace");

  return userWithGroup;
};

const searchUsers = async (options, entities) => {
  const { Logger } = require("../../integration");

  const queryRequestOptions = map(
    (entity) => ({
      entity,
      method: "GET",
      site: "okta",
      path: `/api/v1/users/${entity.value}`,
      headers: {
        Authorization: `SSWS ${options.apiToken}`
      },
      options
    }),
    entities
  );
  Logger(queryRequestOptions, "search users options", "trace");

  const searchedUsers = await requestsInParallel(queryRequestOptions, "body");
  Logger({ searchedUsers }, "searched users", "trace");

  return searchedUsers;
};
//RESPONSE:
// "result": {
//   "id": "00u27896aJsaJieFt5d6",
//   "status": "ACTIVE",
//   "created": "2020-12-10T18:40:44.000Z",
//   "activated": "2021-12-07T03:24:14.000Z",
//   "statusChanged": "2021-12-07T03:24:55.000Z",
//   "lastLogin": "2022-02-14T14:24:03.000Z",
//   "lastUpdated": "2021-12-07T03:24:55.000Z",
//   "passwordChanged": "2021-12-07T03:24:55.000Z",
//   "type": { "id": "oty1kg5b6rKvjQm845d6" },
//   "profile": {
//     "firstName": "ed",
//     "lastName": "dorsey",
//     "mobilePhone": null,
//     "secondEmail": null,
//     "login": "ed@polarity.io",
//     "email": "ed@polarity.io"
//   },
//   "credentials": {
//     "password": {},
//     "emails": [
//       {
//         "value": "ed@polarity.io",
//         "status": "VERIFIED",
//         "type": "PRIMARY"
//       }
//     ],
//     "provider": { "type": "OKTA", "name": "OKTA" }
//   },
//   "_links": {
//     "suspend": {
//       "href": "https://dev-6029448.okta.com/api/v1/users/00u27896aJsaJieFt5d6/lifecycle/suspend",
//       "method": "POST"
//     },
//     "schema": {
//       "href": "https://dev-6029448.okta.com/api/v1/meta/schemas/user/osc1kg5b6rKvjQm845d6"
//     },
//     "resetPassword": {
//       "href": "https://dev-6029448.okta.com/api/v1/users/00u27896aJsaJieFt5d6/lifecycle/reset_password",
//       "method": "POST"
//   }
// }
const searchUserGroupById = async (options, users) => {
  const { Logger } = require("../../integration");
  Logger({ users }, "users asdf", "trace");

  const queryRequestOptions = map(
    (user) => ({
      entity: user.entity,
      method: "GET",
      site: "okta",
      path: `/api/v1/users/${user.result.id}/groups`,
      headers: {
        Authorization: `SSWS ${options.apiToken}`
      },
      options
    }),
    users
  );
  Logger(queryRequestOptions, "group search options", "trace");

  const userGroups = await requestsInParallel(queryRequestOptions, "body");
  return userGroups;
};
//RESPONSE:
// {
//   "id": "00g1kg5ax8OAMkbDp5d6",
//   "created": "2020-12-03T16:07:23.000Z",
//   "lastUpdated": "2020-12-03T16:07:23.000Z",
//   "lastMembershipUpdated": "2022-12-15T21:07:23.000Z",
//   "objectClass": ["okta:user_group"],
//   "type": "BUILT_IN",
//   "profile": {
//     "name": "Everyone",
//     "description": "All users in your organization"
//   },
//   "_links": {
//     "logo": [
//       {
//         "name": "medium",
//         "href": "https://ok12static.oktacdn.com/assets/img/logos/groups/odyssey/okta-medium.1a5ebe44c4244fb796c235d86b47e3bb.png",
//         "type": "image/png"
//       },
//       {
//         "name": "large",
//         "href": "https://ok12static.oktacdn.com/assets/img/logos/groups/odyssey/okta-large.d9cfbd8a00a4feac1aa5612ba02e99c0.png",
//         "type": "image/png"
//       }
//     ],
//     "users": {
//       "href": "https://dev-6029448.okta.com/api/v1/groups/00g1kg5ax8OAMkbDp5d6/users"
//     },
//     "apps": {
//       "href": "https://dev-6029448.okta.com/api/v1/groups/00g1kg5ax8OAMkbDp5d6/apps"
//     }
//   }
// }
const groupUserWithUserGroup = (users, userGroups) => {
  let results = [];

  for (const user of users) {
    for (const userGroup of userGroups) {
      if (userGroup.entity.value === user.entity.value) {
        results.push({
          entity: userGroup.entity,
          user: user.result,
          userGroup: userGroup.result
        });
      }
    }
  }

  return results;
};

module.exports = getUserWithGroup;
