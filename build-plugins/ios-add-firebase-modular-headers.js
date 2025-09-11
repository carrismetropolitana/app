/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/* * */

module.exports = function withFirebaseModularHeaders(config) {
	return withDangerousMod(config, [
		'ios',
		async (config) => {
			const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
			let contents = fs.readFileSync(podfilePath, 'utf-8');

			// Insert pods before the `install! ` line
			const pods = `
pod 'Firebase', :modular_headers => true
pod 'FirebaseCoreInternal', :modular_headers => true
pod 'GoogleUtilities', :modular_headers => true
pod 'FirebaseCore', :modular_headers => true
`;

			if (!contents.includes('FirebaseCoreInternal')) {
				contents = contents.replace(
					/install! /,
					pods + '\ninstall! ',
				);
				fs.writeFileSync(podfilePath, contents);
			}

			return config;
		},
	]);
};
