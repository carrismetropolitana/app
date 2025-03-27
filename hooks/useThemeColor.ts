/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/theme/Variables';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
	props: { dark?: string, light?: string },
	colorName: keyof typeof Colors.dark & keyof typeof Colors.light,
) {
	const theme = useColorScheme() ?? 'light';
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	}

	return Colors[theme][colorName];
}
