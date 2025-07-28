/* * */

import { useLinesListContext } from '@/contexts/LinesList.context';
import { Input } from '@rn-vui/themed';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Counter from '../Counter';

/* * */

export default function LineSearchBar() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'common.LineSearchBar' });
	const linesListContext = useLinesListContext();
	const allLines = linesListContext.data.filtered;
	const [lineSearch, setLineSearch] = useState<string>('');

	const filteredLines = useMemo(() => {
		return allLines.filter(line =>
			line.long_name.toLowerCase().includes(lineSearch.toLowerCase())
			|| String(line.id).includes(lineSearch),
		);
	}, [allLines, lineSearch]);

	//
	// B. Render components

	return (
		<View style={{ padding: 20 }}>
			<Input
				clearButtonMode="while-editing"
				placeholder={t('placeholder')}
				value={lineSearch}
				onChangeText={(text) => {
					setLineSearch(text);
					if (linesListContext && linesListContext.actions && typeof linesListContext.actions.updateFilterBySearch === 'function') {
						linesListContext.actions.updateFilterBySearch(text);
					}
				}}
			/>
			<Counter quantity={filteredLines.length} text="Encontradas" type="linhas" />
		</View>
	);

	//
}
