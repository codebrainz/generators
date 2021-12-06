const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sveltePreprocess = require("svelte-preprocess");
const { encode } = require("html-entities");
const pkgConfig = require("./package.json");

module.exports = (env, argv) => {
  const { mode } = argv;
  const prod = mode === "production";
  return {
    mode,
    entry: {
      bundle: [resolve("src", "index.ts")],
    },
    output: {
      filename: "bundle.js",
      path: resolve("dist"),
      clean: true,
    },
    optimization: {
      minimize: prod,
    },
    resolve: {
      alias: {
        svelte: resolve("node_modules", "svelte"),
      },
      extensions: [".svelte", ".tsx", ".ts", ".js", ".mjs"],
      mainFields: ["svelte", "browser", "module", "main"],
    },
    module: {
      rules: [
        {
          test: /\.m?js$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.tsx?$/i,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.svelte$/i,
          use: {
            loader: "svelte-loader",
            options: {
              emitCss: true,
              preprocess: sveltePreprocess(),
            },
          },
        },
        {
          test: /\.(s[ac]|c)ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: false,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      "postcss-preset-env",
                      {
                        /*options*/
                      },
                    ],
                  ],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /node_modules\/svelte\/.*\.mjs$/i,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        hash: prod,
        template: resolve("src", "templates", "index.html"),
        favicon: resolve("src", "assets", "favicon.ico"),
        ...siteInfo,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve("src", "assets"),
            to: resolve("dist"),
          },
        ],
      }),
    ],
    devtool: prod ? "source-map" : "inline-source-map",
    devServer: {
      static: {
        directory: resolve("public"),
      },
      compress: true,
      port: 9000,
    },
  };
};

const resolve = (...args) => require("path").resolve(__dirname, ...args);

const siteInfo = (() => {
  const result = {};
  if (pkgConfig.site?.title) {
    result.title = pkgConfig.site.title;
  }
  if (pkgConfig.site?.meta) {
    result.meta = {};
    if (pkgConfig.site?.meta.author) {
      if (Array.isArray(pkgConfig.site.meta.author)) {
        result.meta.author = pkgConfig.site.meta.author
          .map((x) => encode(x.trim()))
          .join(", ");
      } else {
        result.meta.author = pkgConfig.site.meta.author
          .split(",")
          .map((x) => encode(x.trim()))
          .join(", ");
      }
    }
    if (pkgConfig.site?.meta.description) {
      result.meta.description = pkgConfig.site.meta.description;
    }
    if (pkgConfig.site?.meta.keywords) {
      if (Array.isArray(pkgConfig.site.meta.keywords)) {
        result.meta.keywords = pkgConfig.site.meta.keywords
          .map((x) => encode(x.trim()))
          .join(", ");
      } else {
        result.meta.keywords = pkgconfig.site.meta.keywords
          .split(",")
          .map((x) => encode(x.trim()))
          .join(", ");
      }
    }
  }
  return result;
})();
