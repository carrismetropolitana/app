/* * */

import { SelectPattern } from '@/components/common/SelectPattern';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export function SelectActivePatternGroup() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translations', { keyPrefix: 'lines.SelectActivePatternGroup' });
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Transform data

	const validPatternGroupsSelectOptions = useMemo(() => {
		if (!linesDetailContext.data.valid_patterns) return [];
		return linesDetailContext.data.valid_patterns;
	}, [linesDetailContext.data.valid_patterns]);

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
