/* * */

import StopDetailPager from '@/components/stops/StopDetailPagerView';
import { ListItem, Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export default function StopDetailCharacterization() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });
	const stopDetailCharacterizationStyles = styles();

	//
	// A. Render components
	return (
		<View style={stopDetailCharacterizationStyles.sectionWrapper}>
			<Text style={stopDetailCharacterizationStyles.sectionHeading}> {t('third_heading')}</Text>
			<View style={stopDetailCharacterizationStyles.stopDetailCharacterizationPagerWrapper}>
				<StopDetailPager />
			</View>
			<View style={stopDetailCharacterizationStyles.stopDetailCharacterizationDetailsWrapper}>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title>THIS IS JUST A DEMO</ListItem.Title>
						<ListItem.Subtitle>a functionalilty demo</ListItem.Subtitle>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
				<ListItem>
					<ListItem.Content>
						<ListItem.Title>THIS IS JUST A DEMO</ListItem.Title>
						<ListItem.Subtitle>a functionalilty demo</ListItem.Subtitle>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
			</View>
		</View>
	);

	//
}
