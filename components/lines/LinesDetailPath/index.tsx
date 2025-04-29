/* * */

import { LinesDetailPathMap } from '@/components/lines/LinesDetailPathMap';
import { View } from 'react-native';
// import { LinesDetailPathList } from '@/components/lines/LinesDetailPathList';
// import { LinesDetailPathMap } from '@/components/lines/LinesDetailPathMap';
import { NoDatabLabel } from '@/components/common/layout/NoDataLabel';
import { Surface } from '@/components/common/layout/Surface';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
// import { useTranslations } from 'next-intl';

// import styles from './styles.module.css';

/* * */

export function LinesDetailPath() {
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
				<NoDatabLabel text="Sem dados" withMinHeight />
			</Surface>
		);
	}

	return (
		<View style={{ height: 200, marginTop: 20 }}>
			<LinesDetailPathMap />
		</View>
	// </div>
	// <div className={styles.container}>
	//  <LinesDetailPathList />
	// <div className={styles.mapWrapper}>
	//    </div>
	//   </div>

	);

	//
}
