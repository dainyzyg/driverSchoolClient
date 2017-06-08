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
		//extensions: ['', '.js', '.vue']
	},
	output: {
		//chunkFilename: "[chunkhash].bundle.js",
		path: path.resolve(__dirname, './js/dist'),
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				// vue-loader options go here
			}
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			// query: {
			// 	//cacheDirectory: true,
			// 	"plugins": ["transform-runtime"],
			// 	presets: ['latest']
			// }
		}, {
			test: /\.(png|jpg|gif|svg)$/,
			loader: 'file-loader',
			options: {
				name: 'img/[name].[ext]?[hash]',
				publicPath: '../../js/dist/',
			}
		}]
	},
	devtool: '#eval-source-map'
}
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
	config.devtool = '#source-map'
	// http://vue-loader.vuejs.org/en/workflow/production.html
	config.plugins = (config.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: false,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
module.exports = config;