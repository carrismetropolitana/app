/* * */
import { Text } from '@rneui/themed';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { segmentedControlStyles } from './styles';

/* * */

export interface Option {
	centerSection?: React.ReactNode
	label: string
	leftSection?: React.ReactNode
	rightSection?: React.ReactNode
	value: string
}

/* * */

export interface Props {
	onChange: (event: { nativeEvent: { selectedSegmentValue: string } }) => void
	options: Option[]
	selectedValue: string
}

/* * */
export function SegmentedControl({ onChange, options, selectedValue }: Props) {
	//

	//
	// A. Render components
	return (
		<View style={segmentedControlStyles.segmentedControl}>
			{options.map(option => (
				<TouchableOpacity
					key={option.value}
					onPress={() =>
						onChange({ nativeEvent: { selectedSegmentValue: option.value } })}
					style={[
						segmentedControlStyles.segment,
						selectedValue === option.value && segmentedControlStyles.selectedSegment,
					]}
				>
					{option.leftSection && (
						<View style={segmentedControlStyles.leftSection}>{option.leftSection}</View>
					)}
					<View style={segmentedControlStyles.centerSection}>
						{option.centerSection ? (
							option.centerSection
						) : (
							<Text style={segmentedControlStyles.label}>{option.label}</Text>
						)}
					</View>
					{option.rightSection && (
						<View style={segmentedControlStyles.rightSection}>{option.rightSection}</View>
					)}
				</TouchableOpacity>
			))}
		</View>
	);

	//
}
