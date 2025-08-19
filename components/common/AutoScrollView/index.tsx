import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

export interface AutoScrollViewRef {
	scrollToTop: () => void
}

const AutoScrollView = forwardRef<AutoScrollViewRef, ScrollViewProps>(
	({ children, contentContainerStyle, ...props }, ref) => {
		const scrollRef = useRef<ScrollView>(null);

		// expõe métodos para quem usar este component
		useImperativeHandle(ref, () => ({
			scrollToTop: () => {
				scrollRef.current?.scrollTo({ animated: true, y: 0 });
			},
		}));

		return (
			<ScrollView
				ref={scrollRef}
				keyboardShouldPersistTaps="handled"
				style={{ flex: 1 }}
				contentContainerStyle={[
					{ flexGrow: 1, padding: 16 }, // padding base
					contentContainerStyle,
				]}
				{...props}
			>
				{children}
			</ScrollView>
		);
	},
);

AutoScrollView.displayName = 'AutoScrollView';

export default AutoScrollView;
