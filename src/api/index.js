const domain = "https://preprod.vestigebestdeals.com/api/rest";

async function fetchProductList(sort, page) {
	const response = await fetch(`${domain}/dynamickittingproductlistwithfiltersortwarehouse`, {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"category_id": 13,  // hardcoded
			"filter": "", //hardcoded
			"page_num": page,
			"sort": sort,
			"customer_id": 96,  // hardcoded
			"wcode": "DWK,HWH,S71"  // hardcoded
		})
	});
	return await response.json();
}

async function fetchProductDetails(id) {
	const response = await fetch(`${domain}/productdetails`, {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"product_id": id,
			"customer_id": 96,  // hardcoded
			"wcode": "DWK,HWH,S71"  // hardcoded
		})
	});
	return await response.json();
}

async function fetchProductReviews(id) {
	const response = await fetch(`${domain}/getreview/productId/${id}`, {
		method: "GET",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	});
	const json = await response.json();
	if (json.data.reviewCount === 0) json.data.reviewlist = [];
	return json;
}

export { fetchProductList, fetchProductDetails, fetchProductReviews };