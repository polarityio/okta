const { size, map, get } = require("lodash/fp");

const createLookupResults = (usersWithGroup) =>
  map((userWithGroup) => {
    const { Logger } = require("../integration");
    Logger({ usersWithGroup }, "users with group", "trace");

    const lookupResult = {
      entity: userWithGroup.entity,
      data: size(usersWithGroup)
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
