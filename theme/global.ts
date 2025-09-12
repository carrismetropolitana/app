/* * */

import { useColorScheme } from 'react-native';

/* * */

export const useSystemVariables = () => {
	return {
		//

		background: {
			100: useColorScheme() === 'light' ? '#FFFFFF' : '#282832',
			200: useColorScheme() === 'light' ? '#F5F5F5' : '#1E1E28',
			300: useColorScheme() === 'light' ? '#F0F0F0' : '#0A0A14',
		},

		border: {
			100: useColorScheme() === 'light' ? '#E6E6F0' : '#3C3C41',
			200: useColorScheme() === 'light' ? '#BEBEC8' : '#505055',
		},

		text: {
			100: useColorScheme() === 'light' ? '#000000' : '#FFFFFF',
			200: useColorScheme() === 'light' ? '#5A5A64' : '#C8C8D2',
			300: useColorScheme() === 'light' ? '#9696A0' : '#8C8C96',
			400: useColorScheme() === 'light' ? '#D2D2DC' : '#64646E',
		},

	//
	};
};
