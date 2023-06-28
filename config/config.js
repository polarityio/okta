module.exports = {
  name: "Okta",
  acronym: "OKTA",
  description:
    "Search Okta user accounts by email and display account and group information.",
  entityTypes: ["email"],
  styles: ["./styles/styles.less"],
  defaultColor: "light-blue",
  onDemandOnly: true,
  block: {
    component: {
      file: "./components/block.js"
    },
    template: {
      file: "./templates/block.hbs"
    }
  },
  request: {
    cert: "",
    key: "",
    passphrase: "",
    ca: "",
    proxy: ""
  },
  logging: {
    level: "info" //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: "url",
      name: "Okta URL",
      description:
        "URL for your Okta instance.  The URL should include the scheme (https://).",
      default: "",
      type: "text",
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: "apiToken",
      name: "Okta API Token",
      description: "API Token required to authorize with Okta.",
      default: "",
      type: "password",
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: "defaultDomains",
      name: "Default Domains to Search",
      description:
        "A comma delimited list of domains that will be searched when doing email lookups in Okta. If left blank, all email addresses will be searched.",
      default: "",
      type: "text",
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
