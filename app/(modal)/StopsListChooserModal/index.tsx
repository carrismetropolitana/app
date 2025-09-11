/* * */

import StopSearchBar from '@/components/common/StopSearchBar';
import { VirtualizedListingStops } from '@/components/common/VitualizedListStops';
import { useStopsContext } from '@/contexts/Stops.context';
import { useStopsListContext } from '@/contexts/StopsList.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Stop } from '@carrismetropolitana/api-types/network';
import { Overlay, Text } from '@rn-vui/themed';
import { IconCirclePlus } from '@tabler/icons-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/* * */

interface Props {
	isVisible: boolean
	onBackdropPress: () => void
	selectedStopData: (data: Stop) => void
}

/* * */

export default function StopsListChooserModal({ isVisible, onBackdropPress, selectedStopData }: Props) {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const stopsListContext = useStopsListContext();
	const themeContext = useThemeContext();
	const filteredStops = stopsListContext.data.filtered;
	const [selectedStop, setSelectedStop] = useState('');
	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	//
	// B.Fetch Data
	useEffect(() => {
		if (!selectedStop) return;
		const stopData: Stop | undefined = stopsContext.actions.getStopById(selectedStop);
		if (stopData) {
			selectedStopData(stopData);
		}
	}, [selectedStop]);

	//
	// C. Handle Actions

	const handleStopClick = (item: Stop) => {
		setSelectedStop(item.id);
		onBackdropPress();
	};

	//
	// D. Render Components

	return (
		<Overlay animationType="slide" isVisible={isVisible} onBackdropPress={onBackdropPress}>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.container}>
					<View style={styles.header}>
						<TouchableOpacity onPress={onBackdropPress} style={styles.backButton}>
							<Text style={styles.arrow}>←</Text>
							<Text style={styles.backText}>{t('BackButton')}</Text>
						</TouchableOpacity>
					</View>
					<StopSearchBar />
					<VirtualizedListingStops
						data={filteredStops}
						icon={(<IconCirclePlus color={themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100} fill="#3CB43C" size={24} />)}
						itemClick={handleStopClick}
					/>
				</View>
			</SafeAreaView>
		</Overlay>
	);

	//
}
