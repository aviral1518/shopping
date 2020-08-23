import { Alert } from "react-native";

import { verify } from "../components/FormField";
import realmConnect from "../realm";

/*
* Handles the sign-up process: Inserts user in the database and sets up the redux state for user
* Returns error if any, otherwise null
* */
async function signUp(data, authenticateUser, updateCart, updatePromo, navigation) {
	let {
		signInMethod,
		avatarSource,
		name,
		phone,
		email,
		password,
		confirm_password,
	} = data;

	let res = verify.name(name);
	if (res.error) {
		Alert.alert("Invalid name", res.error);
		return res.error;
	}
	name = res.text;

	res = verify.phone(phone, signInMethod);
	if (res.error) {
		Alert.alert("Invalid phone", res.error);
		return res.error;
	}
	phone = res.text;

	res = verify.email(email);
	if (res.error) {
		Alert.alert("Invalid email", res.error);
		return res.error;
	}
	email = res.text;

	if (password !== confirm_password) {
		Alert.alert("Passwords don't match", "Make sure to type your password " +
		                                     "correctly in both of the fields.");
		return true;
	}

	try {
		realmConnect(realm => {
			let userCheck = realm.objects("User").filtered(`email = "${email}"`);
			if (userCheck.length) {
				Alert.alert("Email already exists",
					"Another user has already signed up using the same email address. Kindly use another one to continue.");
				return true;
			}

			const nameWords = name.split(" ");
			let nameAbbr;
			if (nameWords.length >= 2) nameAbbr = nameWords[0].charAt(0) + nameWords[1].charAt(0);
			else nameAbbr = nameWords[0].substring(0, 2);

			const user = {
				isSignedIn: true,
				signInMethod,
				avatarSource,
				name,
				nameAbbr,
				phone,
				email,
				password,
				cart: [],
				promo: [],
			};

			realm.write(() => {
				console.log("Creating");
				realm.create("User", user);
				console.log("Created");
				let users = realm.objects("User");
				console.log(users);
				realm.create("Promo", {
					code: "DEBUG",
					discount: 20,
				});
				console.log("Promo in Signup", realm.objects("Promo"));

				authenticateUser({
					signInMethod,
					avatarSource,
					name,
					nameAbbr,
					phone,
					email,
					password,
					cart: [],
					promo: [],
				});

				updateCart([]);
				updatePromo([]);

				navigation.navigate("Drawer");
			});
		});
		return null;
	}
	catch (e) {
		Alert.alert("Error on creation",
			"An unknown problem occurred while trying to create the account in database");
	}

	return true;
}

/*
 * Handles the sign-in process: ISets up the redux state for user if successful,
 *                              otherwise creates new account if user used Social IDs
 * Returns error if any, otherwise null
 * */
async function signIn(data, authenticateUser, updateCart, updatePromo, navigation) {
	let {
		signInMethod,
		avatarSource,
		name,
		email,
		password,
	} = data;

	let res = verify.email(email);
	if (res.error) {
		Alert.alert("Invalid email", res.error);
		return res.error;
	}
	email = res.text;

	try {
		realmConnect(realm => {
			realm.write(() => {
				let userCheck = realm.objects("User").filtered(`email = "${email}"`);
				console.log("Inside sign in:", userCheck);
				if (userCheck.length) {
					const user = userCheck[0];

					if (signInMethod === "EMAIL") {
						const actualPassword = user.password;
						if (password !== actualPassword) {
							Alert.alert("Passwords don't match",
								"Check if the password is typed correctly.");
							return true;
						}
					}

					signInMethod = user.signInMethod;
					name = user.name;
					let {
						avatarSource,
						nameAbbr,
						phone,
						cart,
						promo,
					} = user;

					authenticateUser({
						signInMethod,
						avatarSource,
						name,
						nameAbbr,
						phone,
						email,
						password: user.password,
						cart,
						promo,
					});

					updateCart([]);
					updatePromo([]);

					user.isSignedIn = true;

					navigation.navigate("Drawer");
				}
				else {
					if (signInMethod === "EMAIL") {
						Alert.alert("User not found",
							"Check if the email is typed correctly.");
						return true;
					}
					else {
						const phone = "";
						password = "";
						const confirm_password = "";

						signUp({
							signInMethod,
							avatarSource,
							name,
							phone,
							email,
							password,
							confirm_password,
						}, authenticateUser, updateCart, updatePromo, navigation);
					}
				}
			});
		});
		return null;
	}
	catch (e) {
		Alert.alert("Error while signing in",
			"An unknown problem occurred while trying to sign-in using the account");
		console.log(e);
	}

	return true;
}

export { signUp, signIn };