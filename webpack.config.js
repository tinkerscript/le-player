'use strict';

const path = require('path');
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	entry: {
		'le-player' : './source/js/le-player.js',
		'le-player-ga' : './source/js/plugins/le-player-ga.js'
	},

	output: {
		path: path.join(__dirname, 'dist', 'js'),
		filename: '[name].js',
		publicPath: "/dist/js/"
	},

	plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        })
	],

	module: {
		preLoaders : [
			{
				test: /(\.js)$/,
				loader : 'eslint',
				exclude: /(node_modules|bower_components|jquery)/,
				include: path.join(__dirname, 'source', 'js'),
			}
		],
		loaders: [
			{
				test: /(\.js)$/,
				loader: 'babel',
				exclude: /(node_modules|bower_components|jquery)/,
				include: path.join(__dirname, 'source', 'js'),
				query: {
					presets: ['es2015', 'stage-0']
				}
			},
			{
				test: /(\.svg)$/,
				loader: 'raw-loader',
				exclude: /(node_modules|bower_components|jquery)/,
				include: path.join(__dirname, 'dist', 'svg'),
			},
		]
	},

	resolve: {
		modulesDirectories: ['node_modules', 'bower_components'],
		alias: {
		  // For libs from node_modules or bower_components
		  //'jquery': 'jquery/dist/jquery.min'
		}
	},
	externals: {
		jquery: "$"
	},
	eslint : {
		emitWarning: true
	}
};


