/* * */

import { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface ContainerProps {
	safeBottom?: boolean
	safeTop?: boolean
}

/* * */

export function Container({ children, safeBottom = true, safeTop }: PropsWithChildren<ContainerProps>) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<KeyboardAvoidingView behavior="position">
			<ScrollView style={styles.scrollView}>
				<View style={[
					styles.container,
					safeTop && styles.safeTop,
					safeBottom && styles.safeBottom,
				]}
				>
					{children}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);

	//
}
