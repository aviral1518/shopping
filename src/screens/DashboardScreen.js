import React from "react";
import {
	ScrollView,
	View,
	TouchableOpacity,
	Image,
	Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import AppText from "../components/AppText";
import ProductItemGrid from "../components/ProductItemGrid";
import ProductItemList from "../components/ProductItemList";
import SortBy from "../components/Popups/SortBy";

import Layout from "../constants/Layout";
import theme, {lightTheme, darkTheme} from "../constants/Theme";
import FontSize from "../constants/FontSize";

import bind from "../redux/bind";

import { fetchProductList } from "../api";

const BOTTOM_TABBAR_HEIGHT = 50 * Layout.ratio;

class DashboardScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			left: [],
			right: [],
			sort: "",
			sortByOpen: false,
			page: 1,
			totalPages: 1,
			view: "GRID",
		};

		this.onClose = this.onClose.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	onClose() {
		this.setState({sortByOpen: false});
	}

	/*
	* Refreshes the page by fetching the product list again using API
	* */
	async refresh(sort, page) {
		this.setState({ left: [], right: [], items: [] });
		const res = await fetchProductList(sort, page);
		const totalPages = res.data.paging_data.total_pages;
		const items = res.data.items.map(item => ({
			id: item.product_id,
			name: item.name,
			description: item.description,
			price: item.price,
			discount: item.discount,
			thumbnail_image: item.images.split(",")[0],
		}));
		const left = items.filter((item, index) => (index % 2 === 0));
		const right = items.filter((item, index) => (index % 2 === 1));
		this.setState({totalPages, left, right, items});
	}

	componentDidMount() {
		this.refresh("", 1);
	}

	render() {
		const {
			cartLength,
			theme,
		} = this.props;

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
							<AppText style={styles.screenTitle}>Dashboard</AppText>
							<TouchableOpacity
								style={[styles.headerIconContainer, styles.myCartContainer]}
								onPress={() => this.props.navigation.jumpTo("Cart")}
							>
								<Image
									source={require("../assets/img/supermarket.png")}
									style={styles.headerIcon}
								/>
								<View style={styles.cartItemsCounterContainer}>
									<AppText style={styles.cartItemsCounterText}>{cartLength}</AppText>
								</View>
							</TouchableOpacity>
						</View>
					</LinearGradient>
					<View style={[styles.productsContainer, this.state.view === "GRID" ? {flexDirection: "row"} : {}]}>
					{
						this.state.view === "GRID" &&
						<>
						<View style={styles.containerLeft}>
							{
								this.state.left.map(item => (
									<ProductItemGrid
										key={item.id}
										navigation={this.props.navigation}
										style={styles.productItem}
										data={item}
									/>
								))
							}
						</View>
						<View style={styles.containerRight}>
							{
								this.state.right.map(item => (
									<ProductItemGrid
										key={item.id}
										navigation={this.props.navigation}
										style={styles.productItem}
										view={this.state.view}
										data={item}
									/>
								))
							}
						</View>
						</>
						}
						{
							this.state.view === "LIST" &&
							<View style={styles.containerList}>
								{
									this.state.items.map(item => (
										<ProductItemList
											key={item.id}
											navigation={this.props.navigation}
											style={styles.productItem}
											data={item}
										/>
									))
								}
							</View>
						}
					</View>
					<View style={styles.pagination}>
						{
							this.state.page > 1 &&
							<TouchableOpacity
								style={styles.paginationButton}
								onPress={() => {
									this.refresh(this.state.sort, this.state.page - 1);
									this.setState({page: this.state.page - 1});
								}}
							>
								<Image source={require("../assets/img/previous.png")} style={styles.paginationIcon}/>
								<AppText style={styles.paginationLabel}>Back</AppText>
							</TouchableOpacity>
						}
						<AppText style={styles.paginationCounter}>{this.state.page}</AppText>
						{
							this.state.page < this.state.totalPages &&
							<TouchableOpacity
								style={styles.paginationButton}
								onPress={() => {
									this.refresh(this.state.sort, this.state.page + 1);
									this.setState({ page: this.state.page + 1 });
								}}
							>
								<AppText style={styles.paginationLabel}>Next</AppText>
								<Image source={require("../assets/img/next.png")} style={styles.paginationIcon}/>
							</TouchableOpacity>
						}
					</View>
				</ScrollView>
				<LinearGradient
					colors={[colors.gradient.end, colors.gradient.start]}
					style={styles.bottomTabBar}
				>
					<TouchableOpacity
						style={styles.sortButton}
						onPress={() => this.setState({sortByOpen: true})}
					>
						<Image source={require("../assets/img/sort.png")} style={styles.sortIcon}/>
						<AppText style={styles.sortLabel}>Sort</AppText>
						<Modal
							animationType="fade"
							transparent={true}
							visible={this.state.sortByOpen}
							onRequestClose={() => this.onClose()}
							onDismiss={() => this.onClose()}
						>
							<SortBy
								sort={this.state.sort}
								title="Sort products"
								onClose={this.onClose}
								priceAscending={() => {
									this.setState({sort: "price_asc"});
									this.refresh("price_asc", this.state.page);
								}}
								priceDescending={() => {
									this.setState({ sort: "price_desc" });
									this.refresh("price_desc", this.state.page);
								}}
								clearSort={() => {
									this.setState({ sort: "" });
									this.refresh("", this.state.page);
								}}
							/>
						</Modal>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.viewButton,
							styles.gridViewButton,
							this.state.view === "GRID" ? styles.viewButtonSelected : styles.viewButtonUnselected,
						]}
						onPress={() => this.setState({ view: "GRID" })}
					>
						<Image source={require("../assets/img/grid-view.png")} style={styles.viewIcon}/>
						{
							this.state.view === "GRID" &&
							<AppText style={styles.viewLabel}>Grid View</AppText>
						}
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.viewButton,
							this.state.view === "LIST" ? styles.viewButtonSelected : styles.viewButtonUnselected,
						]}
						onPress={() => this.setState({view: "LIST"})}
					>
						<Image source={require("../assets/img/list-view.png")} style={styles.viewIcon}/>
						{
							this.state.view === "LIST" &&
							<AppText style={styles.viewLabel}>List View</AppText>
						}
					</TouchableOpacity>
				</LinearGradient>
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
		height: 300 * Layout.ratio,
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
	myCartContainer: {
		marginLeft: "auto",
	},
	cartItemsCounterContainer: {
		position: "absolute",
		top: -6 * Layout.ratio,
		right: -7 * Layout.ratio,
		height: 18 * Layout.ratio,
		width: 18 * Layout.ratio,
		borderRadius: 18 / 2 * Layout.ratio,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.primaryTintDim,
	},
	cartItemsCounterText: {
		fontSize: FontSize[10],
		fontWeight: "bold",
		color: colors.primaryTintText,
	},
	screenTitle: {
		fontSize: FontSize[30],
		fontWeight: "bold",
		color: colors.primaryTint,
		marginLeft: 16 * Layout.ratio,
		marginTop: -4,
	},

	productsContainer: {
		marginTop: -200 * Layout.ratio,
		paddingHorizontal: 20,
	},
	containerLeft: {
		flex: 1,
		marginRight: 12,
	},
	containerRight: {
		flex: 1,
		paddingTop: 20 * Layout.ratio,
	},
	containerList: {
		flex: 1,
	},
	productItem: {
		marginBottom: 20 * Layout.ratio,
	},

	pagination: {
		alignSelf: "center",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: BOTTOM_TABBAR_HEIGHT + 20 * Layout.ratio,
	},
	paginationButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	paginationIcon: {
		width: 5,
		height: 9,
		marginHorizontal: 6 * Layout.ratio,
		marginTop: 2 * Layout.ratio,
	},
	paginationLabel: {
		fontSize: FontSize[7],
		color: colors.text,
	},
	paginationCounter: {
		fontSize: FontSize[10],
		color: colors.text,
		marginHorizontal: 8 * Layout.ratio,
	},

	bottomTabBar: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: BOTTOM_TABBAR_HEIGHT * Layout.ratio,
		borderTopLeftRadius: 14 * Layout.ratio,
		borderTopRightRadius: 14 * Layout.ratio,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
	},

	sortButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	sortIcon: {
		height: 16 * Layout.ratio,
		width: 13 * Layout.ratio,
		marginRight: 5 * Layout.ratio,
	},
	sortLabel: {
		fontSize: FontSize[16],
		fontWeight: "bold",
		color: colors.primaryTint,
	},
	viewButton: {
		flexDirection: "row",
		alignItems: "center",
		height: 26 * Layout.ratio,
		borderRadius: 13 * Layout.ratio,
		borderWidth: 1,
	},
	viewButtonSelected: {
		borderColor: colors.primaryTint,
		paddingLeft: 11 * Layout.ratio,
		paddingRight: 6 * Layout.ratio,
	},
	viewButtonUnselected: {
		borderColor: "transparent",
		paddingLeft: 0,
		paddingRight: 0,
	},
	gridViewButton: {
		marginLeft: "auto",
		marginRight: 8 * Layout.ratio,
	},
	viewIcon: {
		height: 16 * Layout.ratio,
		width: 16 * Layout.ratio,
	},
	viewLabel: {
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: colors.primaryTint,
		marginLeft: 5 * Layout.ratio,
	},
});

export default bind(DashboardScreen);