/* * */

import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextStyle, TouchableWithoutFeedback } from 'react-native';

/* * */

interface EditableTextProps {
	onBlur?: () => void
	onChangeText: (text: string) => void
	style?: TextStyle
	value: string
}

/* * */

export const EditableText = ({ onBlur, onChangeText, style, value }: EditableTextProps) => {
	//

	//
	// A. Setup Variables

	const [isEditing, setIsEditing] = useState(false);

	const styles = StyleSheet.create({
		text: {
			fontSize: 16,
			fontWeight: 'bold',
		},
	});

	//
	// B. Handle Aactions

	const handleLongPress = () => {
		setIsEditing(true);
	};

	//

	return isEditing ? (
		<TextInput
			onBlur={onBlur}
			onChangeText={onChangeText}
			style={[styles.text, style]}
			value={value}
			autoFocus
		/>
	) : (
		<TouchableWithoutFeedback onLongPress={handleLongPress}>
			<Text style={[styles.text, style]}>{value}</Text>
		</TouchableWithoutFeedback>
	);
};

export default EditableText;
