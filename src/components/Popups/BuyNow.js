/*
 * Component which is rendered inside the `Buy Now` Popup in `Product` screen
 * */

import * as React from "react";
import { View, Alert } from "react-native";

import AppText from "../AppText";
import ProductQuantity from "../ProductQuantity";
import ShippingAddress from "../ShippingAddress";
import PromoCode from "../PromoCode";
import handlePurchase from "../../helpers/handlePurchase";

import Layout from "../../constants/Layout";
import { lightTheme, darkTheme } from "../../constants/Theme";
import FontSize from "../../constants/FontSize";

import bind from "../../redux/bind";
import realmConnect from "../../realm";

const WIDTH = 300 * Layout.ratio;

class BuyNow extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
		};

		this.onPurchase = this.onPurchase.bind(this);
	}

	componentDidMount() {
		realmConnect(realm => {
			this.setState({ realm });
		});
	}

	/*
	 * Empty the cart and promo codes of the user once the purchase is complete
	 * */
	onPurchase() {
		handlePurchase();

		const { realm } = this.state;
		realm.write(() => {
			let findUser = realm.objects("User").filtered(`email = "${this.props.user.email}"`);
			const user = findUser[0];
			user.cart = [];
			user.promo = [];
		});

		this.props.updateCart([]);
		this.props.updatePromo([]);
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
						style={styles.productQuantity}
						product={product}
						onRemoveFromCart={() => onClose()}
					/>
					<ShippingAddress
						style={styles.shippingAddress}
						onChangeText={(text) => {this.setState({ address: text });}}
						value={this.state.address}
					/>
					<PromoCode
						onChangeText={(text) => {this.setState({ promo: text });}}
						value={this.state.promo}
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
								this.onPurchase();
								onClose();
							}}
						>
							Buy now
						</AppText>
					</View>
				</View>
			</View>
		);
	}
}

export default bind(BuyNow);

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

	productQuantity: {
		marginBottom: 16 * Layout.ratio,
	},
	shippingAddress: {
		marginBottom: 16 * Layout.ratio,
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