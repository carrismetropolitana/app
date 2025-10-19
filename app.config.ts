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

		/**
		 * The package name is a unique identifier for your app on the Google Play Store.
		 * Based on the environment, we set different package names for production/staging and development.
		 * This allows us to have multiple versions of the app installed on the same device for testing purposes.
		 * @see https://developer.android.com/studio/build/application-id
		 */
		package: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' || process.env.EXPO_PUBLIC_ENVIRONMENT === 'staging'
			? 'pt.carrismetropolitana.mobile'
			: 'pt.carrismetropolitana.mobile.dev',

		/**
		 * The version code is an integer value that represents the version of the application code.
		 * The maximum value is the MAX_INT=2147483647, which is greater than the usual format of our versioning scheme.
		 * This means that a simpler integer should be used for versioning. Keep only the initial digits of the version,
		 * e.g. for version 20250101.1023.34 use versionCode 2025010110 (date + hour).
		 * @see https://stackoverflow.com/a/24246191
		 * @see https://developer.android.com/studio/publish/versioning
		 */
		versionCode: Number(process.env.EXPO_PUBLIC_APP_ANDROID_VERSION_CODE || 1),

	},

	ios: {

		appleTeamId: 'QGATT2W97P',

		buildNumber: `${process.env.EXPO_PUBLIC_APP_IOS_BUILD_NUMBER || 1}`,

		/**
		 * The bundle identifier is a unique identifier for your app in the Apple ecosystem.
		 * Based on the environment, we set different bundle identifiers for production/staging and development.
		 * This allows us to have multiple versions of the app installed on the same device for testing purposes.
		 * @see https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier
		 */
		bundleIdentifier: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' || process.env.EXPO_PUBLIC_ENVIRONMENT === 'staging'
			? 'pt.carrismetropolitana.app'
			: 'pt.carrismetropolitana.app.dev',

		/**
		 * There is a known issue with Expo not properly setting the app icon for iOS when using
		 * a dark mode icon. As a workaround, we set the icon to the light mode icon.
		 * This might be due to Expo expecting a Icon-composer-built icon set.
		 * @see https://github.com/expo/expo/issues/39782
		 */
		icon: './assets/app/ios-icon.icon',

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
			locationWhenInUsePermission: 'Utilizamos a sua localização apenas para mostrar as linhas e paragens mais próximas de si.',
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
