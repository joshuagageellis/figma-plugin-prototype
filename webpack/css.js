const cssLoader = {
	test: /\.css$/,
	use: [
		'style-loader',
		{ loader: 'css-loader' }
	]
};

export default cssLoader;