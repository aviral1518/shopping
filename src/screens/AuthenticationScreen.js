import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions } from "react-native";

import SignupScreen from "./SignupScreen";
import LoginScreen from "./LoginScreen";

const Tab = createMaterialTopTabNavigator();

export default function AuthenticationScreen({ navigation, route }) {
	return (
		<Tab.Navigator
			tabBarPosition="top"
			tabBarOptions={{
				showIcon: false,
				showLabel: false,
			}}
			tabBar={props => null}
			initialRouteName="Login"
			backBehavior="initialRoute"
			lazy={false}
			keyboardDismissMode="auto"
			swipeEnabled={false}
			initialLayout={{ width: Dimensions.get("window").width }}
		>
			<Tab.Screen name="Signup" component={SignupScreen}/>
			<Tab.Screen name="Login" component={LoginScreen}/>
		</Tab.Navigator>
	);
}

