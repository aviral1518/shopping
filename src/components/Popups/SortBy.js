/*
 * Component which is rendered inside the `Sort` Popup in `Dashboard` screen
 * */

import * as React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";

import AppText from "../AppText";

import Layout from "../../constants/Layout";
import {lightTheme, darkTheme} from "../../constants/Theme";
import FontSize from "../../constants/FontSize";

import bind from "../../redux/bind";

const WIDTH = 300 * Layout.ratio;

class SortBy extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			sort: "",
		};
	}

	componentDidMount() {
		const { sort = "" } = this.props;
		this.setState({ sort });
	}

	render() {
		const {
			style,
			title,
			onClose,
			priceAscending,
			priceDescending,
			clearSort,
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

					<TouchableOpacity
						style={[styles.optionContainer,
						        this.state.sort === "price_asc" ? styles.optionContainerSelected : {}]}
						onPress={() => {
							priceAscending();
							this.setState({ sort: "price_asc" });
							onClose();
						}}
					>
						<AppText style={[styles.optionTitle, this.state.sort === "price_asc" ? styles.optionTitleSelected : {}]}>
							Ascending
						</AppText>
						<AppText
							style={[styles.optionText, this.state.sort === "price_asc" ? styles.optionTextSelected : {}]}>

						Sort products from low to high according to price 
						</AppText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.optionContainer,
						        this.state.sort === "price_desc" ? styles.optionContainerSelected : {}]}
						onPress={() => {
							priceDescending();
							this.setState({ sort: "price_desc" });
							onClose();
						}}
					>
						<AppText
							style={[styles.optionTitle, this.state.sort === "price_desc" ? styles.optionTitleSelected : {}]}>
							Descending
						</AppText>
						<AppText
							style={[styles.optionText, this.state.sort === "price_desc" ? styles.optionTextSelected : {}]}>
							Sort products from high to low according to price 
						</AppText>
					</TouchableOpacity>

					<View style={styles.footer}>
						<AppText
							style={styles.negativeButtonLabel}
							onPress={() => {
								clearSort();
								this.setState({ sort: "" });
								onClose();
							}}
						>
							Clear sort
						</AppText>
						<AppText
							style={styles.affirmativeButtonLabel}
							onPress={onClose}
						>
							Done
						</AppText>
					</View>
				</View>
			</View>
		);
	}
}

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
		backgroundColor: colors.bright,
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
		marginBottom: 15 * Layout.ratio,
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

	optionContainer: {
		paddingVertical: 4 * Layout.ratio,
		paddingHorizontal: 8 * Layout.ratio,
		marginBottom: 6 * Layout.ratio,
		borderRadius: 6.5 * Layout.ratio,
	},
	optionContainerSelected: {
		backgroundColor: colors.primary,
	},
	optionTitle: {
		fontSize: FontSize[12],
		fontWeight: "bold",
		color: colors.text,
	},
	optionTitleSelected: {
		color: colors.primaryTint,
	},
	optionText: {
		fontSize: FontSize[10],
		color: colors.text,
	},
	optionTextSelected: {
		color: colors.primaryTint,
	},

	footer: {
		flexDirection: "row",
		marginTop: 8 * Layout.ratio,
	},
	negativeButtonLabel: {
		fontSize: FontSize[13],
		color: colors.danger,
	},
	affirmativeButtonLabel: {
		marginLeft: "auto",
		fontSize: FontSize[13],
		color: colors.primary,
	},
});

export default bind(SortBy);