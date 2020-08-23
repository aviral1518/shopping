/*
* This component is used to render the products in the `Dashboard` page when `Grid` view is active
* */

import React from "react";
import {
	TouchableOpacity,
	View,
	Image,
	Modal,
} from "react-native";

import AppText from "./AppText";
import AddToCart from "../components/Popups/AddToCart";

import Layout from "../constants/Layout";
import {lightTheme, darkTheme} from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";

class ProductItemGrid extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			addToCartPopupOpen: false,
		};

		this.onClose = this.onClose.bind(this);
	}

	onClose() {
		this.setState({ addToCartPopupOpen: false, buyNowPopup: false });
	}

	render() {
		const {
			navigation,
			style,
			data,
			theme,
		} = this.props;

		const {
			id,
			name,
			description,
			price,
			discount,
			thumbnail_image,
		} = data;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
             <TouchableOpacity
	             activeOpacity={0.8}
	             style={[styles.container, style]}
	             onPress={() => navigation.push("Product", {id})}
             >
	             <TouchableOpacity
		             style={styles.cartButton}
		             onPress={() => this.setState({ addToCartPopupOpen: true })}
	             >
		             <Image source={require("../assets/img/shopping-cart-add.png")} style={styles.cartIcon}/>
		             <Modal
			             animationType="fade"
			             transparent={true}
			             visible={this.state.addToCartPopupOpen}
			             onRequestClose={() => this.onClose()}
			             onDismiss={() => this.onClose()}
		             >
			             <AddToCart
				             title="Add this item to your cart"
				             onClose={this.onClose}
				             onAddToCart={() => {}}
				             product={{
							     id,
					             thumbnailSource: thumbnail_image,
					             title: name,
					             description,
					             discount: discount.toString(),
					             price,
				             }}
			             />
		             </Modal>
	             </TouchableOpacity>
	             <View style={styles.imageContainer}>
		             <Image
			             source={{uri: thumbnail_image}}
			             style={styles.image}
			             resizeMode="contain"
		             />
	             </View>
	             <AppText style={styles.name}>{name}</AppText>
	             <AppText style={styles.description}>{description}</AppText>
	             <View>
		             <View style={styles.footerRow}>
			             <View style={styles.footerInfo}>
				             <AppText style={styles.footerLabel}>Price</AppText>
				             <AppText style={styles.footerText}>₹{price}</AppText>
			             </View>
			             <View style={[styles.footerInfo, styles.discountContainer]}>
				             <AppText style={styles.footerText}>{discount}%</AppText>
				             <AppText style={styles.footerLabel}>Off</AppText>
			             </View>
		             </View>
	             </View>
             </TouchableOpacity>
		);
	}
}

const getStyles = (colors) => ({
	container: {
		alignSelf: "stretch",
		paddingTop: 10,
		paddingHorizontal: 10,
		paddingBottom: 10,
		borderRadius: 13 * Layout.ratio,
		backgroundColor: colors.card,
		elevation: 4,
	},
	imageContainer: {
		marginHorizontal: 10,
		marginBottom: 16 * Layout.ratio,
	},
	image: {
		height: 200 * Layout.ratio,
		width: "100%",
	},
	name: {
		fontSize: FontSize[14],
		fontWeight: "bold",
		color: colors.text,
		marginBottom: 6 * Layout.ratio,
	},
	description: {
		alignSelf: "stretch",
		fontSize: FontSize[10],
		color: colors.dim,
		marginBottom: 10 * Layout.ratio,
	},
	footerRow: {
		flexDirection: "row",
	},
	footerInfo: {
		alignItems: "flex-start",
	},
	footerLabel: {
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: colors.dim,
	},
	footerText: {
		fontSize: FontSize[20],
		fontWeight: "bold",
		color: colors.text,
	},
	discountContainer: {
		marginLeft: "auto",
	},
	cartButton: {
		marginLeft: "auto",
	},
	cartIcon: {
		height: 20,
		width: 20,
		resizeMode: "contain",
	},
});

export default bind(ProductItemGrid);