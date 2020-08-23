export default {
	name: "User",
	properties: {
		isSignedIn: "bool",
		signInMethod: "string",
		avatarSource: "string",
		name: "string",
		nameAbbr: "string", // Abbreviation of the name which is used to show a placeholder profile picture
							// similar to skype, if user hasn't provided any profile picture during sign-up
		phone: "string",
		email: "string",
		password: "string",
		cart: "Product[]",
		promo: "Promo[]",
	}
};