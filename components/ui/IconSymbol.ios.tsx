import type { StyleProp, ViewStyle } from 'react-native';

import {
	SymbolView,
	type SymbolViewProps,
	type SymbolWeight,
} from 'expo-symbols';

export function IconSymbol({
	color,
	name,
	size = 24,
	style,
	weight = 'regular',
}: {
	color: string
	name: SymbolViewProps['name']
	size?: number
	style?: StyleProp<ViewStyle>
	weight?: SymbolWeight
}) {
	return (
		<SymbolView
			name={name}
			resizeMode="scaleAspectFit"
			tintColor={color}
			weight={weight}
			style={[
				{
					height: size,
					width: size,
				},
				style,
			]}
		/>
	);
}
