const createLookupResults = require("./createLookupResults");
const getUserWithGroup = require("./queries/getUserWithGroup");

const getLookupResults = async (entities, options) => {
  const { Logger } = require("../integration");

  const usersWithGroup = await getUserWithGroup(options, entities);
  Logger({ usersWithGroup }, "Users by Group", "trace");
  
  const lookupResults = createLookupResults(usersWithGroup);
  return lookupResults;
};

module.exports = getLookupResults;
