/* * */

import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Waypoint } from '@carrismetropolitana/api-types/network';
import { ListItem, Text } from '@rn-vui/themed';
import { IconArrowLoopRight, IconCircleCheckFilled } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface StopSelectorProps {
	selectedStopId?: string
	selectedVersionId?: string
	setSelectedStopId: (stopId: string) => void
}

/* * */

export const AddSmartNotificationsStopSelector = ({ selectedStopId, selectedVersionId, setSelectedStopId }: StopSelectorProps) => {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'smartNotifications.StopSelector' });
	const stopSelectorStyles = styles();
	const linesDetailContext = useLinesDetailContext();
	const stopsContext = useStopsContext();

	//
	// B. Render Components

	return (
		<>
			<Text style={stopSelectorStyles.text}>{t('stopSelectorTitle')}</Text>
			<View key={linesDetailContext.data.active_pattern?.id || selectedVersionId}>
				{selectedVersionId && linesDetailContext.data.active_pattern ? (
					linesDetailContext.data.active_pattern.path.map((waypoint: Waypoint, idx: number) => {
						const stop = stopsContext.actions.getStopById(waypoint.stop_id);
						const isSelected = selectedStopId === waypoint.stop_id;
						const isFirst = idx === 0;
						return (
							<ListItem
								key={waypoint.stop_sequence}
								disabled={isFirst}
								disabledStyle={{ opacity: 0.5 }}
								onPress={() => !isFirst && setSelectedStopId(waypoint.stop_id)}
								style={{ backgroundColor: isSelected ? '#e6f7ff' : undefined }}
							>
								<IconArrowLoopRight color="#C61D23" size={24} />
								<ListItem.Content>
									<ListItem.Title style={stopSelectorStyles.listTitle}>
										{stop ? <Text>{stop.long_name}</Text> : <Text>{waypoint.stop_id}</Text>}
									</ListItem.Title>
								</ListItem.Content>
								{isSelected && <IconCircleCheckFilled color="#3CB43C" size={24} />}
							</ListItem>
						);
					})
				) : (
					<ListItem>
						<ListItem.Content>
							<ListItem.Title style={[{ marginLeft: 30 }, stopSelectorStyles.listTitle]}>
								<Text style={[{ textAlign: 'center' }, stopSelectorStyles.muted]}>Selecione uma linha e destino para ver as paragens</Text>
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>
				)}
			</View>
		</>
	);

	//
};
