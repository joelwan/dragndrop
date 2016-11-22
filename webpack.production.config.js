var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// global css files
loaders.push({
  test: /\.scss$/,
	loader: ExtractTextPlugin.extract('style', 'css!sass')
});


module.exports = {
	entry: [
		'./src/js/main.js'
	],
	output: {
		path: path.join(__dirname, './dist'),
		filename: 'js/gallery.js'
	},
	resolve: {
		extensions: ['', '.js']
	},
	module: {
		loaders
	},
	plugins: [
		new WebpackCleanupPlugin({
			  exclude: ['index.html']
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				drop_console: false,
				drop_debugger: false
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('css/gallery.css', {
			allChunks: true
		})
	]
};
