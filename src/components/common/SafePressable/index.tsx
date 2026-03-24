import { useCallback, useEffect, useRef } from 'react';
import { Pressable, type PressableProps } from 'react-native';

interface SafePressableProps extends Omit<PressableProps, 'onPress' | 'style'> {
	cooldownMs?: number
	onPress?: PressableProps['onPress']
	pressedOpacity?: number
	preventMultiPress?: boolean
	style?: PressableProps['style']
}

export function SafePressable({
	children,
	cooldownMs = 800,
	disabled = false,
	onPress,
	pressedOpacity = 0.5,
	preventMultiPress = true,
	style,
	...rest
}: SafePressableProps) {
	const isLockedRef = useRef(false);
	const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

	const handlePress = useCallback((event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
		if (disabled) return;
		if (preventMultiPress && isLockedRef.current) return;

		if (preventMultiPress) {
			isLockedRef.current = true;

			if (timeoutRef.current) clearTimeout(timeoutRef.current);

			timeoutRef.current = setTimeout(() => {
				isLockedRef.current = false;
				timeoutRef.current = null;
			}, cooldownMs);
		}

		onPress?.(event);
	}, [cooldownMs, disabled, onPress, preventMultiPress]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<Pressable
			{...rest}
			disabled={disabled}
			onPress={handlePress}
			style={(state) => {
				const baseStyle =
					typeof style === 'function' ? style(state) : style;

				return [
					baseStyle,
					state.pressed && { opacity: pressedOpacity },
				];
			}}
		>
			{children}
		</Pressable>
	);
}
