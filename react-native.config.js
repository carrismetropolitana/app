module.exports = {
	dependencies: {
		'@amplitude/analytics-react-native': {
			platforms: {
				android: {
					cmakeLists: null,
					sourceDir: './node_modules/@amplitude/analytics-react-native/android',
				},
			},
		},
	},
};
