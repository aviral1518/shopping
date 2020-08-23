import React from "react";
import {
	ScrollView,
	View,
	TouchableOpacity,
	Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import AppText from "../components/AppText";
import Button from "../components/Button";
import ProductQuantity from "../components/ProductQuantity";
import ShippingAddress from "../components/ShippingAddress";
import PromoCode from "../components/PromoCode";
import handlePurchase from "../helpers/handlePurchase";

import Layout from "../constants/Layout";
import { lightTheme, darkTheme } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";
import realmConnect from "../realm";

class CartScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			realm: null,
			address: "",
			promo: "",
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
			cart,
			promo,
			theme,
		} = this.props;

		let totalPrice = 0;
		cart.forEach(item => {totalPrice += item.price * item.quantity});
		promo.forEach(item => {totalPrice = totalPrice * item.discount / 100});

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<View style={styles.container}>
				<ScrollView style={{ flex: 1, backgroundColor: colors.background, }}>
					<LinearGradient
						colors={[colors.gradient.start, colors.gradient.end]}
						style={styles.headerContainer}
					>
						<View style={styles.header}>
							<TouchableOpacity
								onPress={() => this.props.navigation.openDrawer()}
								style={styles.headerIconContainer}
							>
								<Image
									source={require("../assets/img/menu.png")}
									style={styles.headerIcon}
								/>
							</TouchableOpacity>
							<AppText style={styles.screenTitle}>My Cart</AppText>
						</View>
					</LinearGradient>
					<View style={styles.itemsContainer}>
						{
							cart.map(item => (
								<TouchableOpacity
									key={`product${item.id}`}
									activeOpacity={0.8}
									style={styles.itemContainer}
									onPress={() => this.props.navigation.push("Product", { id: item.id })}
								>
									<View style={styles.left}>
										<View style={styles.imageContainer}>
											<Image
												source={{ uri: item.thumbnailSource }}
												style={styles.image}
												resizeMode="contain"
											/>
										</View>
									</View>
									<View style={styles.right}>
										<ProductQuantity
											product={item}
										/>
									</View>
								</TouchableOpacity>
							))
						}
					</View>
					<View style={styles.memoContainer}>
						<View style={styles.memoHeaderContainer}>
							<AppText style={styles.memoHeader}>Cart item</AppText>
							<AppText style={[styles.memoHeader, styles.priceHeader]}>Price</AppText>
						</View>
						{
							cart.map(item => (
								<View key={`memoRow${item.id}`} style={styles.memoRow}>
									<AppText
										style={styles.memoItemName}
										numberOfLines={1}
									>
										{item.title}
									</AppText>
									<AppText style={styles.memoItemQuantity}>x{item.quantity}</AppText>
									<AppText style={styles.memoItemPrice}>₹{item.price * item.quantity}</AppText>
								</View>
							))
						}
						<View style={styles.horizontalBar} />
						<View style={styles.totalContainer}>
							<AppText style={styles.totalLabel}>Total</AppText>
							<AppText style={styles.totalText}>₹{totalPrice}</AppText>
						</View>
						<ShippingAddress
							style={styles.shippingAddress}
							onChangeText={(text) => {this.setState({address: text})}}
							value={this.state.address}
						/>
						<PromoCode
							onChangeText={(text) => {this.setState({promo: text})}}
							value={this.state.promo}
						/>
					</View>
					<Button
						style={styles.submitButton}
						label="Confirm Order"
						onPress={() => this.onPurchase()}
					/>
				</ScrollView>
			</View>
		);
	}
}

const getStyles = (colors) => ({
	container: {
		flex: 1,
	},
	headerContainer: {
		justifyContent: "flex-start",
		height: 200 * Layout.ratio,
		paddingHorizontal: 20,
		paddingTop: Layout.statusBarHeight,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		height: 50 * Layout.ratio,
		marginTop: 10 * Layout.ratio,
	},
	headerIconContainer: {
		height: 26 * Layout.ratio,
		width: 26 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
	},
	headerIcon: {
		height: 26 * Layout.ratio,
		width: 26 * Layout.ratio,
		resizeMode: "contain",
	},
	screenTitle: {
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: colors.primaryTint,
		marginLeft: 16 * Layout.ratio,
		marginTop: -4,
	},

	itemsContainer: {
		marginTop: -100 * Layout.ratio,
		marginBottom: 10 * Layout.ratio,
		paddingHorizontal: 20 * Layout.ratio,
	},
	itemContainer: {
		flexDirection: "row",
		alignSelf: "stretch",
		paddingTop: 12,
		paddingHorizontal: 12,
		paddingBottom: 8,
		borderRadius: 8 * Layout.ratio,
		backgroundColor: colors.card,
		elevation: 4,
		marginBottom: 16 * Layout.ratio,
	},
	left: {
		justifyContent: "flex-start",
	},
	imageContainer: {
		height: 60 * Layout.ratio,
		width: 50 * Layout.ratio,
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		height: "100%",
		width: "100%",
		resizeMode: "contain",
	},
	right: {
		flex: 1,
	},

	memoContainer: {
		marginHorizontal: 20 * Layout.ratio,
		paddingTop: 10 * Layout.ratio,
		paddingHorizontal: 8 * Layout.ratio,
		paddingBottom: 14 * Layout.ratio,
		borderRadius: 5 * Layout.ratio,
		marginBottom: 26 * Layout.ratio,
		backgroundColor: colors.card,
		elevation: 4,
	},
	memoHeaderContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 7 * Layout.ratio,
		paddingHorizontal: 8 * Layout.ratio,
	},
	memoHeader: {
		fontSize: FontSize[16],
		color: colors.dim,
	},
	priceHeader: {
		marginLeft: "auto",
	},
	memoRow: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingHorizontal: 8 * Layout.ratio,
		marginBottom: 4 * Layout.ratio,
	},
	memoItemName: {
		flex: 1,
		fontSize: FontSize[18],
		fontWeight: "bold",
		color: colors.text,
	},
	memoItemQuantity: {
		fontSize: FontSize[14],
		color: colors.dim,
		marginLeft: 4 * Layout.ratio,
		marginRight: 23 * Layout.ratio,
	},
	memoItemPrice: {
		fontSize: FontSize[18],
		fontWeight: "bold",
		color: colors.text,
		marginLeft: "auto",
	},
	horizontalBar: {
		height: 1,
		backgroundColor: colors.dim,
		marginTop: 8 * Layout.ratio,
		marginBottom: 6 * Layout.ratio,
		marginHorizontal: 8 * Layout.ratio,
	},
	totalContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "flex-end",
		marginBottom: 20 * Layout.ratio,
	},
	totalLabel: {
		fontSize: FontSize[14],
		color: colors.dim,
		marginRight: 8 * Layout.ratio,
	},
	totalText: {
		fontSize: FontSize[18],
		fontWeight: "bold",
		color: colors.text,
	},

	shippingAddress: {
		marginBottom: 16 * Layout.ratio,
	},

	submitButton: {
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 20 * Layout.ratio,
	},
});

export default bind(CartScreen);