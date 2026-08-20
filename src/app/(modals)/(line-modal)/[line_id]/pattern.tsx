/* * */

import { PatternSelection } from '@/components/selection/pattern/PatternSelection';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { type OperationalDate } from '@tmlmobilidade/types';
import { type RoutePath, router, useLocalSearchParams } from 'expo-router';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();
	const localSearchParams = useLocalSearchParams<{ line_id: string, operational_date: OperationalDate, pattern_id: string, return_to: RoutePath }>();

	//
	// B. Handle actions

	const handleSelect = (patternId: string) => {
		lineDetailContext.actions.selectPatternId(patternId);
		router.back();
	};
	//
	// C. Render components

	return (
		<PatternSelection
			onSelect={handleSelect}
			selectedLineId={localSearchParams.line_id}
			selectedOperationalDate={localSearchParams.operational_date}
			selectedPatternId={localSearchParams.pattern_id}
		/>
	);

	//
}
