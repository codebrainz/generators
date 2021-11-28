const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project's name",
        default: this.appname,
      },
      {
        type: "input",
        name: "author",
        message: "Enter your Full Name <email> (website)",
        /*default: `${this.git.name()} <${this.git.email()}>`,*/
        store: true,
      },
      {
        type: "input",
        name: "license",
        message: "What license will this package have?",
        default: "UNLICENSED",
      },
      {
        type: "confirm",
        name: "private",
        message: "Is this a private package?",
        default: true,
      },
    ]);
    this.cfg = {
      appname: answers.name,
      author: answers.author,
      license: answers.license,
      private: answers.private,
    };
  }
  async writing() {
    this.fs.copyTpl(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore"),
      this.cfg
    );
    this.fs.copyTpl(
      this.templatePath("index.ts"),
      this.destinationPath("src/index.ts"),
      this.cfg
    );
    this.fs.copyTpl(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json"),
      this.cfg
    );
    this.packageJson.merge({
      name: this.cfg.appname,
      version: "0.1.0",
      description: "",
      author: this.cfg.author,
      license: this.cfg.license,
      keywords: [],
      private: this.cfg.private,
      main: "src/index.ts",
      scripts: {
        start:
          "cross-env NODE_ENV=production tsc && cross-env NODE_ENV=production node src/index.js",
        dev: "cross-env NODE_ENV=development tsc && cross-env NODE_ENV=development node src/index.js",
      },
      prettier: {
        semi: false,
        singleQuote: true,
        bracketSameLine: true,
        arrowParens: "avoid",
      },
    });
    await this.addDevDependencies(["cross-env", "typescript"]);
  }
};
