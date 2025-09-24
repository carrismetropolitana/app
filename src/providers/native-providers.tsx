/* * */

import { type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */

export function NativeProviders({ children }: PropsWithChildren) {
	return (
		<GestureHandlerRootView>
			<SafeAreaProvider>
				{children}
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
