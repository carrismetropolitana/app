/* * */

import { IconArrowNarrowRight } from '@tabler/icons-react-native';
import { Link } from 'expo-router';
import { StyleProp, TextStyle, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	children?: React.ReactNode
	href: string
	icon?: React.ReactNode
	onClick?: () => void
	style?: StyleProp<TextStyle>
}
/* * */

export function RegularListItem({ children, href, icon, style }: Props) {
	//

	//
	// A. Setup variables

	const regularListItemStyles: StyleProp<TextStyle> = [
		href === '#' ? styles.disableLink : undefined,
		style,
	];

	//
	// B. Render components

	return (
		<Link href={href} style={[styles.container, regularListItemStyles] as StyleProp<TextStyle>}>
			{icon && (
				<View style={styles.iconWrapper}>
					{icon}
				</View>
			)}
			{children && (
				<View style={styles.childrenWrapper}>
					{children}
				</View>
			)}
			{href !== '#' && (
				<View style={styles.arrowWrapper}>
					<IconArrowNarrowRight size={20} />
				</View>
			)}
		</Link>
	);

	//
}
