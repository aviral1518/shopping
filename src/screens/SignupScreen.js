import React from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import {
	ScrollView,
	View,
	Image,
	TouchableOpacity,
	Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from "react-native-image-picker";

import AppText from "../components/AppText";
import FormField from "../components/FormField";
import Button from "../components/Button";

import Layout from "../constants/Layout";
import { lightTheme, darkTheme } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";
import { signUp } from "../helpers/authentication";

class SignupScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			avatarSource: "",
			name: "",
			phone: "",
			email: "",
			password: "",
			confirm_password: "",
		};

		this.handleImageUpload = this.handleImageUpload.bind(this);
	}

	handleImageUpload() {
		ImagePicker.showImagePicker({
			title: "Select Avatar",
			tintColor: lightTheme.text,
			storageOptions: {
				privateDirectory: true, // Used the Storage/android/data directory to private store images
			},
		}, (response) => {
			console.log("Response = ", response);

			if (response.didCancel) {
				console.log("User cancelled image picker");
			}
			else if (response.error) {
				console.log("ImagePicker Error: ", response.error);
				Alert.alert("Error", "Failed to pick image.");
			}
			else if (response.fileSize > 2000000) {
				Alert.alert("Error", "Sorry, your image size is more than 2MB. Please select another image within 2MB.");
			}
			else {
				this.setState({
					avatarSource: response.uri,
				});
			}
		});
	}

	async handleSignup() {
		const {
			authenticateUser,
			updateCart,
			updatePromo,
		} = this.props;

		const signInMethod = "EMAIL";

		const data = {
			...this.state,
			signInMethod,
		};

		await signUp(data, authenticateUser, updateCart, updatePromo, this.props.navigation);
	}

	render() {
		const { theme } = this.props;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<SafeAreaInsetsContext.Consumer>
				{(insets) => (
					<ScrollView style={{ flex: 1, backgroundColor: colors.bright, }}>
						<LinearGradient
							colors={[colors.gradient.start, colors.gradient.end]}
							style={[styles.headerContainer, { paddingTop: insets.top, }]}
						>
							<AppText style={styles.screenTitle}>Register</AppText>
						</LinearGradient>
						<View style={[styles.formContainer, { paddingBottom: insets.bottom + 20 * Layout.ratio }]}>
							<View style={styles.avatarContainer}>
								{
									this.state.avatarSource ?
									<Image
										source={{ uri: this.state.avatarSource }}
										style={styles.avatar}
									/> :
									<Image
										source={require("../assets/img/avatar-placeholder.png")}
										style={styles.defaultAvatar}
									/>
								}
								<TouchableOpacity
									style={styles.uploadButton}
									onPress={() => this.handleImageUpload()}
								>
									<AppText style={styles.uploadText}>Add Photo</AppText>
								</TouchableOpacity>
							</View>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/avatar-placeholder.png")}
										style={styles.formFieldIcon}
									/>
								}
								secureTextEntry={false}
								onChangeText={(text) => this.setState({ name: text })}
								value={this.state.name}
								placeholder="Full Name"
							/>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/phone.png")}
										style={styles.formFieldIcon}
									/>
								}
								keyboardType="number-pad"
								secureTextEntry={false}
								onChangeText={(text) => this.setState({ phone: text })}
								value={this.state.phone}
								placeholder="Phone no."
							/>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/mail.png")}
										style={[styles.formFieldIcon, { width: 20 * Layout.ratio }]}
									/>
								}
								secureTextEntry={false}
								onChangeText={(text) => this.setState({ email: text })}
								value={this.state.email}
								placeholder="Email"
							/>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/password.png")}
										style={styles.formFieldIcon}
									/>
								}
								secureTextEntry={true}
								onChangeText={(text) => this.setState({ password: text })}
								value={this.state.password}
								placeholder="Password"
							/>
							<FormField
								style={styles.formField}
								icon={
									<Image
										source={require("../assets/img/password.png")}
										style={styles.formFieldIcon}
									/>
								}
								secureTextEntry={true}
								onChangeText={(text) => this.setState({ confirm_password: text })}
								value={this.state.confirm_password}
								placeholder="Confirm password"
							/>
							<Button
								style={styles.submitButton}
								label="Register"
								onPress={() => this.handleSignup()}
							/>
							<View style={styles.horizontalBar}/>
							<View style={styles.footerContainer}>
								<AppText style={styles.footerText}>
									Have an account?
								</AppText>
								<AppText
									style={styles.footerLink}
									onPress={() => {this.props.navigation.jumpTo("Login");}}
								>
									Login here
								</AppText>
							</View>
						</View>
					</ScrollView>
				)}
			</SafeAreaInsetsContext.Consumer>
		);
	}
}

const getStyles = (colors) => ({
	headerContainer: {
		alignItems: "center",
		height: 190 * Layout.ratio,
	},
	screenTitle: {
		marginTop: 20 * Layout.ratio,
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: colors.primaryTint,
	},

	formContainer: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.bright,
		marginTop: -16 * Layout.ratio,
		borderTopLeftRadius: 16 * Layout.ratio,
		borderTopRightRadius: 16 * Layout.ratio,
		elevation: 4,
	},

	avatarContainer: {
		height: 130 * Layout.ratio,
		width: 130 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 130 / 2 * Layout.ratio,
		elevation: 4,
		marginTop: -130 / 2 * Layout.ratio,
		marginBottom: 26 * Layout.ratio,
		backgroundColor: colors.bright,
		overflow: "hidden",
	},
	avatar: {
		height: "100%",
		width: "100%",
		resizeMode: "cover",
	},
	defaultAvatar: {
		height: "90%",
		width: "90%",
		marginTop: "10%",
		resizeMode: "contain",
	},
	uploadButton: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		paddingBottom: 4 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, .7)",
	},
	uploadText: {
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: colors.primaryTint,
	},

	formField: {
		alignSelf: "stretch",
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
	},
	formFieldIcon: {
		width: 17 * Layout.ratio,
		resizeMode: "contain",
	},
	submitButton: {
		alignSelf: "stretch",
		marginTop: 10 * Layout.ratio,
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
	},

	horizontalBar: {
		alignSelf: "stretch",
		height: 1,
		marginHorizontal: 45 * Layout.ratio,
		marginBottom: 12 * Layout.ratio,
		backgroundColor: colors.medium,
	},

	footerContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	footerText: {
		fontSize: FontSize[10],
		color: colors.text,
	},
	footerLink: {
		marginLeft: 4 * Layout.ratio,
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: colors.primary,
	},
});

export default bind(SignupScreen);