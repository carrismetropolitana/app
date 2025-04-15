import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextStyle, TouchableWithoutFeedback } from 'react-native';

interface EditableTextProps {
	onBlur?: () => void
	onChangeText: (text: string) => void
	style?: TextStyle
	value: string
}

const EditableText = ({ onBlur, onChangeText, style, value }: EditableTextProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const handleLongPress = () => {
		setIsEditing(true);
	};

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

const styles = StyleSheet.create({
	text: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default EditableText;
