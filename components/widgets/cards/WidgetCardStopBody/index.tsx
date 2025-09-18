/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { type WidgetStop } from '@/schemas/widgets';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardStopBodyProps {
	data: WidgetStop
}

/* * */

export function WidgetCardStopBody({ data }: WidgetCardStopBodyProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<Text>WidgetCardStopBody</Text>
		</View>
	);

	//
}
