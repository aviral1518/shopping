/*
 * This component allows changing the quantity of the item place in the cart
 * */

import React from "react";
import { View, TouchableOpacity } from "react-native";

import AppText from "../components/AppText";

import Layout from "../constants/Layout";
import {lightTheme, darkTheme} from "../constants/Theme";
import FontSize from "../constants/FontSize";

import realmConnect from "../realm";
import bind from "../redux/bind";

class ProductQuantity extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			quantity: 0,
		};

		this.addItemToCart = this.addItemToCart.bind(this);
		this.removeFromCart = this.removeFromCart.bind(this);
		this.increaseQuantity = this.increaseQuantity.bind(this);
		this.decreaseQuantity = this.decreaseQuantity.bind(this);
	}

	componentDidMount() {
		realmConnect(realm => {
			this.setState({ realm });
			const cart = this.props.cart;

			const foundAt = cart.findIndex(item => (item.id === this.props.product.id));
			if (foundAt === -1) {
				this.addItemToCart();
				this.setState({ quantity: 1 });
			}
			else this.setState({ quantity: cart[foundAt].quantity });
		});
	}

	componentWillUnmount() {
		const { realm } = this.state;
		if (realm !== null && !realm.isClosed) {
			realm.close();
		}
	}

	addItemToCart() {
		const cartContent = this.props.cart.slice();
		const newProduct = {
			id: this.props.product.id,
			thumbnailSource: this.props.product.thumbnailSource,
			title: this.props.product.title,
			description: this.props.product.description,
			discount: this.props.product.discount,
			price: this.props.product.price,
			quantity: 1,
		};
		cartContent.push(newProduct);

		realmConnect(realm => {
			realm.write(() => {
				let findUser = realm.objects("User").filtered(`email = "${this.props.user.email}"`);
				const user = findUser[0];
				user.cart = cartContent;
			});
		});

		this.props.updateCart(cartContent);

		this.setState({ quantity: 1 });
	}

	removeFromCart() {
		const currentCart = this.props.cart;
		const newCart = currentCart.filter(item => (item.id !== this.props.product.id));

		const { realm } = this.state;
		realm.write(() => {
			let findUser = realm.objects("User").filtered(`email = "${this.props.user.email}"`);
			const user = findUser[0];
			user.cart = newCart;
		});

		this.props.updateCart(newCart);
	}

	increaseQuantity() {
		const currentCart = this.props.cart;
		const newCart = currentCart.map(item => {
			const ret = {
				id: item.id,
				thumbnailSource: item.thumbnailSource,
				title: item.title,
				description: item.description,
				discount: item.discount,
				price: item.price,
				quantity: item.quantity,
			};
			if (item.id === this.props.product.id) ret.quantity = item.quantity + 1;
			return ret;
		});

		const {realm} = this.state;
		realm.write(() => {
			let findUser = realm.objects("User").filtered(`email = "${this.props.user.email}"`);
			const user = findUser[0];
			user.cart = newCart;
		});

		this.props.updateCart(newCart);

		this.setState({ quantity: this.state.quantity + 1 });
	}

	decreaseQuantity() {
		const currentCart = this.props.cart;
		const newCart = currentCart.map(item => {
			const ret = {
				id: item.id,
				thumbnailSource: item.thumbnailSource,
				title: item.title,
				description: item.description,
				discount: item.discount,
				price: item.price,
				quantity: item.quantity,
			};
			if (item.id === this.props.product.id && item.quantity > 0) ret.quantity = item.quantity - 1;
			return ret;
		});

		const { realm } = this.state;
		realm.write(() => {
			let findUser = realm.objects("User").filtered(`email = "${this.props.user.email}"`);
			const user = findUser[0];
			user.cart = newCart;
		});

		this.props.updateCart(newCart);

		this.setState({ quantity: this.state.quantity > 1 ? this.state.quantity - 1 : this.state.quantity });
	}

	render() {
		const {
			style,
			increaseQuantity,
			decreaseQuantity,
			onRemoveFromCart,
			product,
			theme,
		} = this.props;

		const {
			id,
			title,
			price,
		} = product;

		let quantity;
		if (increaseQuantity && decreaseQuantity) quantity = this.state.quantity;
		else {
			const cart = this.props.cart;
			const item = cart.find(item => (item.id === id));
			if (item) quantity = item.quantity;
			else quantity = 1; // Sometimes the redux state doesn't update fast enough when adding new
								// items to the cart, so set quantity to 1 manually if that happens
		}

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<View style={[styles.container, style]}>
				<AppText
					style={styles.name}
					numberOfLines={1}
				>
					{title}
				</AppText>
				<View style={styles.footer}>
					<View style={styles.qtyUpdateContainer}>
						<TouchableOpacity
							style={[styles.qtyButton, styles.decreaseButton]}
							onPress={() => {
								if (decreaseQuantity) {
									decreaseQuantity();
									this.setState({
										quantity: this.state.quantity > 1 ? this.state.quantity - 1 :
										          this.state.quantity,
									});
								}
								else this.decreaseQuantity();
							}}
						>
							<AppText style={styles.qtyLabel}>-</AppText>
						</TouchableOpacity>
						<View style={styles.qtyTextContainer}>
							<AppText style={styles.qtyText}>{quantity}</AppText>
						</View>
						<TouchableOpacity
							style={[styles.qtyButton, styles.increaseButton]}
							onPress={() => {
								if (increaseQuantity) {
									increaseQuantity();
									this.setState({ quantity: this.state.quantity + 1 });
								}
								else this.increaseQuantity();
							}}
						>
							<AppText style={styles.qtyLabel}>+</AppText>
						</TouchableOpacity>
					</View>
					<AppText style={styles.productPrice}>₹{price}</AppText>
					<AppText style={styles.productQuantity}>x{quantity}</AppText>
					<AppText style={styles.totalPrice}>₹{quantity * price}</AppText>
				</View>
				<AppText
					style={styles.removeButton}
					onPress={() => {
						if (onRemoveFromCart) onRemoveFromCart();
						this.removeFromCart();
					}}
				>
					Remove from cart
				</AppText>
			</View>
		);
	}
}

export default bind(ProductQuantity);

const getStyles = (colors) => ({
	container: {},
	name: {
		fontSize: FontSize[18],
		fontWeight: "bold",
		color: colors.text,
		marginBottom: 10 * Layout.ratio,
	},
	footer: {
		flexDirection: "row",
		alignItems: "flex-start",
	},
	qtyUpdateContainer: {
		flexDirection: "row",
		height: 20 * Layout.ratio,
	},
	qtyButton: {
		justifyContent: "center",
		alignItems: "center",
		height: 20 * Layout.ratio,
		paddingHorizontal: 8 * Layout.ratio,
		backgroundColor: colors.medium,
	},
	qtyLabel: {
		fontSize: FontSize[10],
		color: colors.dim,
	},
	increaseButton: {
		borderTopRightRadius: 20 / 2 * Layout.ratio,
		borderBottomRightRadius: 20 / 2 * Layout.ratio,
	},
	decreaseButton: {
		borderTopLeftRadius: 20 / 2 * Layout.ratio,
		borderBottomLeftRadius: 20 / 2 * Layout.ratio,
	},
	qtyTextContainer: {
		justifyContent: "center",
		alignItems: "center",
		height: 20 * Layout.ratio,
		paddingHorizontal: 10 * Layout.ratio,
		borderWidth: 1,
		borderColor: colors.medium,
	},
	qtyText: {
		fontSize: FontSize[10],
		color: colors.text,
	},
	productPrice: {
		marginTop: -5 * Layout.ratio,
		marginLeft: "auto",
		fontSize: FontSize[14],
		fontWeight: "bold",
		color: colors.dim,
	},
	productQuantity: {
		marginTop: -5 * Layout.ratio,
		marginLeft: 4 * Layout.ratio,
		fontSize: FontSize[14],
		color: colors.dim,
	},
	totalPrice: {
		marginTop: -8 * Layout.ratio,
		marginLeft: 10 * Layout.ratio,
		fontSize: FontSize[22],
		fontWeight: "bold",
		color: colors.text,
	},
	removeButton: {
		alignSelf: "center",
		marginTop: 10 * Layout.ratio,
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: colors.danger,
	},
});