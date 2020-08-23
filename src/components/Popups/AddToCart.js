/*
 * Component which is rendered inside the `Add to Cart` Popup in `Product` screen
 * */

import * as React from "react";
import { View, Alert } from "react-native";

import AppText from "../AppText";
import ProductQuantity from "../ProductQuantity";

import Layout from "../../constants/Layout";
import { lightTheme, darkTheme } from "../../constants/Theme";
import FontSize from "../../constants/FontSize";

import realmConnect from "../../realm";
import bind from "../../redux/bind";

const WIDTH = 300 * Layout.ratio;

class AddToCart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			quantity: 0,
		};
	}

	componentDidMount() {
		realmConnect(realm => {
			realm.write(() => {
				let findUser = realm.objects("User").filtered(`email = "${this.props.user.email}"`);
				const user = findUser[0];
				const cart = user.cart;

				const foundAt = cart.findIndex(item => (item.id === this.props.product.id));
				if (foundAt === -1) this.setState({ quantity: 1 });
				else this.setState({ quantity: cart[foundAt].quantity });
			});
			this.setState({ realm });
		});
	}

	render() {
		const {
			style,
			title,
			onClose,
			product,
			theme,
		} = this.props;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<View style={styles.window}>
				<View style={[styles.container, style]}>
					<View style={styles.header}>
						<AppText style={styles.title}>{title}</AppText>
						<AppText
							style={styles.cross}
							onPress={onClose}
						>&times;</AppText>
					</View>

					<ProductQuantity
						product={product}
						decreaseQuantity={() => this.setState({
							quantity: this.state.quantity > 1 ? this.state.quantity - 1 :
							          this.state.quantity,
						})}
						increaseQuantity={() => this.setState({ quantity: this.state.quantity + 1 })}
						onRemoveFromCart={() => onClose()}
					/>

					<View style={styles.footer}>
						<AppText
							style={styles.negativeButtonLabel}
							onPress={() => onClose()}
						>
							Cancel
						</AppText>
						<AppText
							style={styles.affirmativeButtonLabel}
							onPress={() => {
								const currentCart = this.props.user.cart;
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
									if (item.id === this.props.product.id) ret.quantity = this.state.quantity;
									return ret;
								});


								const { realm } = this.state;
								realm.write(() => {
									let findUser = realm.objects("User")
									                    .filtered(`email = "${this.props.user.email}"`);
									const user = findUser[0];
									user.cart = newCart;
								});

								this.props.updateCart(newCart);

								onClose();

								Alert.alert("Success", "Added the item in your cart successfully.");
							}}
						>
							Add to cart
						</AppText>
					</View>
				</View>
			</View>
		);
	}
}

export default bind(AddToCart);

const getStyles = (colors) => ({
	window: {
		height: Layout.window.height,
		width: Layout.window.width,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
	},
	container: {
		width: WIDTH,
		padding: 10 * Layout.ratio,
		backgroundColor: colors.card,
		borderRadius: 2 * Layout.ratio,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.22,
		shadowRadius: 24,
		elevation: 4,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: colors.text,
	},
	cross: {
		marginLeft: "auto",
		fontSize: FontSize[24],
	},

	footer: {
		flexDirection: "row",
		marginTop: 8 * Layout.ratio,
	},
	negativeButtonLabel: {
		fontSize: FontSize[13],
		color: colors.dim,
	},
	affirmativeButtonLabel: {
		marginLeft: "auto",
		fontSize: FontSize[13],
		color: colors.primary,
	},
});