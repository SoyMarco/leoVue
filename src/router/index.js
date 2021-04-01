import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue"

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
	},
  {
		path: "/login",
		name: "login",
		component: Login,
	/* 	meta: {
			doctor: true,
		}, */
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

/* router.beforeEach((to, from, next) => {
	/* Primero se logguea para poder hacer las rutas */
/* 	store.dispatch("autoLogin");
	/* CON Login */
/* if (store.state.usuario) {
		if (to.matched.some((record) => record.meta.doctor)) {
			next();
		} else if (to.matched.some((record) => record.meta.libre)) {
			next();
		} else {
			/* Pagina no encontrada */
/* 	next({
				path: "/unknown",
			});
		}
		/* SIN Login */
/* 	} else if (to.matched.some((record) => record.meta.libre)) {
		next();
	} else if (to.matched.some((record) => record.meta.loguear)) {
		next();
	} else {
		/* Pagina no encontrada */
/* 	next({
			path: "/login",
		});
	}
}); */

export default router;
