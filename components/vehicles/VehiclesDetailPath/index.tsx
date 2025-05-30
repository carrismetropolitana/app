/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { View } from 'react-native';

import { VehiclesDetailPathMap } from '../VechilesDetailPathMap';
import { VehiclesDetailPathList } from '../VehiclesDetailPathList';

/* * */

export function VehiclesDetailPath() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('lines.LinesDetailPath');

	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDayContext();

	//
	// B. Render components

	if (!linesDetailContext.data.active_pattern || !operationalDayContext.data.selected_day_jsdate) {
		return (
			<Surface>
				<NoDataLabel text="Sem dados" withMinHeight />
			</Surface>
		);
	}

	return (
		<View style={{ marginTop: 20 }}>
			<VehiclesDetailPathMap />
			<VehiclesDetailPathList />
		</View>

	);

	//
}
