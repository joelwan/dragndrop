module.exports = [
	{
		test: /\.js$/,
		loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
      presets: ['es2015']
    }
	},
	{
		test: /\.png/,
		loader: "url-loader?limit=10000&mimetype=image/png"
	},
	{
		test: /\.scss$/,
		exclude: /node_modules/,
		loaders: ['style', 'css', 'sass']
	}
];
