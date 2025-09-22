/* * */

import { AppWebView } from '@/components/layout/AppWebView';
import { CloseButton } from '@/components/common/CloseButton';
import { getServiceUrl } from '@/settings/service-urls';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: '',
			presentation: 'modal',
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<AppWebView
			mediaPlaybackRequiresUserAction={false}
			url={`${getServiceUrl('app_view')}/widgets/videos/stop`}
		/>
	);

	//
}
