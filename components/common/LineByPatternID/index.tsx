/* * */

import type { Pattern } from '@carrismetropolitana/api-types/network';

import { LineBadge } from '@/components/lines/LineBadge';
import { Routes } from '@/utils/routes';
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron';
import { ListItem, Skeleton } from '@rneui/themed';
import { useEffect, useState } from 'react';

import styles from './styles';

/* * */

interface Props {
	patternId: string
}

/* * */

export default function LineByPatternID({ patternId }: Props) {
	//

	//
	// A. Setup Variables

	const [patternData, setPatternData] = useState<null | Pattern>(null);

	const addFavoriteStopStyles = styles();

	//
	// B. Fetch Data

	const fetchPattern = async (data: string) => {
		try {
			const response = await fetch(`${Routes.API}/patterns/${data}`);
			const responseData: Pattern = await response.json();
			return responseData;
		}
		catch (error) {
			console.error(`Error fetching pattern ${data}:`, error);
			return null;
		}
	};

	useEffect(() => {
		if (!patternId) return;

		const fetchPatterns = async () => {
			const data = await fetchPattern(patternId);
			if (data) {
				const freshData = JSON.parse(JSON.stringify(data));
				setPatternData(freshData);
			}
		};

		fetchPatterns();
	}, [patternId]);

	//
	// C. Render Components

	if (!patternData) {
		return (
			<ListItem>
				<Skeleton height={32} width={32} circle />
				<ListItem.Content>
					<Skeleton height={16} style={{ marginBottom: 4 }} width={120} />
					<Skeleton height={12} width={80} />
				</ListItem.Content>
				<Skeleton height={16} width={16} />
			</ListItem>
		);
	}
	return (
		<ListItem>
			<LineBadge color={patternData[0].color} lineId={patternData[0].short_name} size="lg" />
			<ListItem.Content>
				<ListItem.Title style={addFavoriteStopStyles.listTitle}>
					{patternData[0].headsign ? patternData[0].headsign : 'Sem destino'}
				</ListItem.Title>
			</ListItem.Content>
			<ListItemChevron />
		</ListItem>
	);

	//
}
