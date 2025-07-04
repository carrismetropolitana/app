import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeContext } from '@/contexts/Theme.context';
import { Text } from '@rn-vui/themed';
import { type PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function Collapsible({
	children,
	title,
}: PropsWithChildren & { title: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useThemeContext();

	return (
		<View>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => setIsOpen(value => !value)}
				style={styles.heading}
			>
				<IconSymbol
					color={theme.theme.mode === 'light' ? theme.theme.lightColors?.primary ?? '#000' : theme.theme.darkColors?.primary ?? '#000'}
					name="chevron.right"
					size={18}
					style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
					weight="medium"
				/>

				<Text>{title}</Text>
			</TouchableOpacity>
			{isOpen && <View style={styles.content}>{children}</View>}
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		marginLeft: 24,
		marginTop: 6,
	},
	heading: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: 6,
	},
});
