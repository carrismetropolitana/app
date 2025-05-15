/* * */

import React from 'react';
import { View, ViewStyle } from 'react-native';

import { surfaceStyles } from './styles';

/* * */

interface Props {
	children?: React.ReactNode
	forceOverflow?: boolean
	fullHeight?: boolean
	style?: ViewStyle
	variant?: 'alerts' | 'brand2' | 'brand' | 'debug' | 'default' | 'muted' | 'persistent' | 'standout' | 'success' | 'warning'
}

/* * */

export function Surface({ children, forceOverflow, fullHeight, style, variant }: Props) {
	//

	//
	// A. Setup variables

	const containerStyles = [
		variant === 'default' && surfaceStyles.containerDefault,
		variant === 'alerts' && surfaceStyles.containerAlerts,
		variant === 'brand' && surfaceStyles.containerBrand,
		variant === 'brand2' && surfaceStyles.containerBrand2,
		variant === 'debug' && surfaceStyles.containerDebug,
		variant === 'muted' && surfaceStyles.containerMuted,
		variant === 'persistent' && surfaceStyles.containerPersistent,
		variant === 'standout' && surfaceStyles.containerStandOut,
		variant === 'success' && surfaceStyles.containerSuccess,
		variant === 'warning' && surfaceStyles.containerWarning,
		forceOverflow && surfaceStyles.forceOverflow,
		fullHeight && surfaceStyles.fullHeight,
	];

	//
	// B. Render Components

	return (
		<View style={[containerStyles, style && style]}>
			{children}
		</View>
	);

	//
}
