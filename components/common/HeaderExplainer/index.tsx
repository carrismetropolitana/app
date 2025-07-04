/* * */
import { VideoExplainer } from '@/components/common/VideoExplainer';
import { Text } from '@rn-vui/themed';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	heading: string
	subheading: string
}

/* * */
export const HeaderExplainer = ({ heading, subheading }: Props) => {
	const headerExplainerStyles = styles();
	return (
		<>
			<View style={headerExplainerStyles.firstHeader}>
				<Text style={headerExplainerStyles.heading}>{heading}</Text>
				<Text style={headerExplainerStyles.subheading}>{subheading}</Text>
			</View>
			<VideoExplainer />
		</>
	);
};
