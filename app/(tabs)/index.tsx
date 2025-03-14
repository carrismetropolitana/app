/* * */

import HomeScreen from '@/components/screens/HomeScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';

/* * */

export default function Home() {
	//

	//
	// B. Render components

	return (
		// <LinesDetailContextProvider lineId={1001}>
		<HomeScreen />
		// </LinesDetailContextProvider>
	);

	//
}
