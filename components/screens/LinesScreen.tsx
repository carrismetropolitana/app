// src/screens/LinesScreen.tsx
import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { MemoizedLineItem } from '@/components/common/LineItem';
import { useLinesContext } from '@/contexts/Lines.context';
import { useLinesListContext } from '@/contexts/LinesList.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import { SafeAreaView, SectionList, StyleSheet } from 'react-native';

export default function LinesScreen() {
	const { data: { lines: allLines } } = useLinesContext();
	const { data: { linesAroundLocation: nearbyLines } } = useLinesListContext();
	const { data: { locationPermission } } = useLocationsContext();
	const { theme } = useThemeContext();

	const sections = [
		{
			data: locationPermission === 'granted' ? nearbyLines : [],
			title: 'A minha volta',
		},
		{
			data: allLines,
			title: 'Todas as linhas',
		},
	];

	const renderSectionHeader = useCallback(({ section: { data, title } }) => data.length > 0 ? <Section heading={title} /> : null, []);

	const renderItem = useCallback(({ item }) => <MemoizedLineItem lineData={item} onPress={() => router.push(`/line/${item.id}`)} size="lg" />, []);

	const keyExtractor = useCallback((item: any) => item.id, []);

	const getItemLayout = useCallback((_: any, index: number) => ({ index, length: 100, offset: 100 * index }), []);

	const styles = StyleSheet.create({
		container: {
			backgroundColor: theme.mode === 'light' ? theme.lightColors?.background : theme.darkColors?.background,
			flex: 1,
		},
	});

	return (
		<SafeAreaView style={styles.container}>
			<SectionList
				getItemLayout={getItemLayout}
				initialNumToRender={5}
				keyExtractor={keyExtractor}
				ListEmptyComponent={<NoDataLabel fill withMinHeight />}
				maxToRenderPerBatch={5}
				renderItem={renderItem}
				renderSectionHeader={renderSectionHeader}
				sections={sections}
				showsVerticalScrollIndicator={false}
				stickySectionHeadersEnabled={false}
				windowSize={5}
				removeClippedSubviews
			/>
		</SafeAreaView>
	);
}
