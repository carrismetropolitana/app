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

	//
	// A. Render Components
	return (
		<Carousel slides={alerts} />
	);

	//
}
