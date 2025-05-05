/* * */

import { LineBadge } from '@/components/lines/LineBadge';
import { useLinesContext } from '@/contexts/Lines.context';
import { Routes } from '@/utils/routes';
import { Pattern, Stop } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rneui/themed';
import { IconArrowRight } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	patternId: string
}

/* * */

export default function AddFavoriteStop({ patternId }: Props) {
	//

	//
	// A. Setup Variables
	const [patternName, setPatternName] = useState<string>();

	const linesContext = useLinesContext();

	const addFavoriteStopStyles = styles();
	//
	// B. Fetch Data

	const fetchPattern = async (data: string) => {
		try {
			const response = await fetch(`${Routes.API}/patterns/${data}`);
			const data: Pattern = await response.json();
			return data;
		}
		catch (error) {
			console.error(`Error fetching pattern ${data}:`, error);
			return null;
		}
	};

	useEffect(() => {
		if (!patternId) return;

		const fetchPatterns = async () => {
			const patternName = '';

			const data = await fetchPattern(patternId);
			if (data) {
				patternName[patternId] = data.headsign;
			}
			setPatternName(patternName);
		};

		fetchPatterns();
	}, []);

	//
	// C. Render Components

	return (
		<View>
			{selectedStop.pattern_ids.map((patternId) => {
				const lineId = patternId.split('_')[0];
				const lineColor = linesContext.data.lines.find(line => line.id === lineId)?.color;

				return (
					<ListItem
						key={patternId}
					>
						<LineBadge
							color={lineColor}
							lineId={lineId}
							size="lg"
						/>
						<IconArrowRight size={10} />
						<ListItem.Content>
							<ListItem.Title style={addFavoriteStopStyles.listTitle}>
								{patternName || 'Sem destino'}
							</ListItem.Title>
						</ListItem.Content>

					</ListItem>
				);
			})}
		</View>

	);

	//
}
