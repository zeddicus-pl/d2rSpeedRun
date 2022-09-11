module.exports = [
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules\/(?!(d2-holy-grail)\/).*/,
    use: {
      loader: 'babel-loader'
    }
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
    },
  },
  {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-url-loader',
      },
    ],
  },
  {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  },
]