/* * */

import { ListItem, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export default function StopDetailNextArrivals() {
	//

	//
	// A. Setup variables
	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

	const stopDetailNextArrivals = styles();
	//
	// B. Render components
	return (
		<View style={stopDetailNextArrivals.sectionWrapper}>
			<Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>

			<ListItem>
				<ListItem.Content>
					<ListItem.Title>THIS IS JUST A DEMO</ListItem.Title>
					<ListItem.Subtitle>a functionalilty demo</ListItem.Subtitle>
				</ListItem.Content>
				<ListItem.Chevron />
			</ListItem>

			<Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>
		</View>
	);

	//
}
