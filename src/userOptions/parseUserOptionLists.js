const { splitCommaSeparatedUserOption } = require("./utils");

const parseUserOptionLists = async (options) => {
  const parsedChannelNames = splitCommaSeparatedUserOption("channelNames", options);

  const updatedOptions = {
    ...options,
    parsedChannelNames
  };

  return updatedOptions;
};

module.exports = parseUserOptionLists;
