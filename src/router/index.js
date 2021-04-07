import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store/index'
import Home from "../views/Home.vue";
import Login from "../views/Login.vue"
import Print from "../components/Imprimir.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		meta: {
			admin: true,
		},
	},
	{
		path: "/login",
		name: "login",
		component: Login,
		meta: {
			libre: true,
		},
	},
	{
		path: "/print",
		name: "print",
		component: Print,
		meta: {
			libre: true,
		},
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	/* Primero se logguea para poder hacer las rutas */
 	store.dispatch("autoLogin");
	/* CON Login */
 if (store.state.usuario && store.state.usuario.puesto === "admin") {
		if (to.matched.some((record) => record.meta.admin)) {
			next();
		} else if (to.matched.some((record) => record.meta.libre)) {
			next();
		} else {
			/* Pagina no encontrada */
 	next({
				path: "/unknown",
			});
		}
		/* SIN Login */
	} else if (to.matched.some((record) => record.meta.libre)) {
		next();
	} else if (to.matched.some((record) => record.meta.loguear)) {
		next();
	} else {
		/* Pagina no encontrada */
	next({
			path: "/login",
		});
	}
}); 

export default router;
