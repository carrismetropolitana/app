/* * */

import { PatternSelectionTrigger } from '@/components/selection/pattern/PatternSelectionTrigger';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';

/* * */

export function LineDetailSelectPattern() {
	//

	//
	// A. Setup variables

	const operationalDateContext = useOperationalDateContext();
	const lineDetailContext = useLineDetailContext();

	//
	// B. Render components

	return (
		<PatternSelectionTrigger
			description="Selecione um padrão"
			onSelect={() => console.log('Pattern selected')}
			selectedLineId={lineDetailContext.data.selected_line_id}
			selectedOperationalDate={operationalDateContext.data.selected_date?.operational_date}
			selectedPatternId={undefined}
			title="Selecione um destino"
		/>
	);

	//
}
