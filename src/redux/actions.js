import { AUTHENTICATE_USER, UPDATE_CART, UPDATE_PROMO, UPDATE_THEME } from "./types";

function authenticateUser(user) {
	return {
		type: AUTHENTICATE_USER,
		user,
	};
}

function updateCart(cart) {
	return {
		type: UPDATE_CART,
		cart,
	};
}

function updatePromo(promo) {
	return {
		type: UPDATE_PROMO,
		promo,
	};
}

function updateTheme(theme) {
	return {
		type: UPDATE_THEME,
		theme,
	};
}

const actionCreators = {
	authenticateUser,
	updateCart,
	updatePromo,
	updateTheme,
};

export { actionCreators };