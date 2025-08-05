module.exports = function (api) {
	api.cache(true);
	return {
		plugins: [
			['module-resolver', { extensions: ['.tsx', '.ts', '.js', '.json'] }],
			'react-native-reanimated/plugin',
		],
		presets: ['babel-preset-expo'],
	};
};
