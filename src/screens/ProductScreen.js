import React from "react";
import {
	ScrollView,
	View,
	TouchableOpacity,
	Image,
	Modal,
	Share,
	Alert,
} from "react-native";
import AutoHeightWebView from "react-native-autoheight-webview";
import LinearGradient from "react-native-linear-gradient";

import AppText from "../components/AppText";
import AddToCart from "../components/Popups/AddToCart";
import BuyNow from "../components/Popups/BuyNow";

import Layout from "../constants/Layout";
import { lightTheme, darkTheme } from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";

import { fetchProductDetails, fetchProductReviews } from "../api";

class ProductScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedThumbnailIndex: 0,
			addedToCart: false,
			id: "",
			name: "",
			description: "",
			price: "",
			discount: "",
			thumbnail_images: [],
			reviews: [],
			addToCartPopupOpen: false,
			buyNowPopup: false,
		};

		this.onClose = this.onClose.bind(this);
		this.onShare = this.onShare.bind(this);
	}

	componentDidMount() {
		this.refresh();
	}

	onClose() {
		this.setState({ addToCartPopupOpen: false, buyNowPopup: false });
	}

	async onShare() {
		try {
			await Share.share({
				message: "" +
				         "Hey!\n" +
				         "Check out this awesome product:\n\n" +
				         "Name: " + this.state.name + "\n" +
				         "Price: " + this.state.price,
			});
		}
		catch (error) {
			Alert.alert("Error", "Failed to share product.");
			console.log("Failed to share:", error);
		}
	};

	async refresh() {
		let res = await fetchProductDetails(this.props.route.params.id);
		const item = {
			id: res.data.product_id,
			name: res.data.name,
			description: res.data.description,
			price: res.data.price,
			discount: res.data.discount,
			thumbnail_images: res.data.app_image,
		};

		res = await fetchProductReviews(this.props.route.params.id);
		const reviews = res.data.reviewlist.map(review => ({
			name: review.nickname,
			content: review.detail,
		}));

		this.setState({ ...item, reviews });
	}

	render() {
		const { theme } = this.props;

		const colors = theme === "LIGHT" ? lightTheme : darkTheme;
		const styles = getStyles(colors);

		return (
			<View style={styles.container}>
				<ScrollView style={{ flex: 1, backgroundColor: colors.bright, }}>
					<LinearGradient
						colors={[colors.gradient.start, colors.gradient.end]}
						style={styles.headerContainer}
					>
						<View style={styles.header}>
							<TouchableOpacity
								style={styles.backButton}
								onPress={() => this.props.navigation.goBack()}
							>
								<Image source={require("../assets/img/back.png")} style={styles.backIcon}/>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.headerIconContainer, styles.myCartContainer]}
								onPress={() => this.props.navigation.navigate("Cart")}
							>
								<Image
									source={require("../assets/img/supermarket.png")}
									style={styles.headerIcon}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.shareButton}
								onPress={() => this.onShare()}
							>
								<Image source={require("../assets/img/share.png")} style={styles.shareIcon}/>
							</TouchableOpacity>
						</View>
						<Image
							source={{ uri: this.state.thumbnail_images[this.state.selectedThumbnailIndex] }}
							style={styles.primaryThumbnail}
						/>
						<ScrollView horizontal={true}>
							{
								this.state.thumbnail_images.map((imageURL, index) => (
									<TouchableOpacity
										key={`thumbnail${index}`}
										onPress={() => this.setState({ selectedThumbnailIndex: index })}
									>
										<Image
											source={{ uri: imageURL }}
											style={styles.secondaryThumbnail}
										/>
									</TouchableOpacity>
								))
							}
						</ScrollView>
					</LinearGradient>
					<View style={styles.informationContainer}>
						<AppText style={styles.itemName}>{this.state.name}</AppText>
						<AutoHeightWebView
							style={styles.itemDescription}
							source={{ html: this.state.description }}
							customStyle={`
								* {
									color: ${colors.text};
								}
						    `}
						/>
						<View style={styles.priceDetailsContainer}>
							<View style={[styles.priceInfoContainer, styles.price]}>
								<View style={styles.priceInfo}>
									<AppText style={styles.priceLabel}>Price</AppText>
									<AppText style={styles.priceText}>₹{this.state.price}</AppText>
								</View>
							</View>
							<View style={styles.priceInfoContainer}>
								<View style={styles.priceInfo}>
									<AppText style={styles.priceText}>{this.state.discount}%</AppText>
									<AppText style={styles.priceLabel}>Off</AppText>
								</View>
							</View>
						</View>
						<View style={styles.buttonsContainer}>
							<LinearGradient
								colors={[colors.gradient.start, colors.gradient.end]}
								style={[styles.buttonContainer, styles.cartButton]}
							>
								<TouchableOpacity
									style={styles.buttonResponser}
									onPress={() => this.setState({ addToCartPopupOpen: true })}
								>
									<AppText style={styles.buttonLabel}>Add to cart</AppText>
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
												id: this.state.id,
												thumbnailSource: this.state.thumbnail_images[0],
												title: this.state.name,
												description: this.state.description,
												discount: this.state.description,
												price: this.state.price,
											}}
										/>
									</Modal>
								</TouchableOpacity>
							</LinearGradient>
							<LinearGradient
								colors={[colors.gradient.start, colors.gradient.end]}
								style={styles.buttonContainer}
							>
								<TouchableOpacity
									style={styles.buttonResponser}
									onPress={() => this.setState({ buyNowPopup: true })}
								>
									<AppText style={styles.buttonLabel}>Buy now</AppText>
									<Modal
										animationType="fade"
										transparent={true}
										visible={this.state.buyNowPopup}
										onRequestClose={() => this.onClose()}
										onDismiss={() => this.onClose()}
									>
										<BuyNow
											title="Buy this item now"
											onClose={this.onClose}
											product={{
												id: this.state.id,
												thumbnailSource: this.state.thumbnail_images[0],
												title: this.state.name,
												description: this.state.description,
												discount: this.state.description,
												price: this.state.price,
											}}
										/>
									</Modal>
								</TouchableOpacity>
							</LinearGradient>
						</View>
					</View>
					<View style={styles.reviewSectionHeader}>
						<AppText style={styles.reviewSectionTitle}>Reviews</AppText>
						<AppText style={styles.reviewSectionSubtitle}>{this.state.reviews.length}</AppText>
					</View>
					{
						this.state.reviews.map((review, index) => (
							<View
								key={`review${index}`}
								style={styles.reviewContainer}
							>
								<View style={styles.reviewHeader}>
									<View style={styles.reviewAvatarContainer}>
										<Image
											source={require("../assets/img/avatar-placeholder.png")}
											style={styles.reviewAvatar}
										/>
									</View>
									<AppText style={styles.reviewName}>{review.name}</AppText>
								</View>
								<AppText style={styles.reviewDescription}>{review.content}</AppText>
							</View>
						))
					}
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
		alignItems: "center",
		height: 400 * Layout.ratio,
		paddingHorizontal: 20,
		paddingTop: Layout.statusBarHeight,
	},
	headerIconContainer: {
		height: 26 * Layout.ratio,
		width: 26 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		height: 50 * Layout.ratio,
	},
	backIcon: {
		height: 20 * Layout.ratio,
		width: 24 * Layout.ratio,
	},
	shareButton: {
		marginLeft: "auto",
	},
	shareIcon: {
		height: 20 * Layout.ratio,
		width: 19 * Layout.ratio,
	},

	primaryThumbnail: {
		width: 150 * Layout.ratio,
		height: 200 * Layout.ratio,
		resizeMode: "contain",
	},
	secondaryThumbnail: {
		width: 40 * Layout.ratio,
		height: 55 * Layout.ratio,
		resizeMode: "contain",
		marginHorizontal: 4 * Layout.ratio,
	},

	informationContainer: {
		paddingTop: 15 * Layout.ratio,
		paddingHorizontal: 20 * Layout.ratio,
		paddingBottom: 12 * Layout.ratio,
		borderRadius: 5 * Layout.ratio,
		marginTop: -60 * Layout.ratio,
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 26 * Layout.ratio,
		backgroundColor: colors.card,
		elevation: 4,
		zIndex: 1,
	},
	itemName: {
		fontSize: FontSize[22],
		fontWeight: "bold",
		color: colors.text,
		marginBottom: 6 * Layout.ratio,
	},
	itemDescription: {
		marginBottom: 20 * Layout.ratio,
		width: "100%",
	},
	priceDetailsContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 5 * Layout.ratio,
		borderWidth: 1,
		borderColor: colors.dim,
		paddingVertical: 8 * Layout.ratio,
		marginBottom: 12 * Layout.ratio,
	},
	priceInfoContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	price: {
		borderRightWidth: 1,
		borderRightColor: colors.dim,
	},
	priceInfo: {
		alignItems: "flex-start",
	},
	priceLabel: {
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: colors.dim,
	},
	priceText: {
		fontSize: FontSize[20],
		fontWeight: "bold",
		color: colors.text,
	},

	reviewSectionHeader: {
		flexDirection: "row",
		alignItems: "flex-end",
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 12 * Layout.ratio,
	},
	reviewSectionTitle: {
		fontSize: FontSize[22],
		fontWeight: "bold",
		color: colors.text,
		marginRight: 6 * Layout.ratio,
	},
	reviewSectionSubtitle: {
		fontSize: FontSize[16],
		color: colors.dim,
	},

	reviewContainer: {
		marginHorizontal: 20 * Layout.ratio,
		marginBottom: 16 * Layout.ratio,
	},
	reviewHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4 * Layout.ratio,
	},
	reviewAvatarContainer: {
		width: 37 * Layout.ratio,
		justifyContent: "flex-start",
		alignItems: "flex-start",
	},
	reviewAvatar: {
		height: 25 * Layout.ratio,
		width: 25 * Layout.ratio,
		resizeMode: "contain",
	},
	reviewName: {
		fontSize: FontSize[18],
		fontWeight: "bold",
		color: colors.text,
	},
	reviewDescription: {
		marginLeft: 37 * Layout.ratio,
		fontSize: FontSize[15],
		color: colors.text,
	},

	buttonsContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	buttonContainer: {
		flex: 1,
		height: 35 * Layout.ratio,
		borderRadius: 35 / 2 * Layout.ratio,
	},
	cartButton: {
		marginRight: 14 * Layout.ratio,
	},
	buttonResponser: {
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonLabel: {
		fontSize: FontSize[14],
		fontWeight: "bold",
		color: colors.primaryTint,
	},
	myCartContainer: {
		marginLeft: "auto",
	},
});

export default bind(ProductScreen);