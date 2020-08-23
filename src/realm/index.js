import * as Realm from "realm";
import userSchema from "./userSchema";
import productSchema from "./productSchema";
import promoSchema from "./promoSchema";
import themeSchema from "./themeSchema";

function connect(cb) {
	Realm.open({
		schema: [userSchema, productSchema, promoSchema, themeSchema],
		schemaVersion: 6,
	}).then(cb);
}

export default connect;