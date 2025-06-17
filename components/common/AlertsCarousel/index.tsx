/* * */

import type { SimplifiedAlert } from '@/types/alerts.types';

import Carousel from '@/components/common/Carousel';

/* * */

interface Props {
	alerts: SimplifiedAlert[]
}

/* * */

export function AlertsCarousel({ alerts }: Props) {
	//

	const onAlertPress = (index: number) => {
		console.log(`Alert ${index + 1} pressed:`, alerts[index]);
	};

	return (
		<Carousel onAlertPress={onAlertPress} slides={alerts} />
	);

	//
}
