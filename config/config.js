module.exports = {
  name: "Okta",
  acronym: "OKTA",
  description: "",
  entityTypes: ["email"],
  styles: ["./styles/styles.less"],
  defaultColor: "light-blue",
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
    proxy: "",
    rejectUnauthorized: true
  },
  logging: {
    level: "info" //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: "url",
      name: "Okta URL",
      description: "URL for Okta instance.",
      default: "",
      type: "text",
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: "apiToken",
      name: "Okta API Token",
      description: "API Token required to authorize with Okta.",
      default: "",
      type: "password",
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: "useDefaultDomains",
      name: "Use Default Domains",
      description:
        "A comma delimited list of domains that will be searched when doing email lookups in Okta." +
        "If no domains are provided, all email addresses will be searched.",
      default: true,
      type: "boolean",
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: "defaultDomain",
      name: "Default Domain",
      description:
        "Enter a comma delimited list of domains that will be searched when doing email lookups in Okta.",
      default: "",
      type: "text",
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
