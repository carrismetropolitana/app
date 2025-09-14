/* * */

import { type PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function Container({ children }: PropsWithChildren) {
	return (
		<SafeAreaView style={useStyles().safeArea}>
			<ScrollView>
				<View style={useStyles().container}>
					{children}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
