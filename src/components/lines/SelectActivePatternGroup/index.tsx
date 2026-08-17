/* * */

import { PatternSelection } from '@/components/selection/pattern/PatternSelection';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { useMemo } from 'react';

/* * */

export function SelectActivePatternGroup() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();
	const operationalDateContext = useOperationalDateContext();

	//
	// B. Transform data

	const validPatternGroupsSelectOptions = useMemo(() => {
		if (!lineDetailContext.data.available_patterns) return [];
		return lineDetailContext.data.available_patterns;
	}, [lineDetailContext.data.available_patterns]);

	//
	// C. Render components

	if (!validPatternGroupsSelectOptions) {
		return null;
	}

	return (
		<PatternSelection 
			onSelect={lineDetailContext.actions.selectPatternId}
			selectedLineId={lineDetailContext.data.selected_line_id?.toString()}
			selectedOperationalDate={operationalDateContext.data.selected_date?.jsDate}
			selectedPatternId={lineDetailContext.data.selected_pattern_id?.toString()}
		/>
	);

	//
}
