import { Dimensions } from "react-native";
import { StatusBar } from 'react-native';

const ratio = 1; 
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
	ratio,
	window: {
		width,
		height,
	},
	statusBarHeight: StatusBar.currentHeight,
};
