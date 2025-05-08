/* * */

import type { Line } from '@carrismetropolitana/api-types/network';

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { styles } from './styles';

/* * */

export default function FavoritesBar() {
	//

	//
	// A.Setup variables
	const linesContext = useLinesContext();
	const profileContext = useProfileContext();

	const favoriteBarStyles = styles();

	//
	// B, Transform data

	const favoriteLineIds: string[] = profileContext.data.favorite_lines ?? [];
	const favoritesLines: Line[] = favoriteLineIds
		.map(id => linesContext.data.lines.find((line: Line) => line.id === id))
		.filter((line): line is Line => !!line);

	//
	// C. Render components

	if (!favoritesLines || favoritesLines.length === 0) {
		return null;
	}

	return (
		<View style={favoriteBarStyles.container}>
			<ScrollView showsHorizontalScrollIndicator={false} horizontal>
				{favoritesLines.map(line => (
					<Link key={line.id} href={`/line/${line.id}`}>
						<LineBadge lineData={line} size="lg" />
					</Link>
				))}
			</ScrollView>

		</View>
	);

	//
}
