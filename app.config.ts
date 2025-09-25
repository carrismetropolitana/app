/* * */

import { type ExpoConfig } from 'expo/config';

/* * */

const config: ExpoConfig = {

	name: 'Carris Metropolitana',

	owner: 'carrismetropolitana',

	scheme: 'carrismetropolitana',

	slug: 'app',

	/* * */

	icon: './assets/images/Logos/CM_Logo _Symbol_LightMode.png',

	orientation: 'portrait',

	userInterfaceStyle: 'automatic',

	/* * */

	experiments: {
		reactCanary: true,
		typedRoutes: true,
	},

	/* * */

	runtimeVersion: {
		policy: 'appVersion',
	},

	updates: {
		url: 'https://carrismetropolitana.pt/app/updates',
	},

	/* * */

	extra: {
		eas: {
			projectId: 'aa327210-947a-4d53-bb3f-2c09c2f6cde5',
		},
	},

	/* * */

	android: {
		adaptiveIcon: {
			backgroundColor: '#ffffff',
			foregroundImage: './assets/images/Logos/CM_Logo _Symbol_LightMode.png',
		},
		googleServicesFile: './environments/production/secrets/google-services.json',
		package: 'pt.carrismetropolitana.mobile',
		permissions: [
			'android.permission.ACCESS_COARSE_LOCATION',
			'android.permission.ACCESS_FINE_LOCATION',
		],
	},

	ios: {
		appleTeamId: 'QGATT2W97P',
		bundleIdentifier: 'pt.carrismetropolitana.app',
		infoPlist: {

			/**
			 * Indicates whether the app uses encryption that is not exempt from U.S. export compliance.
			 * This key is required for all apps submitted to the App Store.
			 * @see https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption
			 */
			ITSAppUsesNonExemptEncryption: false,

			/**
			 * A description of the reason the app accesses the user's location data.
			 * This key is required if the app uses location services.
			 * @see https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationwheninuseusagedescription
			 */
			NSLocationWhenInUseUsageDescription: 'This app uses your location to show nearby stops and routes.',

			/**
			 * List of background mode entitlements the app requires.
			 * @see https://developer.apple.com/documentation/bundleresources/information-property-list/uibackgroundmodes
			 */
			UIBackgroundModes: ['remote-notification'],

		},
	},

	/* * */

	plugins: [

		'@maplibre/maplibre-react-native',

		'expo-router',

		'expo-location',

		'expo-localization',

		'expo-audio',

		['expo-notifications', {
			enableBackgroundRemoteNotifications: true,
		}],

		['expo-splash-screen', {
			backgroundColor: '#ffffff',
			dark: {
				backgroundColor: '#1e1e28',
				image: './assets/images/Logos/CM_Logo_DarkMode.png',
			},
			image: './assets/images/Logos/CM_Logo_LightMode.png',
			imageWidth: 200,
			resizeMode: 'contain',
		}],

		['expo-font', {
			fonts: [
				'./assets/clean/fonts/inter-variable.ttf',
				'./assets/clean/fonts/space-mono-regular.ttf',
			],
		}],

		['expo-asset', {
			assets: [
				'./assets/clean',
			],
		}],

	],

};

/* * */

export default config;
