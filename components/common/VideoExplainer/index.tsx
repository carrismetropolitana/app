/* * */

import { ListItem, Text } from '@rn-vui/themed';
import { IconPlayerPlayFilled } from '@tabler/icons-react-native';
import { TouchableOpacity, View } from 'react-native';

/* * */

import { useTranslation } from 'react-i18next';

import styles from './styles';

/* * */

interface Props {
	referer?: string
	source?: string
}

/* * */

export const VideoExplainer = ({ referer, source }: Props) => {
	//

	//
	// A. Setup variables
	const { t } = useTranslation('translation', { keyPrefix: 'videoexplainer' });
	const videoExplainerStyles = styles();
	return (
		<View style={videoExplainerStyles.videoContainer}>
			<TouchableOpacity>
				<ListItem>
					<IconPlayerPlayFilled color="#3D85C6" fill="#3D85C6" size={24} />
					<ListItem.Content>
						<ListItem.Title style={videoExplainerStyles.listTitle}><Text>{t('title')}</Text></ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>
			</TouchableOpacity>
		</View>
	);
};
