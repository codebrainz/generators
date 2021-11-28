const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  initializing() {
    this.deps = []
    this.devDeps = ['cross-env', 'typescript']
  }
  async prompting() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: "Your project's name",
        default: this.appname,
      },
      {
        type: 'input',
        name: 'author',
        message: 'Enter your Full Name <email> (website)',
        /*default: `${this.user.git.name()} <${this.user.git.email()}>`,*/
        store: true,
      },
      {
        type: 'input',
        name: 'license',
        message: 'What license will this package have?',
        default: 'UNLICENSED',
      },
      {
        type: 'confirm',
        name: 'private',
        message: 'Is this a private package?',
        default: true,
      },
    ])
    this.cfg = {
      appname: answers.name,
      author: answers.author,
      license: answers.license,
      private: answers.private,
    }
  }
  async writing() {
    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'),
      this.cfg
    )
    this.fs.copyTpl(
      this.templatePath('index.ts'),
      this.destinationPath('src/index.ts'),
      this.cfg
    )
    this.fs.copyTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
      this.cfg
    )
    this.packageJson.merge({
      name: this.cfg.appname,
      version: '0.1.0',
      description: '',
      author: this.cfg.author,
      license: this.cfg.license,
      keywords: [],
      private: this.cfg.private,
      main: 'src/index.ts',
      scripts: {
        start: 'npm run build:prod && npm run start:prod',
        dev: 'npm run build:dev && npm run start:dev',
        'build:dev': 'cross-env NODE_ENV=development tsc',
        'start:dev': 'cross-env NODE_ENV=development node src/index.js',
        'build:prod': 'cross-env NODE_ENV=production tsc',
        'start:prod': 'cross-env NODE_ENV=production node src/index.js',
      },
      prettier: {
        semi: false,
        singleQuote: true,
        bracketSameLine: true,
        arrowParens: 'avoid',
      },
    })

    this.deps.sort()
    this.devDeps.sort()

    await this.addDependencies(this.deps)
    await this.addDevDependencies(this.devDeps)
  }
}
