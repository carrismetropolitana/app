/* * */

import { router } from 'expo-router';

/* * */

interface OpenWebViewProps {
	locale: string
	url: string
}
/* * */

export function openWebView({ locale, url }: OpenWebViewProps) {
	//

	//
	// A. Hanlde Actions

	return router.push(`/OpenWebView?url=${encodeURIComponent(url)}&locale=${locale}`);

	//
};
