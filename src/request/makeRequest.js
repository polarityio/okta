const makeRequest = async ({ site, path, options, ...requestOptions }) => {
  const urlBySite = {
    okta: `${options.domain}${path}`
  };

  const opts = {
    ...requestOptions,
    uri: urlBySite[site]
  };

  return opts;
};

module.exports = makeRequest;
