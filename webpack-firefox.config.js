const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = [
  {
    mode: 'production',
    entry: './src/extension.js',
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: { keep_classnames: true, keep_fnames: true }
        })
      ]
    },
    output: {
      path: path.resolve(__dirname, 'dist-firefox'),
      filename: 'extension.js'
    },
    performance: {
      hints: false
    }
  },
  {
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist-firefox'),
      filename: 'index.js'
    },
    performance: {
      hints: false
    }
  }
]
