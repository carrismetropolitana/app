import { CMColors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

type ColorKeys = keyof typeof CMColors.dark & keyof typeof CMColors.light;

export default function useThemedCMColor(color: ColorKeys) {
	const theme = useColorScheme();

	if (theme === 'dark') {
		return CMColors.dark[color];
	}

	return CMColors.light[color];
}
