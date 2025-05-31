import color from "color-string";


const isColor = (val: string) => {
	try {
		return color.get(val) != null;
	}
	catch {
		return false;
	}
};

const V = {
	isColor
};

export default V;
