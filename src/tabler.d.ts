/**
 * This is a temporary workaround to provide type definitions
 * for the '@tabler/icons-react-native' package.
 * See https://github.com/tabler/tabler-icons/pull/1401
 */

declare module '@tabler/icons-react-native' {
	import * as TablerIcons from 'node_modules/@tabler/icons-react-native/dist/tabler-icons-react-native';
	export = TablerIcons;
}
