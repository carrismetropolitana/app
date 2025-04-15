import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem } from '@rneui/themed';
import { IconGripVertical } from '@tabler/icons-react-native';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface FavoriteItemProps {
	data: any
	drag: () => void
}

const FavoriteItem = ({ data, drag }: FavoriteItemProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [patternData, setPatternData] = useState<null | Pattern>(null);

	// Always use pattern_id regardless of type
	const patternId = data?.data?.pattern_id;
	const type = data?.data?.type;

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
			finally {
				setIsLoading(false);
			}
		};

		setIsLoading(true);
		fetchData();
	}, [patternId]);

	if (!patternId) return null;

	return (
		<ListItem>
			<TouchableOpacity onPressIn={drag}>
				<IconGripVertical color="#9696A0" size={28} />
			</TouchableOpacity>

			<ListItem.Content>
				<ListItem.Title>
					<Text>
						{isLoading ? 'Loading...' : (
							type === 'lines'
								? patternData?.headsign
								: patternData?.long_name
						)}
					</Text>
				</ListItem.Title>

				<ListItem.Subtitle>
					<Text>
						{type === 'lines' ? 'Linha Favorita' : 'Paragem Favorita'}
					</Text>
				</ListItem.Subtitle>
			</ListItem.Content>

			<ListItem.Chevron />
		</ListItem>
	);
};

export default FavoriteItem;
