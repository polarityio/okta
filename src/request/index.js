const { parallelLimit } = require("async");
const { map, get } = require("lodash/fp");
const createRequestWithDefaults = require("./createRequestWithDefaults");

const requestWithDefaults = createRequestWithDefaults();

const requestsInParallel = async (
  requestsOptions,
  responseGetPath = "body",
  limit = 10
) => {
  const { Logger } = require("../../integration");
  const unexecutedRequestFunctions = map(
    ({ entity, ...requestOptions }) =>
      async () => {
        const result = get(responseGetPath, await requestWithDefaults(requestOptions));
        Logger({ result }, "ressssssss1", "trace");
        return result ? { entity, result } : result;
      },
    requestsOptions
  );

  return await parallelLimit(unexecutedRequestFunctions, limit);
};

module.exports = { createRequestWithDefaults, requestWithDefaults, requestsInParallel };
