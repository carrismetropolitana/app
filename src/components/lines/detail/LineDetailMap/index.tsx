/* * */

import { LineMapView } from '@/components/map/view/LineMapView';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { ActivityIndicator, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineDetailMap() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const lineDetailContext = useLineDetailContext();

	//
	// B. Render components

	if (lineDetailContext.flags.loading) {
		return (
			<View style={[styles.container, styles.loading]}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<LineMapView isExpandable={true} />
		</View>
	);

	//
}
