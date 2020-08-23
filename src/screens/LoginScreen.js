import React from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import {
	ScrollView,
	View,
	Image,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';

import AppText from "../components/AppText";
import FormField from "../components/FormField";
import FacebookLogin from "../components/FacebookLogin";
import GoogleLogin from "../components/GoogleLogin";
import Button from "../components/Button";

import Layout from "../constants/Layout";
import { lightTheme, darkTheme } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";
import { signIn } from "../helpers/authentication";

const HEIGHT = 220 * Layout.ratio;
const DIMENSION = 2000;

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
		};
	}

	async handleSignin(info) {
		const {
			authenticateUser,
			updateCart,
			updatePromo,
		} = this.props;

		const data = {
			...this.state,
			...info,
		};

		await signIn(data, authenticateUser, updateCart, updatePromo, this.props.navigation);
	}

	render() {
		const { theme } = this.props;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<SafeAreaInsetsContext.Consumer>
				{(insets) => (
					<ScrollView style={{flex: 1, backgroundColor: colors.bright,}}>
						<View style={styles.curvedHeaderContainer}>
							<LinearGradient
								colors={[colors.gradient.start, colors.gradient.end]}
								style={[styles.headerContainer, { paddingTop: insets.top, }]}
							>
								<Image source={require("../assets/img/logo.png")} style={styles.headerLogo} />
								<AppText style={styles.screenTitle}>Welcome</AppText>
							</LinearGradient>
						</View>
						<View style={[
							styles.formContainer,
							{
								paddingTop: HEIGHT + 26 * Layout.ratio,
								paddingBottom: insets.bottom + 20 * Layout.ratio,
							}
						]}>
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
							<View style={styles.socialLoginRow}>
								<FacebookLogin onSignIn={data => this.handleSignin(data)}/>
								<GoogleLogin onSignIn={data => this.handleSignin(data)} />
							</View>
							<Button
								style={styles.submitButton}
								label="Login"
								onPress={() => this.handleSignin({signInMethod: "EMAIL"})}
							/>
							<View style={styles.horizontalBar} />
							<View style={styles.footerContainer}>
								<AppText style={styles.footerText}>
									Don't have an account?
								</AppText>
								<AppText
									style={styles.footerLink}
									onPress={() => {this.props.navigation.jumpTo("Signup");}}
								>
									Register here
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
	curvedHeaderContainer: {
		position: "absolute",
		alignItems: "center",
		height: DIMENSION,
		width: DIMENSION,
		borderRadius: DIMENSION / 2,
		top: -DIMENSION + HEIGHT,
		left: (Layout.window.width - DIMENSION) / 2,
		paddingTop: DIMENSION - HEIGHT,
		zIndex: 1,
	},
	headerContainer: {
		height: HEIGHT,
		width: Layout.window.width,
		alignItems: "center",
	},
	headerLogo: {
		height: 80 * Layout.ratio,
		width: 150 * Layout.ratio,
		resizeMode: "cover",
		marginTop: 30 * Layout.ratio,
		marginBottom: 10 * Layout.ratio,
	},
	screenTitle: {
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: colors.primaryTint,
	},

	formContainer: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.bright,
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
	socialLoginRow: {
		flexDirection: "row",
		alignItems: "center",
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

export default bind(LoginScreen);