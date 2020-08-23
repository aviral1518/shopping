import React from "react";
import {
	View,
	TextInput,
	Image,
	TouchableOpacity,
} from "react-native";

import Layout from "../constants/Layout";
import { lightTheme, darkTheme } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";

class FormField extends React.Component {
	constructor(props) {
		super(props);

		const editable = this.props.editable !== false;
		this.state = {
			editable,
		};
	}

	render() {
		const {
			style,
			icon,
			secureTextEntry = false,
			keyboardType = "default",
			onChangeText,
			value = "",
			placeholder = "",
			toggleToEdit = false,
			theme,
		} = this.props;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<View style={[styles.container, style]}>
				<View style={styles.iconContainer}>{icon}</View>
				<TextInput
					style={styles.field}
					keyboardType={keyboardType}
					returnKeyType="done"
					selectionColor={colors.text + "99"}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={colors.text}
					value={value}
					secureTextEntry={secureTextEntry}
					underlineColorAndroid="transparent"
					allowFontScaling={false}
					disableFullscreenUI={true}
					editable={this.state.editable}
					onBlur={() => {
						if (toggleToEdit && this.state.editable) this.setState({editable: false,});
					}}
				/>
				{
					toggleToEdit && !this.state.editable &&
					<TouchableOpacity
						onPress={() => this.setState({editable: true,})}
						style={styles.editButton}
					>
						<Image
							source={require("../assets/img/edit.png")}
							style={styles.editIcon}
						/>
					</TouchableOpacity>
				}
			</View>
		);
	}
}

const getStyles = (colors) => ({
	container: {
		flexDirection: "row",
		alignItems: "center",
		height: 50 * Layout.ratio,
		borderRadius: 25 * Layout.ratio,
		paddingRight: 16 * Layout.ratio,
		backgroundColor: colors.medium,
	},
	iconContainer: {
		height: 50 * Layout.ratio,
		width: 40 * Layout.ratio,
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 10 * Layout.ratio,
	},
	field: {
		fontSize: FontSize[14],
		color: colors.text,
	},
	editButton: {
		position: "absolute",
		right: 10 * Layout.ratio,
		top: 0,
		height: 50 * Layout.ratio,
		width: 30 * Layout.ratio,
		alignItems: "center",
		justifyContent: "center",
	},
	editIcon: {
		height: 40 * Layout.ratio,
		width: 17 * Layout.ratio,
		resizeMode: "contain",
	},
});

const verify = {
	name: (text) => {
		text = text.trim();
		let error = "";
		if (text === "") error = "Name cannot be empty!";
		return {
			text,
			error,
		};
	},
	phone: (text, signInMethod) => {
		text = text.trim();
		let error = "";
		if (signInMethod === "EMAIL") {
			if (text === "") error = "Phone no. cannot be empty!";
			if (!RegExp(/^\d{10}$/).test(text)) error = "Phone no. must consist of exactly 10 digits.";
		}
		return {
			text,
			error,
		};
	},
	email: (text) => {
		text = text.trim();
		let error = "";
		if (text === "") error = "Email cannot be empty!";
		if (!RegExp(
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
				.test(text)) error = "Invalid email format. Kindly make sure the email is typed correctly.";
		return {
			text,
			error,
		};
	},
};

export default bind(FormField);
export { verify };