/* * */

import { StyleSheet } from 'react-native';

/* * */

export const styles = () => {
	return StyleSheet.create({
		/* CARD + MODIFIERS */
		cardClosed: {
			borderRadius: 10,
			boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.05)',
			marginBottom: 20,
		},
		cardOpen: {
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			borderBottomWidth: 0,
			borderRadius: 10,
			boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.05)',
		},
		/* * */
		/* CARD BODY */
		cardBody: {
			borderBottomLeftRadius: 10,
			borderBottomRightRadius: 10,
			boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.05)',
			marginBottom: 20,
			overflow: 'hidden',
		},
		/* * */
	});
};
