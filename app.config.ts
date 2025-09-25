/* * */

import { type ExpoConfig } from 'expo/config';

/* * */

const config: ExpoConfig = {

	name: 'Carris Metropolitana',

	owner: 'carrismetropolitana',

	scheme: 'carrismetropolitana',

	slug: 'app',

	/* * */

	icon: './assets/app/icon-light.png',

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
			foregroundImage: './assets/app/icon-light.png',
		},
		googleServicesFile: './environments/production/secrets/google-services.json',
		package: 'pt.carrismetropolitana.mobile',
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

		},
	},

	/* * */

	plugins: [

		'@maplibre/maplibre-react-native',

		'expo-router',

		'expo-localization',

		'expo-audio',

		/**
		 * Configures location permissions for the app.
		 * @see https://docs.expo.dev/versions/latest/sdk/location/#configurable-properties
		 */
		['expo-location', {
			locationWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
		}],

		/**
		 * Configures push notifications for the app.
		 * @see https://docs.expo.dev/versions/latest/sdk/notifications/#app-config
		 */
		['expo-notifications', {
			color: '#FFDD00',
			enableBackgroundRemoteNotifications: true,
			icon: './assets/app/icon-notification.png',
		}],

		/**
		 * Configures the splash screen for the app.
		 * @see https://docs.expo.dev/versions/latest/sdk/splash-screen/#configurable-properties
		 */
		['expo-splash-screen', {
			backgroundColor: '#FFDD00',
			dark: {
				backgroundColor: '#1e1e28',
				image: './assets/app/splash-dark.png',
			},
			image: './assets/app/splash-light.png',
			imageWidth: '100%',
			resizeMode: 'cover',
		}],

		/**
		 * Configures the app to use custom fonts.
		 * @see https://docs.expo.dev/versions/latest/sdk/font/#configurable-properties
		 */
		['expo-font', {
			fonts: [
				'./assets/fonts/inter-variable.ttf',
				'./assets/fonts/space-mono-regular.ttf',
			],
		}],

	],

};

/* * */

export default config;
