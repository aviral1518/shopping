import React from "react";
import { StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import {
	AccessToken,
	GraphRequest,
	GraphRequestManager,
} from "react-native-fbsdk";

const FBSDK = require("react-native-fbsdk");
const {
	LoginManager,
} = FBSDK;

class FacebookLogin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			myInformation: {},
		};
	}

	async signIn() {
		try {
			const result = await LoginManager.logInWithPermissions(["email"]);
			if (result.isCancelled) console.log("Facebook signin was cancelled");
			else {
				AccessToken.getCurrentAccessToken().then(myData => {
					const accessToken = myData.accessToken.toString();
					this.getInformationFromToken(accessToken);
				});
			}
		}
		catch (error) {
			console.log("Facebook signin failed with error:", error);
			Alert.alert("Error", "Failed to sign-in using Facebook");
		}
	}

	getInformationFromToken(accessToken) {
		const parameters = {
			fields: {
				string: "id, first_name, middle_name, last_name, email",
			},
		};

		const myProfileRequest = new GraphRequest(
			"/me",
			{ accessToken, parameters },
			(error, myProfileInfoResult) => {
				if (error) console.log("Facebook signin error:", error);
				else {
					this.setState({ myInformation: myProfileInfoResult });
					console.log("Facebook signin result:", myProfileInfoResult);

					let name = (myProfileInfoResult.first_name ? myProfileInfoResult.first_name + " " : "") +
					             (myProfileInfoResult.middle_name ? myProfileInfoResult.middle_name + " ": "") +
					             (myProfileInfoResult.last_name ? myProfileInfoResult.last_name + " ": "");
					name = name.trim();

					this.props.onSignIn({
						signInMethod: "GOOGLE",
						avatarSource: "",
						name,
						email: myProfileInfoResult.email,
					});
				}
			},
		);

		new GraphRequestManager().addRequest(myProfileRequest).start();
	}

	async signOut() {
		try {
			LoginManager.logOut();
		}
		catch (error) {
			console.error("Facebook signout unknown error:", error);
		}
	};

	render() {
		return (
			<TouchableOpacity
				onPress={() => {this.state.signedIn ? this.signOut() : this.signIn()}}
				style={styles.container}
			>
				<Image source={require("../assets/img/facebook.png")} style={styles.icon}/>
			</TouchableOpacity>
		);
	}
}

export default FacebookLogin;

const styles = StyleSheet.create({
	container: {
		height: 40,
		width: 40,
		borderRadius: 40,
		borderWidth: 0.5,
		borderColor: "#000000",
		backgroundColor: "#ffffff",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
	},
	icon: {
		height: 30,
		width: 30,
		resizeMode: "contain",
	},
});