export function saveToLocal(id,key,val) {
	var seller = window.localStorage._seller_;
	if(!seller) {
		seller = {};
		seller[id] = {};
	} else {
		seller=JSON.parse(seller);
		if(!seller[id]) {
			seller[id] = {}
		}
	}
	seller[id][key] = val;
	window.localStorage._seller_  = JSON.stringify(seller);
}

export function loadFromLocal(id,key,def) {
	var seller = window.localStorage._seller_;
	if(!seller) {
		return def
	}
	seller = JSON.parse(seller)[id];
	if(!seller) {
		return def
	}
	var ret = seller[key];
	return ret || def
}
