import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Inset = ({ edge }: { edge: 'bottom' | 'top' }) => {
	const insets = useSafeAreaInsets();
	return <View style={{ height: insets[edge] }} />;
};
