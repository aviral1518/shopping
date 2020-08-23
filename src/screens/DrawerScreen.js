import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Image, TouchableOpacity,Alert } from "react-native";

import AppText from "../components/AppText";
import UserAvatar from "../components/UserAvatar";

import Layout from "../constants/Layout";
import {lightTheme, darkTheme} from "../constants/Theme";
import FontSize from "../constants/FontSize";

import realmConnect from "../realm";
import bind from "../redux/bind";

import DashboardScreen from "./DashboardScreen";
import CartScreen from "./CartScreen";

const Drawer = createDrawerNavigator();

const CustomDrawerSidebar = bind((props) => {
	const {
		state,
		navigation,
		descriptors,
		progress,
		user,
		authenticateUser,
		updateCart,
		updatePromo,
		theme,
		updateTheme,
	} = props;
	const { routes, index } = state;
	const routeName = routes[index].name;

	const colors = theme === "LIGHT" ? lightTheme : darkTheme;
	const styles = getStyles(colors);

	return (
		<View style={styles.drawerContainer}>
			<TouchableOpacity
				onPress={() => navigation.push("Profile")}
				style={styles.drawerHeader}
			>
				<View style={styles.headerLeft}>
					<UserAvatar
						style={styles.avatar}
						dimension={60 * Layout.ratio}
					/>
				</View>
				<View style={styles.headerRight}>
					<AppText
						style={styles.name}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{user.name}
					</AppText>
					<AppText
						style={styles.email}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{user.email}
					</AppText>
				</View>
			</TouchableOpacity>
			<View style={styles.horizontalBar}/>
			<TouchableOpacity
				style={[
					styles.itemContainer,
					routeName === "Dashboard" ? styles.itemContainerSelected : {},
				]}
				onPress={() => navigation.jumpTo("Dashboard")}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={
							require("../assets/img/dashboard.png")
						}
						style={[styles.itemIcon]}
					/>
				</View>
				<AppText style={[
					styles.itemLabel,
					routeName === "Dashboard" ? styles.itemLabelSelected : {},
				]}>Dashboard</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={[
					styles.itemContainer,
					routeName === "Cart" ? styles.itemContainerSelected : {},
				]}
				onPress={() => navigation.jumpTo("Cart")}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={
							require("../assets/img/supermarket.png")
						}
						style={[styles.itemIcon]}
					/>
				</View>
				<AppText style={[
					styles.itemLabel,
					routeName === "Cart" ? styles.itemLabelSelected : {},
				]}>My cart</AppText>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.itemContainer}
				onPress={() => {
					const userEmail = user.email;
					realmConnect(realm => {
						realm.write(() => {
							let findUser = realm.objects("User").filtered(`email = "${userEmail}"`);
							const user = findUser[0];
							user.isSignedIn = false;
						});
					});
					authenticateUser({
						signInMethod: "EMAIL",
						avatarSource: "",
						name: "",
						nameAbbr: "",
						phone: "",
						email: "",
						password: "",
						cart: [],
						promo: [],
					});
					updateCart([]);
					updatePromo([]);
					Alert.alert("Logout","You've been Logout.")
					setTimeout(() => navigation.navigate("Authentication"), 500);
				}}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={require("../assets/img/logout.png")}
						style={[styles.itemIcon, styles.logoutIcon]}
					/>
				</View>
				<AppText style={styles.itemLabel}>Log out</AppText>
			</TouchableOpacity>
			<View style={styles.horizontalBar}/>
			<TouchableOpacity
				style={styles.itemContainer}
				onPress={() => {
					const newTheme = theme === "LIGHT" ? "DARK" : "LIGHT";

					realmConnect(realm => {
						realm.write(() => {
							let checkTheme = realm.objects("Theme");
							if (!checkTheme.length) {
								realm.create("Theme", {
									template: newTheme,
								});
							}
							else checkTheme[0].template = newTheme;

							updateTheme(newTheme);
						});
					});
				}}
			>
				<View style={styles.itemIconContainer}>
					<Image
						source={
							require("../assets/img/theme.png") 
						}
						style={styles.itemIcon}
					/>
				</View>
				<AppText style={styles.itemLabel}>Switch to Dark Theme</AppText>
			</TouchableOpacity>
		</View>
	);
});

export default function DrawerScreen({ navigation, route }) {
	return (
		<Drawer.Navigator
			initialRouteName="Dashboard"
			backBehavior="initialRoute"
			drawerPosition="left"
			drawerType="front"
			lazy={true}
			hideStatusBar={false}
			drawerStyle={{
				width: "80%",
			}}
			drawerContent={(props) => <CustomDrawerSidebar {...props}/>}
		>
			<Drawer.Screen name="Dashboard" component={DashboardScreen}/>
			<Drawer.Screen name="Cart" component={CartScreen}/>
		</Drawer.Navigator>
	);
}

const getStyles = (colors) => ({
	drawerContainer: {
		flex: 1,
		paddingVertical: 24 * Layout.ratio,
		paddingHorizontal: 20,
		backgroundColor: colors.bright,
	},
	drawerHeader: {
		flexDirection: "row",
		marginBottom: 24 * Layout.ratio,
	},
	headerLeft: {
		alignSelf: "stretch",
		justifyContent: "flex-start",
	},
	avatar: {
		marginRight: 16 * Layout.ratio,
	},
	headerRight: {
		flex: 1,
		alignSelf: "stretch",
		justifyContent: "flex-start",
	},
	name: {
		fontSize: FontSize[22],
		fontWeight: "bold",
		color: colors.text,
	},
	email: {
		fontSize: FontSize[16],
		color: colors.text,
	},

	horizontalBar: {
		alignSelf: "stretch",
		height: 1,
		marginBottom: 20 * Layout.ratio,
		backgroundColor: colors.dim,
	},

	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		height: 50 * Layout.ratio,
		borderRadius: 5 * Layout.ratio,
		marginBottom: 8 * Layout.ratio,
	},
	itemContainerSelected: {
		backgroundColor: colors.primary + "25",
	},
	itemIconContainer: {
		height: "100%",
		width: 60 * Layout.ratio,
		alignItems: "center",
		justifyContent: "center",
	},
	itemIcon: {
		width: 26 * Layout.ratio,
		resizeMode: "contain",
	},
	logoutIcon: {
		width: 24,
		marginLeft: 6,
	},
	itemLabel: {
		fontSize: FontSize[20],
		fontWeight: "bold",
		color: colors.text,
	},
	itemLabelSelected: {
		color: colors.primary,
	},
});