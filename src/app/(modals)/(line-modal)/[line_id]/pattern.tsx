/* * */

import { PatternSelection } from '@/components/selection/pattern/PatternSelection';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { type RoutePath, router, useLocalSearchParams } from 'expo-router';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();
	const operationalDateContext = useOperationalDateContext();
	const localSearchParams = useLocalSearchParams<{ line_id: string, operational_date: string, pattern_id: string, return_to: RoutePath }>();

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
				selectedOperationalDate={operationalDateContext.data.selected_date}
				selectedPatternId={lineDetailContext.data.selected_pattern_id ?? localSearchParams.pattern_id}
		/>
	);

	//
}
