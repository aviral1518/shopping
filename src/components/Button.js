import React from "react";
import {
	StyleSheet,
} from "react-native";
import Ripple from "react-native-material-ripple";

import AppText from "./AppText";

import Layout from "../constants/Layout";
import Theme from "../constants/Theme";
import FontSize from "../constants/FontSize";

export default class FormField extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			style,
			label,
			onPress,
		} = this.props;

		return (
			<Ripple
				style={[styles.container, style]}
				onPress={onPress}
				rippleColor={Theme.bright}
				rippleContainerBorderRadius={25 * Layout.ratio}
				rippleCentered={false}
			>
				<AppText style={styles.label}>{label}</AppText>
			</Ripple>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		height: 50 * Layout.ratio,
		borderRadius: 25 * Layout.ratio,
		backgroundColor: Theme.primary,
	},
	label: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: Theme.bright,
	},
});