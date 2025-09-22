/* * */

import { type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TabBarButtonProps {
	focused: boolean
}

/* * */

export function TabBarButton({ children, focused }: PropsWithChildren<TabBarButtonProps>) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={[styles.container, focused && styles.containerIsFocused]}>
			{children}
		</View>
	);

	//
}
