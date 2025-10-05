/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { View } from 'react-native';

import { VehiclesDetailPathMap } from '../VechilesDetailPathMap';
import { VehiclesDetailPathList } from '../VehiclesDetailPathList';

/* * */

export function VehiclesDetailPath() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('lines.LineDetailPath');

	const lineDetailContext = useLineDetailContext();
	const operationalDateContext = useOperationalDateContext();

	//
	// B. Render components

	if (!lineDetailContext.data.active_pattern || !operationalDateContext.data.selected_date?.js_date) {
		return (
			<Surface>
				<NoDataLabel text="Sem dados" />
			</Surface>
		);
	}

	return (
		<View>
			<VehiclesDetailPathMap hasToolbar={false} />
			<VehiclesDetailPathList />
		</View>

	);

	//
}
