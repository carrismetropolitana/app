// src/screens/LinesScreen.tsx
import React, { useCallback } from 'react';
import { SafeAreaView, SectionList, StyleSheet } from 'react-native';
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { MemoizedLineItem } from '@/components/common/LineItem';
import { router } from 'expo-router';

export default function LinesScreen(): JSX.Element {
	const { data: { lines: allLines } } = useLinesContext();
	const { data: { linesAroundLocation: nearbyLines } } = useLinesListContext();
	const { data: { locationPermission } } = useLocationsContext();
	const { theme } = useThemeContext();

	const sections = [
		{
			title: 'A minha volta',
			data: locationPermission === 'granted' ? nearbyLines : [],
		},
		{
			title: 'Todas as linhas',
			data: allLines,
		},
	];

	const renderSectionHeader = useCallback(({ section: { title, data } }) => data.length > 0 ? <Section heading={title} /> : null, []);

	const renderItem = useCallback(({ item }) => <MemoizedLineItem lineData={item} size="lg" onPress={() => router.push(`/line/${item.id}`)} />, []);

	const keyExtractor = useCallback((item: any) => item.id, []);

	const getItemLayout = useCallback((_: any, index: number) => ({ length: 100, offset: 100 * index, index }), []);

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.mode === 'light' ? theme.lightColors?.background : theme.darkColors?.background,
		},
	});

	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				stickySectionHeadersEnabled={false}
				sections={sections}
				keyExtractor={keyExtractor}
				renderSectionHeader={renderSectionHeader}
				renderItem={renderItem}
				ListEmptyComponent={<NoDataLabel />}
				initialNumToRender={5}
				maxToRenderPerBatch={5}
				windowSize={5}
				removeClippedSubviews
				getItemLayout={getItemLayout}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
}
