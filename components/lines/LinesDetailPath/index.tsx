/* * */

import { LinesDetailPathMap } from '@/components/lines/LinesDetailPathMap';
import { View } from 'react-native';

// import { NoDataLabel } from '@/components/layout/NoDataLabel';
// import { Section } from '@/components/layout/Section';
// import { Surface } from '@/components/layout/Surface';
// import { LinesDetailPathList } from '@/components/lines/LinesDetailPathList';
// import { LinesDetailPathMap } from '@/components/lines/LinesDetailPathMap';
// import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
// import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
// import { useStickyObserver } from '@/hooks/useStickyObserver';
// import { getCssVariableValue } from '@/utils/getCssVariableValue';
// import { useTranslations } from 'next-intl';

// import styles from './styles.module.css';

/* * */

export function LinesDetailPath() {
	//

	//
	// A. Setup variables

	// const t = useTranslations('lines.LinesDetailPath');

	// const linesDetailContext = useLinesDetailContext();
	// const operationalDayContext = useOperationalDayContext();
	// const headerHeight = getCssVariableValue('--size-height-header');
	// const { isSticky, ref: stickyElementRef } = useStickyObserver({ top: headerHeight }, [1], { top: -1 });

	//
	// B. Render components

	// if (!linesDetailContext.data.active_pattern || !operationalDayContext.data.selected_day_jsdate) {
	// 	return (
	// 		<Surface>
	// 			<NoDataLabel text={t('no_data')} withMinHeight />
	// 		</Surface>
	// 	);
	// }

	return (
		<View style={{ height: 200, marginTop: 20 }}>
			<LinesDetailPathMap />
		</View>
	// <div ref={stickyElementRef} className={`${styles.containerSummary} ${isSticky ? styles.isSticky : ''}`}>
	// 	{isSticky && (
	// 		<>
	// 			<p className={styles.linesSummaryWrapper}>
	// 				{t.rich('summary', {
	// 					changeDay: chunks => <a className={styles.changeDay} href="#">{chunks}</a>,
	// 					day_name: operationalDayContext.data.selected_day_jsdate,
	// 					dayName: chunks => <span className={styles.dayName}>{chunks}</span>,
	// 					destination_name: linesDetailContext.data.active_pattern?.headsign,
	// 					destinationName: chunks => <span className={styles.destinationName}>{chunks}</span>,
	// 					line_number: linesDetailContext.data.active_pattern?.line_id,
	// 					lineNumber: chunks => <span className={styles.lineNumber}>{chunks}</span>,
	// 				})}
	// 			</p>
	// 		</>
	// 	)}
	// </div>
	// <div className={styles.container}>
	//  <LinesDetailPathList />
	// <div className={styles.mapWrapper}>
	//    </div>
	//   </div>

	);

	//
}
