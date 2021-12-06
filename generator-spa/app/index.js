const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  initializing() {
    this.deps = []
    this.devDeps = [
      '@babel/core',
      '@babel/preset-env',
      '@tsconfig/svelte',
      'babel-loader',
      'copy-webpack-plugin',
      'css-loader',
      'html-entities',
      'html-webpack-plugin',
      'mini-css-extract-plugin',
      'postcss',
      'postcss-loader',
      'postcss-preset-env',
      'sass',
      'sass-loader',
      'svelte',
      'svelte-loader',
      'svelte-preprocess',
      'ts-loader',
      'typescript',
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
    ]
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
    const files = {
      gitignore: '.gitignore',
      'src/assets/favicon.ico': 'src/assets/favicon.ico',
      'src/components/App.svelte': 'src/components/App.svelte',
      'src/index.ts': 'src/index.ts',
      'src/styles/index.scss': 'src/styles/index.scss',
      'src/templates/index.html': 'src/templates/index.html',
      'tsconfig.json': 'tsconfig.json',
      'webpack.config.js': 'webpack.config.js',
    }
    for (const [k, v] of Object.entries(files)) {
      this.fs.copyTpl(this.templatePath(k), this.destinationPath(v), this.cfg)
    }
    this.packageJson.merge({
      name: this.cfg.appname,
      version: '0.1.0',
      description: '',
      author: this.cfg.author,
      license: this.cfg.license,
      keywords: [],
      site: {
        title: this.cfg.appname,
        meta: {
          author: [this.cfg.author],
          description: '',
          keywords: ['sample', 'website'],
        },
      },
      private: this.cfg.private,
      main: 'src/index.ts',
      browserslist: ['defaults'],
      scripts: {
        start: 'npm run serve:prod',
        dev: 'npm run serve:dev',
        build: 'npm run build:prod',
        'build:dev': 'webpack --mode=development',
        'build:prod': 'webpack --mode=production',
        'serve:dev': 'webpack serve --mode=development',
        'serve:prod': 'webpack serve --mode=production',
        dist: 'npm run build:prod && npm run tar:xz',
        'tar:xz': 'tar -cJvf ./site.tar.xz -C ./dist .',
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
