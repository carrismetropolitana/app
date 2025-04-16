/* * */

import { Text } from '@rneui/themed';

/* * */

interface LineWidgetCardHeaderProps {
	title: string
}

/* * */

export function LineWidgetCardHeader({ title }: LineWidgetCardHeaderProps) {
	//

	//
	// A. Render Components

	return (
		<>
			<Text>{title}</Text>
		</>
	);

	//
}
