/* * */

import { View } from 'react-native';

import styles from './style.module.css';

/* * */

interface Props {
	className?: string
	color?: string
}

/* * */

export function LiveIcon({ className, color = 'var(--color-realtime-100)' }: Props) {
	//

	//
	// A.Render components

	return (
		<View className={`${styles.container} ${!!className && className}`}>
			<View className={styles.ripple} style={{ backgroundColor: color }} />
			<View className={styles.dot} style={{ backgroundColor: color }} />
		</View>
	);

	//
}
