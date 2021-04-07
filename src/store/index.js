import Vue from "vue";
import Vuex from "vuex";
import decode from "jwt-decode";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: null,
		usuario: false,
		componentes: {
			Cobrar: false,
			Imprimir: false,
		},
		limpiarData: {
			Home: false,
			Cobrar: false,
		},
	},
	mutations: {
		setToken(state, token) {
			state.token = token;
		},
		setUsuario(state, usuario) {
			state.usuario = usuario;
		},

		/* abrirCitasVue(){
		  this.state.CrudCitasVue= true;
			  },
		cerrarCitasVue(){
		  this.state.CrudCitasVue= false;
		},
		abrirPacientesVue(){
		  this.state.crudPaciente= true;
			  }, */
	},
	actions: {
		guardarToken({ commit }, token) {
			commit("setToken", token);
			commit("setUsuario", decode(token));
			localStorage.setItem("token", token);
		},
		autoLogin({ commit }) {
			let token = localStorage.getItem("token");
			if (token) {
				commit("setToken", token);
				commit("setUsuario", decode(token));
			}
		},
		salir({ commit }) {
			commit("setToken", null);
			commit("setUsuario", null);
			localStorage.removeItem("token");
			router.push({ name: "login" });
		},
	},
	modules: {},
});
