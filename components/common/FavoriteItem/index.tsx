/* * */

import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
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

	//
	// A. Setup Variables

	const [patternData, setPatternData] = useState<null | Pattern>(null);

	const patternId = data.data.type === 'lines'
		? data.data.pattern_id
		: data.data.pattern_ids;

	//
	// B. Fetch Data

	useEffect(() => {
		const fetchData = async () => {
			if (!patternId) return;

			try {
				const response = await fetch(`${Routes.API}/patterns/${patternId}`);
				if (!response.ok) throw new Error('Failed to fetch');
				const json = await response.json();

				const firstItem = json[0] || {};
				setPatternData(firstItem);
			}
			catch (error) {
				console.error('Fetch error:', error);
				setPatternData(null);
			}
		};

		fetchData();
	}, [patternId]);

	//
	// C. Render Components

	return (
		<ListItem>
			<TouchableOpacity onPress={() => drag}>
				<IconGripVertical color="#9696A0" size={28} />
			</TouchableOpacity>

			<ListItem.Content>
				<ListItem.Title>
					<Text>
						{patternData?.headsign}
					</Text>
				</ListItem.Title>

				<ListItem.Subtitle>
					<Text>
						{data.data.type === 'lines' ? 'Linha Favorita' : 'Paragem Favorita'}
					</Text>
				</ListItem.Subtitle>
			</ListItem.Content>

			<ListItem.Chevron />
		</ListItem>
	);

	//
};

export default FavoriteItem;
