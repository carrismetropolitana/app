/* * */

import { AccessibilityContextProvider } from '@/contexts/Accessibility.context';
import { LocaleContextProvider } from '@/contexts/Locale.context';
import { type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* * */

export function NativeProviders({ children }: PropsWithChildren) {
	return (
		<LocaleContextProvider>
			<AccessibilityContextProvider>
				<GestureHandlerRootView>
					<SafeAreaProvider>
						{children}
					</SafeAreaProvider>
				</GestureHandlerRootView>
			</AccessibilityContextProvider>
		</LocaleContextProvider>
	);
}
