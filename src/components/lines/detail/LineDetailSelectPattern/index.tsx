/* * */

import { PatternSelectionTrigger } from '@/components/selection/pattern/PatternSelectionTrigger';

/* * */

export function LineDetailSelectPattern() {
	//

	//
	// A. Setup variables

	//
	// B. Render components

	return (
		<PatternSelectionTrigger
			description="Selecione um padrão"
			onSelect={() => console.log('Pattern selected')}
			selectedPatternId={undefined}
			title="Selecione um destino"
		/>
	);

	//
}
