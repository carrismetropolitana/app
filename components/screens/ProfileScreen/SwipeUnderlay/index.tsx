/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { IconTrash } from '@tabler/icons-react-native';
import { TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { OpenDirection } from 'react-native-swipeable-item';

/* * */

interface Props {
	direction: OpenDirection
	index: number
	open: () => void
	percentOpen: { value: number }
}

/* * */

export const SwipeUnderlay = ({ direction, index, open, percentOpen }: Props) => {
	//

	//
	// A. Setup Variables

	const themeContext = useThemeContext();
	const profileContext = useProfileContext();
	const animatedStyle = useAnimatedStyle(() => ({ opacity: percentOpen.value }));

	//
	// B. Render Components

	return (
		<Animated.View style={[{ flex: 1 }, animatedStyle]}>
			<TouchableOpacity
				style={{ alignItems: 'flex-end', backgroundColor: 'red', flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}
				onPress={() => {
					open();
					if (direction === OpenDirection.LEFT) {
						profileContext.actions.deleteWidgetByDisplayOrder(index);
					}
				}}
			>
				<IconTrash color={themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background} size={24} />
			</TouchableOpacity>
		</Animated.View>
	);

	//
};
