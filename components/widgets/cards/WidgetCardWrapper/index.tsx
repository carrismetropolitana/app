/* * */

import { WidgetCardOpenToggle } from '@/components/widgets/cards/WidgetCardOpenToggle';
import { ReactElement } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetCardWrapperProps {
	body?: ReactElement
	header: ReactElement
	isOpen: boolean
	onToggleOpen: () => void
}

/* * */

export function WidgetCardWrapper({ body, header, isOpen, onToggleOpen }: WidgetCardWrapperProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>

			<View style={[styles.headerWrapper, isOpen && styles.headerWrapperOpen]}>
				{header}
				<WidgetCardOpenToggle isOpen={isOpen} onToggle={onToggleOpen} />
			</View>

			{isOpen && (
				<View style={styles.bodyWrapper}>
					{body}
				</View>
			)}

		</View>
	);

	//
}
