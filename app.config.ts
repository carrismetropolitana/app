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

		googleServicesFile: './environments/production/secrets/google-services.json',

		package: 'pt.carrismetropolitana.mobile',

	},

	ios: {

		appleTeamId: 'QGATT2W97P',

		bundleIdentifier: 'pt.carrismetropolitana.app',

		/**
		 * There is a known issue with Expo not properly setting the app icon for iOS when using
		 * a dark mode icon. As a workaround, we set the icon to the light mode icon.
		 * This might be due to Expo expecting a Icon-composer-built icon set.
		 * @see https://github.com/expo/expo/issues/39782
		 */
		// icon: {
		// 	dark: './assets/app/icon-dark.png',
		// 	light: './assets/app/icon-light.png',
		// },

		infoPlist: {

			/**
			 * Indicates whether the app uses encryption that is not exempt from U.S. export compliance.
			 * This key is required for all apps submitted to the App Store.
			 * @see https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption
			 */
			ITSAppUsesNonExemptEncryption: false,

		},

		/**
		 * This property must be true as the previous versions supported iPads.
		 * Apple does not allow changing this property back to false once the app is published.
		 * @see https://stackoverflow.com/a/35747810
		 */
		supportsTablet: true,

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
			backgroundColor: '#ffffff',
			dark: {
				backgroundColor: '#282832',
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
