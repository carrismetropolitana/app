/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { ListTitle } from '@/components/list/ListTitle';
import { usePatternSelectionContext } from '@/components/selection/pattern/context/PatternSelection.context';
import { type PatternSelectionProps } from '@/components/selection/pattern/PatternSelection';
import { PatternSelectionMainListItem } from '@/components/selection/pattern/PatternSelectionMainListItem';
import { useLinesContext } from '@/contexts/Lines.context';
import { type Pattern } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { SectionList, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function PatternSelectionMainList({ onSelect, replaceChevron }: PatternSelectionProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const linesContext = useLinesContext();
	const patternSelectionContext = usePatternSelectionContext();

	//
	// B. Transform data

	const listSections = useMemo(() => {
		// Separate available patterns into different sections
		// based on their given route_id
		const sectionsByRouteId: Record<string, Pattern[]> = {};
		patternSelectionContext.data.available.forEach((pattern) => {
			if (!sectionsByRouteId[pattern.route_id]) {
				sectionsByRouteId[pattern.route_id] = [];
			}
			sectionsByRouteId[pattern.route_id].push(pattern);
		});
		// Setup a final variable to add the sections
		return Object
			.entries(sectionsByRouteId)
			.filter(([routeId, patterns]) => routeId && patterns.length > 0)
			.sort(([routeIdA], [routeIdB]) => routeIdA.localeCompare(routeIdB))
			.map(([routeId, patterns]) => {
				const routeData = linesContext.actions.getRouteDataById(routeId);
				return {
					data: patterns.sort((a, b) => a.id.localeCompare(b.id)),
					key: routeId,
					title: routeData ? routeData.long_name : routeId,
				};
			});
	}, [
		patternSelectionContext.data.available,
		linesContext.data.routes,
	]);

	//
	// C. Render components

	const renderSectionItem = ({ item }: { item: Pattern }) => {
		return (
			<PatternSelectionMainListItem
				key={item.id}
				item={item}
				onSelect={onSelect}
				replaceChevron={replaceChevron}
			/>
		);
	};

	return (
		<SectionList
			contentContainerStyle={styles.contentContainer}
			initialNumToRender={30}
			ItemSeparatorComponent={() => <View style={styles.border} />}
			ListEmptyComponent={<NoDataLabel />}
			maxToRenderPerBatch={30}
			renderItem={renderSectionItem}
			renderSectionHeader={info => <ListTitle title={info.section.title} />}
			sections={listSections}
			SectionSeparatorComponent={() => <View style={styles.border} />}
			stickySectionHeadersEnabled={false}
			windowSize={30}
		/>
	);

	//
}
