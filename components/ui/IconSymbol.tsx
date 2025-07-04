// This file is a fallback for using MaterialIcons on Android and web.

import type { SymbolWeight } from 'expo-symbols';
import type React from 'react';
import type { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
	// See MaterialIcons here: https://icons.expo.fyi
	// See SF Symbols in the SF Symbols app on Mac.
	'chevron.left.forwardslash.chevron.right': 'code',
	'chevron.right': 'chevron-right',
	'house.fill': 'home',
	'paperplane.fill': 'send',
} as Partial<
	Record<
		import('expo-symbols').SymbolViewProps['name'],
		React.ComponentProps<typeof MaterialIcons>['name']
	>
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
	color,
	name,
	size = 24,
	style,
}: {
	color: OpaqueColorValue | string
	name: IconSymbolName
	size?: number
	style?: StyleProp<TextStyle>
	weight?: SymbolWeight
}) {
	return (
		<MaterialIcons
			color={color}
			name={MAPPING[name]}
			size={size}
			style={style}
		/>
	);
}
