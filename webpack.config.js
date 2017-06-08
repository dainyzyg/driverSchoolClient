/**
 * Created by ad on 2016/2/22.
 */
var path = require('path')
var getFileList = require('./node/getFileList')
var deleteFilesByDir = require('./node/deleteFilesByDir')
var webpack = require('webpack')
var node_modules = path.resolve(__dirname, 'node_modules')
var entryPath = path.resolve(__dirname, './js/src')
var entry = {}
deleteFilesByDir(path.resolve(__dirname, './js/dist'))
var fileList = getFileList(entryPath)
fileList.forEach((item, index, array) => {
	if (item.path.match(/js$/)) {
		entry[item.relative] = item.path
	}
})
var deps = []

var config = {
	entry: entry,
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		//chunkFilename: "[chunkhash].bundle.js",
		path: path.resolve(__dirname, './js/dist'),
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				cacheDirectory: true,
				"plugins": ["transform-runtime"],
				presets: ['latest']
			}
		}],
		noParse: []
	},
	// plugins: [
	// 	new webpack.optimize.OccurenceOrderPlugin(),
	// 	new webpack.optimize.UglifyJsPlugin({
	// 		output: {
	// 			ascii_only: true
	// 		},
	// 		compress: {
	// 			warnings: false
	// 		}
	// 	}),
	// 	new webpack.DefinePlugin({
	// 		"process.env": {
	// 			NODE_ENV: JSON.stringify("production")
	// 		}
	// 	}),
	// 	new webpack.optimize.DedupePlugin(),
	// 	new webpack.NoErrorsPlugin(),
	// ],
}
module.exports = config;