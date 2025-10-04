/* * */

import { SelectPattern } from '@/components/common/SelectPattern';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useMemo } from 'react';

/* * */

export function SelectActivePatternGroup() {
	//

	//
	// A. Setup variables
	const lineDetailContext = useLineDetailContext();

	//
	// B. Transform data

	const validPatternGroupsSelectOptions = useMemo(() => {
		if (!lineDetailContext.data.valid_patterns) return [];
		return lineDetailContext.data.valid_patterns;
	}, [lineDetailContext.data.valid_patterns]);

	//
	// C. Render components

	if (!validPatternGroupsSelectOptions) {
		return null;
	}

	return (
		<SelectPattern />
	);

	//
}
