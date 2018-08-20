const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
	entry: [
		'./index.js',
	],

	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ],
			},
		]
	},

	output: {
		filename: 'index.js',
		path: path.resolve( __dirname, 'dist' ),
	},

	externals: [ 'wp' ],
};
