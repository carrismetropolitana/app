/* * */

import { SelectOperationalDate } from '@/components/common/SelectOperationalDate';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineDetailSelectOperationalDate() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<SelectOperationalDate />
		</View>
	);

	//
}
