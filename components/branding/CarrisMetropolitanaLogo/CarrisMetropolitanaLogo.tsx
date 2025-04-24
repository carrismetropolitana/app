import { useColorScheme } from 'react-native';

import { CarrisMetropolitanaLogoDark } from './variants/CarrisMetropolitanaLogoDark';
import { CarrisMetropolitanaLogoLight } from './variants/CarrisMetropolitanaLogoLight';

export const CarrisMetropolitanaLogo = ({
	theme,
}: { theme?: 'dark' | 'light' }) => {
	return (theme || useColorScheme()) === 'dark' ? (
		<CarrisMetropolitanaLogoDark />
	) : (
		<CarrisMetropolitanaLogoLight />
	);
};
