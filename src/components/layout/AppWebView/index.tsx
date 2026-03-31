/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useSystemVariables } from '@/theme/global';
import { useMemo } from 'react';
import { WebView } from 'react-native-webview';

/* * */

interface AppWebViewProps {
	mediaPlaybackRequiresUserAction?: boolean
	url: string
}

/* * */

export function AppWebView({ mediaPlaybackRequiresUserAction = true, url }: AppWebViewProps) {
	//

	//
	// A. Setup variables

	const localeContext = useLocaleContext();
	const systemVariables = useSystemVariables();

	//
	// B. Transform data

	const preparedUrl = useMemo(() => {
		const originalUrl = new URL(url);
		originalUrl.searchParams.set('locale', localeContext.data.locale);
		return originalUrl.toString();
	}, [url, localeContext.data.locale]);

	//
	// C. Render components

	return (
		<WebView
			decelerationRate={0.998}
			mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
			source={{ uri: preparedUrl }}
			style={{ backgroundColor: systemVariables.background[200] }}
			allowsFullscreenVideo
		/>
	);

	//
}
