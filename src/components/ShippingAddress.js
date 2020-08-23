/*
 * This component allows using the Google API key to fetch the shipping address when buying items in the cart
 * */

import React from "react";
import { View, TextInput, PermissionsAndroid, Alert } from "react-native";
import Geolocation from 'react-native-geolocation-service';

import AppText from "../components/AppText";

import Layout from "../constants/Layout";
import { lightTheme, darkTheme } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";

class ShippingAddress extends React.Component {
	constructor(props) {
		super(props);

		this.getAddress = this.getAddress.bind(this);
	}

	async getAddress() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					title: 'We need GPS location service',
					message:
						'We need location service to provide your location',
					// buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				Geolocation.getCurrentPosition(
					async (position) => {
						const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyC1txyUHpqQlZh8GQ3VYS1IW6k7JC-eMNw`);
						const json = await res.json();
						if (json.status !== "OK") Alert.alert("Error", json.error_message);
						else {
							this.props.onChangeText(json.results[0]["formatted_address"]);
						}
					},
					(error) => {
						console.log("Failed to get location:", error.code, error.message);
					},
					{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
				);
			}
			else {
				Alert.alert("Permission denied", "Location permission not granted");
				return false;
			}
		}
		catch (err) {
			console.warn(err);
		}
	}

	render() {
		const {
			style,
			onChangeText,
			value,
			theme,
		} = this.props;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<View style={[styles.container, style]}>
				<View style={styles.header}>
					<AppText style={styles.label}>Shipping address</AppText>
					<AppText
						style={styles.button}
						onPress={() => this.getAddress()}
					>
						Detect my location
					</AppText>
				</View>
				<TextInput
					placeholder={"Input the shipping address"}
					placeholderTextColor={colors.dim}
					returnKeyType="done"
					selectionColor={colors.text + "99"}
					selectTextOnFocus={false}
					style={styles.field}
					onChangeText={onChangeText}
					value={value}
					underlineColorAndroid="transparent"
					allowFontScaling={false}
					disableFullscreenUI={true}
				/>
			</View>
		);
	}
}

export default bind(ShippingAddress);

const getStyles = (colors) => ({
	container: {},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 6 * Layout.ratio,
	},
	label: {
		marginLeft: 8 * Layout.ratio,
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: colors.dim,
	},
	button: {
		marginLeft: "auto",
		marginRight: 8 * Layout.ratio,
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: colors.primary,
	},
	field: {
		alignSelf: "stretch",
		height: 50 * Layout.ratio,
		borderRadius: 8 * Layout.ratio,
		paddingHorizontal: 8 * Layout.ratio,
		fontSize: FontSize[16],
		color: colors.text,
		backgroundColor: colors.medium,
	},
});