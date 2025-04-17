/* * */

import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { ListItem } from '@rneui/themed';
import { IconGripVertical } from '@tabler/icons-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

/* * */

interface FavoriteItemProps {
	data: AccountWidget
	drag: () => void
}

/* * */

const FavoriteItem = ({ data, drag }: FavoriteItemProps) => {
	//
	// A. Setup Variables

	const [patternHeadsign, setPatternHeadsign] = useState<string>('');
	const isLine = data.data.type === 'lines';
	const patternId = isLine
		? (data.data as { pattern_id: string, type: 'lines' }).pattern_id
		: Array.isArray((data.data as { pattern_ids: string[], type: 'stops' }).pattern_ids)
			? (data.data as { pattern_ids: string[], type: 'stops' }).pattern_ids[0]
			: undefined;

	//
	// B. Fetch Data

	useEffect(() => {
		const fetchData = async () => {
			if (!patternId) {
				setPatternHeadsign('');
				return;
			}

			try {
				const response = await fetch(`${Routes.API}/patterns/${patternId}`);
				if (!response.ok) throw new Error('Failed to fetch');
				const json = await response.json();
				setPatternHeadsign(json[0]?.headsign || '');
			}
			catch (error) {
				console.error('Fetch error:', error);
				setPatternHeadsign('');
			}
		};

		fetchData();
	}, [patternId]);

	//
	// C. Render Components

	return (
		<ListItem>
			<TouchableOpacity onPress={drag}>
				<IconGripVertical color="#9696A0" size={28} />
			</TouchableOpacity>

			<ListItem.Content>
				<ListItem.Title>
					<Text>
						{patternHeadsign}
					</Text>
				</ListItem.Title>

				<ListItem.Subtitle>
					<Text>
						{isLine ? 'Linha Favorita' : 'Paragem Favorita'}
					</Text>
				</ListItem.Subtitle>
			</ListItem.Content>

			<ListItem.Chevron />
		</ListItem>
	);

	//
};

export default FavoriteItem;
