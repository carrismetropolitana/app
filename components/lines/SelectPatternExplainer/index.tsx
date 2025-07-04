/* * */

import SelectPatternExplainerModal from '@/app/(modal)/SelectPatternExplainerModal';
import { Text } from '@rn-vui/themed';
import { IconInfoSquareRoundedFilled } from '@tabler/icons-react-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

export const SelectPatternExplainer = () => {
	//

	//
	// A. Setup variables

	const explainerStyles = styles();
	const [isVisible, setIsVisible] = useState(false);

	//
	// B. Render Components

	return (
		<View style={explainerStyles.explainerContainer}>
			<IconInfoSquareRoundedFilled color="#FFFFFF" fill="#9696A0" size={14} />
			<TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
				<Text style={explainerStyles.text}>O que é o percurso/destino de uma linha?</Text>
			</TouchableOpacity>
			<SelectPatternExplainerModal isVisible={isVisible} onBackdropPress={() => setIsVisible(!isVisible)} />
		</View>
	);

	//
};
