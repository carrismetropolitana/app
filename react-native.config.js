module.exports = {
	dependencies: {
		'@amplitude/analytics-react-native': {
			platforms: {
				android: {
					newArchEnabled: false,
					packageImportPath: 'import com.amplitude.reactnative.AmplitudeReactNativePackage;',
					sourceDir: '../node_modules/@amplitude/analytics-react-native/android',
				},
			},
		},
	},
};
