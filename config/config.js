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
      key: "domain",
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
      type: "text",
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
