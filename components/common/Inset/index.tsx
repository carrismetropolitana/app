/* * */

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* * */

export const Inset = ({ edge }: { edge: 'bottom' | 'top' }) => {
	//

	// A. Setup variables

	const insets = useSafeAreaInsets();

	//
	// B. Render components

	return <View style={{ height: insets[edge] }} />;

	//
};
