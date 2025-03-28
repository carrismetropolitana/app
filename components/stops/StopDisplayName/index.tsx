/* * */

import { Text } from '@rneui/themed';

// import styles from './styles.module.css';

/* * */

interface Props {
	longName?: string
	size?: 'lg' | 'md'
}

/* * */

export function StopDisplayName({ longName, size = 'md' }: Props) {
	return longName && (
		// className={`${styles.name} ${styles[size]}`}
		<Text>
			{longName}
		</Text>
	);
}
