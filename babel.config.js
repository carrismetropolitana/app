module.exports = function (api) {
	api.cache(true);
	return {
		plugins: [
			// Outros plugins que você use, por exemplo module-resolver...
			['module-resolver', { extensions: ['.tsx', '.ts', '.js', '.json'] }],
			// DEVE vir por último:
			'react-native-reanimated/plugin',
		],
		presets: ['babel-preset-expo'], // Herdado do Expo :contentReference[oaicite:5]{index=5}
	};
};
