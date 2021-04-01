import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import es from "vuetify/lib/locale/es";
import "material-design-icons-iconfont/dist/material-design-icons.css"; // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		options: {
			customProperties: true,
		},
		themes: {
			light: {
				primary: "#000058",
				secondary: "#424242",
				accent: "#82B1FF",
				error: "#FF5252",
				info: "#2196F3",
				success: "#4CAF50",
				warning: "#FFC107",
			},
		},
	},
	lang: {
		locales: { es },
		current: "es",
	},
	icons: {
		iconfont:
			"mdiSvg" || "fa" || "mdiSvg" || "md" || "mdiSvg" || "fa4" || "faSvg",
	},
});