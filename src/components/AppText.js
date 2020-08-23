import React from "react";
import { Text } from "react-native";

const AppText = ({ style, children, bold, ...props }) => {
	let fontWeightBold = false;
	if (Array.isArray(style)) style.forEach(item => {
		fontWeightBold = fontWeightBold || (item?.fontWeight === "bold" || item?.fontWeight >= 500);
	});
	else if (style?.fontWeight) fontWeightBold = (style.fontWeight === "bold" || style.fontWeight >= 500);

	const baseStyle = {
		fontFamily:"Roboto",
	};
	let newStyle;
	if (Array.isArray(style)) newStyle = [baseStyle, ...style];
	else newStyle = [baseStyle, style];

	return (
		<Text {...props} allowFontScaling={false} style={newStyle}>
			{children}
		</Text>
	);
};

export default AppText;