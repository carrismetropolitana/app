/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { type WidgetLine } from '@/schemas/widgets';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardLineBodyProps {
	data: WidgetLine
}

/* * */

export function WidgetCardLineBody({ data }: WidgetCardLineBodyProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<Text>WidgetCardLineBody</Text>
		</View>
	);

	//
}
