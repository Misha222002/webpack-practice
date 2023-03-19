const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); //овтечает за копирование файлов
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //позволяет выносить css в отдельный файл
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

// const TerserWebpackPlugin = require("terser-webpack-plugin");

// const isDev = process.env.NODE_ENV === "development"; // системная переменная, определяет режим разоработки
// const isProd = !isDev;
// console.log("IS DEV: ", isDev);

// const optimization = () => {
//   const config = {
//     splitChunks: {
//       chunks: "all",
//     },
//   };
//   if (isProd) {
//     config.minimizer = [new TerserWebpackPlugin()];
//   }
// };

const cssLoaders = (extra) => {
  const loaders = [MiniCssExtractPlugin.loader, "css-loader"];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      //копируем файлы и переносим их
      patterns: [
        {
          from: path.resolve(__dirname, "src/favicon.ico"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ];

  base.push(new BundleAnalyzerPlugin())

  return base;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ["@babel/preset-env"],
  };
  if (preset) {
    opts.presets.push(preset);
  }
  return opts;
};

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "src"),
  entry: {
    main: "./index.jsx",
    analytics: "./analytics.ts",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json", ".png"], //Позволяет не писать в импортах расширение файла
    alias: {
      //Позволяет писать пути, которые можно использовать в импортах
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  // optimization: optimization(), //оптимизация для jquery и может быть других
  devServer: {
    //не надо обновлять сайт, чтобы вступили изменения всилу
    static: {
      directory: path.join(__dirname, "src"),
    },
    compress: true,
    port: 9000,
    open: true,
  },
  devtool: "source-map",
  plugins: plugins() ,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.(png|jpg|svg|gift)$/,
        type: "asset/resource",
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: "asset/resource",
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"],
      },
      {
        test: /\.csv$/,
        use: ["csv-loader"],
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader"),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions(),
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        },
      },
    ],
  },
};
