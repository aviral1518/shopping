import React from "react";
import { StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-community/google-signin";
import auth from '@react-native-firebase/auth';

class GoogleLogin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			userInfo: [],
			signedIn: false,
		};
	}

	componentDidMount() {
		GoogleSignin.configure({
			scopes: ['email', 'profile'], 
			webClientId:
				'370592732481-uum050koeal68jdoumsvc0d040vkjhne.apps.googleusercontent.com', 
			offlineAccess: true, 
		});

		auth().onAuthStateChanged(user => {
			this.setState({ userInfo: user });
			if (user) {
				this.setState({ signedIn: true });

				this.props.onSignIn({
					signInMethod: "GOOGLE",
					avatarSource: "",
					name: user.displayName,
					email: user.email,
				});
			}
		});
	}

	async signIn() {
		try {
			await GoogleSignin.hasPlayServices();
			const { accessToken, idToken } = await GoogleSignin.signIn();
			const credential = auth.GoogleAuthProvider.credential(
				idToken,
				accessToken,
			);
			await auth().signInWithCredential(credential);
			this.setState({ signedIn: true });
		}
		catch (error) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log("Google signin cancelled");
			}
			else if (error.code === statusCodes.IN_PROGRESS) {
				console.log("Google signin in progress");
			}
			else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log("PLAY_SERVICES_NOT_AVAILABLE");
			}
			else {
				console.log("Google signin unknown error:", error);
				Alert.alert("Error", "Failed to sign-in using Google");
			}
		}
	}

	async signOut() {
		try {
			await GoogleSignin.revokeAccess();
			await GoogleSignin.signOut();
			auth()
				.signOut()
				.then(() => console.log('Your are signed out!'));
			this.setState({ userInfo: [], signedIn: false });
		}
		catch (error) {
			console.error("Google signout unknown error:", error);
		}
	};

	render() {
		return (
			<TouchableOpacity
				onPress={async () => {
					if (await GoogleSignin.isSignedIn()) await this.signOut();
					await this.signIn();
					if (await GoogleSignin.isSignedIn()) await this.signOut();
				}}
				style={styles.container}
			>
				<Image source={require("../assets/img/google.png")} style={styles.icon} />
			</TouchableOpacity>
		);
	}
}

export default GoogleLogin;

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
	},
	icon: {
		height: 30,
		width: 30,
		resizeMode: "contain",
	},
});