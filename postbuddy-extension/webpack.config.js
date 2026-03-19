const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  entry: {
    index: "./src/index.tsx",
    contentScript: "./src/scripts/contentScript.js",
    instaContentScript: "./src/scripts/instaContentScript.js",
    fbContentScript: "./src/scripts/fbContentScript.js",
    ytContentScript: "./src/scripts/ytContentScript.js",
    xContentScript: "./src/scripts/xContentScript.js",
    whatsappScript: "./src/scripts/whatsappScript.js",
    outlookContentScript: "./src/scripts/outlookContentScript.js",
    reddit: "./src/scripts/reddit.js",
    postbuddy: "./src/scripts/postbuddy.js",
    background: "./src/background.js",
    options: "./src/options/index.tsx",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "manifest.json", to: "../manifest.json" },
        { from: "./src/background.js", to: "js/background.js" },
        { from: "./src/scripts/contentScript.js", to: "js/contentScript.js" },
        {
          from: "./src/scripts/instaContentScript.js",
          to: "js/instaContentScript.js",
        },
        {
          from: "./src/scripts/whatsappScript.js",
          to: "js/whatsappScript.js",
        },
        {
          from: "./src/scripts/fbContentScript.js",
          to: "js/fbContentScript.js",
        },
        {
          from: "./src/scripts/ytContentScript.js",
          to: "js/ytContentScript.js",
        },
        { from: "./src/scripts/xContentScript.js", to: "js/xContentScript.js" },
        { from: "./src/scripts/reddit.js", to: "js/reddit.js" },
        { from: "./src/scripts/postbuddy.js", to: "js/postbuddy.js" },
        { from: "./src/scripts/outlookContentScript.js", to: "js/outlookContentScript.js" },
        { from: "public/icons", to: "../icons" },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_BASE_URL": JSON.stringify(
        process.env.REACT_APP_BASE_URL
      ),
    }),
    ...getHtmlPlugins(["index","options"]),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) => {
      if (chunk === "options") {
        return new HTMLPlugin({
          title: "Postbuddy Options",
          filename: "../options.html",
          template: "./src/options/options.template.html",
          chunks: [chunk],
        });
      }
      return new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      });
    }
  );
}
