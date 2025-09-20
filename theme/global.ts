/* * */

import { useColorScheme } from 'react-native';

/* * */

export const useSystemVariables = () => {
	//

	const colorScheme = useColorScheme();

	return {
		//

		background: {
			100: colorScheme === 'light' ? '#FFFFFF' : '#282832',
			200: colorScheme === 'light' ? '#F5F5F5' : '#1E1E28',
			300: colorScheme === 'light' ? '#F0F0F0' : '#0A0A14',
		},

		border: {
			100: colorScheme === 'light' ? '#E6E6F0' : '#3C3C41',
			200: colorScheme === 'light' ? '#BEBEC8' : '#505055',
		},

		brand: {
			cm: '#FFDD00',
		},

		text: {
			100: colorScheme === 'light' ? '#000000' : '#FFFFFF',
			200: colorScheme === 'light' ? '#5A5A64' : '#C8C8D2',
			300: colorScheme === 'light' ? '#9696A0' : '#8C8C96',
			400: colorScheme === 'light' ? '#D2D2DC' : '#64646E',
		},

	//
	};

	//
};
