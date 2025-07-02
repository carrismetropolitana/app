/* * */

import { Section } from '@/components/common/layout/Section';
import { VideoExplainer } from '@/components/common/VideoExplainer';
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
		<View style={headerExplainerStyles.firstHeader}>
			<Section
				heading={heading}
				subheading={subheading}
			/>
			<VideoExplainer />
		</View>
	);
};
