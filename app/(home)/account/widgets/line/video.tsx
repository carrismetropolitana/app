/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useSystemVariables } from '@/theme/global';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { WebView } from 'react-native-webview';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localContext = useLocaleContext();
	const systemVariables = useSystemVariables();

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton onPress={() => navigation.goBack()} />,
			headerShown: true,
			headerStyle: {
				backgroundColor: systemVariables.background[100],
				color: systemVariables.text[100],
			},
			headerTitle: '',
			presentation: 'modal',
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<WebView
			mediaPlaybackRequiresUserAction={false}
			source={{ uri: `https://carrismetropolitana.pt/app-view/widgets/videos/lines?locale=${localContext.locale}` }}
			allowsFullscreenVideo
		/>
	);

	//
}
