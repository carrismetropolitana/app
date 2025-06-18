/* * */

import { useLinesListContext } from '@/contexts/LinesList.context';
import { Input } from '@rn-vui/themed';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import Counter from '../Counter';

/* * */

export default function LineSearchBar() {
	const linesListContext = useLinesListContext();
	const allLines = linesListContext.data.filtered;
	const [lineSearch, setLineSearch] = useState<string>('');

	const filteredLines = useMemo(() => {
		return allLines.filter(line =>
			line.long_name.toLowerCase().includes(lineSearch.toLowerCase())
			|| String(line.id).includes(lineSearch),
		);
	}, [allLines, lineSearch]);

	return (
		<View>
			<Input
				clearButtonMode="while-editing"
				placeholder="Pesquisar por número ou nome"
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
}
