const { size, map, get } = require("lodash/fp");

const createLookupResults = (usersWithGroup) =>
  map((userWithGroup) => {
    const { Logger } = require("../integration");
    Logger({ usersWithGroup }, "users with group", "trace");
    /* If a 404 is returned an error will not be thrown,
      "user": {
        "errorCode": "E0000007",
        "errorSummary": "Not found: Resource not found: asdf@gmail.com (User)",
        "errorLink": "E0000007",
        "errorId": "oaef7BDyVGuT6-QRfT1swia2A",
        "errorCauses": []
      }
  } */
    const lookupResult = {
      entity: userWithGroup.entity,
      data: !size(get("user.errorSummary", userWithGroup))
        ? {
            summary: createSummaryTags(userWithGroup),
            details: userWithGroup
          }
        : null
    };

    return lookupResult;
  }, usersWithGroup);

const createSummaryTags = (resultsForThisEntity) => {
  const tags = [];

  tags.push(`Email: ${get("user.profile.email", resultsForThisEntity)}`);
  tags.push(`Status: ${get("user.status", resultsForThisEntity)}`);
  return tags;
};

module.exports = createLookupResults;
