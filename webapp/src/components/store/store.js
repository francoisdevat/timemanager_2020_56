import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { API_URL } from "../services/constants";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    teams: [],
    hours: [],
    userhours: [],
    teamhours: [],
    specifichours: [],
    clocks: [],
    all_users: [],
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success_token(state, token) {
      state.status = "success";
      state.token = token;
    },
    auth_success_user(state, my_user) {
      state.status = "success";
      state.user = my_user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
    teams_success(state, teams) {
      state.status = "success";
      state.teams = teams;
    },
    user_hours_success(state, userhours) {
      state.status = "success";
      state.userhours = userhours;
    },
    hours_success(state, hours) {
      state.status = "success";
      state.hours = hours;
    },
    team_hours_success(state, teamhours) {
      state.status = "success";
      state.teamhours = teamhours;
    },
    specific_hours_success(state, specifichours) {
      state.status = "success";
      state.specifichours = specifichours;
    },
    clocks_success(state, clocks) {
      state.status = "success";
      state.clocks = clocks;
    },
    all_users_success(state, all_users) {
      state.status = "success";
      state.all_users = all_users;
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({ url: API_URL + "/login", data: user, method: "POST" })
          .then((resp) => {
            const token = resp.data.jwt;
            localStorage.setItem("token", token);
            commit("auth_success_token", token);
            axios
              .get(API_URL + "/my_user", {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                const my_user = response.data;
                commit("auth_success_user", my_user);
              });
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    register({ commit }, donnees) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios
          .post(API_URL + "/users", {
            user: donnees,
          })
          .then((resp) => {
            const token = resp.data.jwt;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = token;

            axios
              .get(API_URL + "/my_user", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                const user = response.data;
                commit("auth_success", token, user);
                resolve(response);
              });
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    getallusers({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: API_URL + "/users",
          method: "GET",
        })
          .then((resp) => {
            const all_users = resp.data;
            commit("all_users_success", all_users);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    getallteams({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: API_URL + "/teams",
          method: "GET",
        })
          .then((resp) => {
            const teams = resp.data;
            commit("teams_success", teams);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            reject(err);
          });
      });
    },
    getallhours({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: API_URL + "/hours",
          method: "GET",
        })
          .then((resp) => {
            const hours = resp.data;
            commit("hours_success", hours);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            reject(err);
          });
      });
    },
    getspecifichours({ commit }, time) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: API_URL + `/hour?start=${time.starttime}&end=${time.starttime}`,
          method: "GET",
        })
          .then((resp) => {
            const specifichours = resp.data;
            commit("specific_hours_success", specifichours);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            reject(err);
          });
      });
    },
    getuserhours({ commit }, user_id) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: API_URL + "/myhours" + user_id,
          method: "GET",
        })
          .then((resp) => {
            const userhours = resp.data;
            commit("user_hours_success", userhours);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            reject(err);
          });
      });
    },
    getteamhours({ commit }, team_id) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: API_URL + "/teamhours" + team_id,
          method: "GET",
        })
          .then((resp) => {
            const teamhours = resp.data;
            commit("team_hours_success", teamhours);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            reject(err);
          });
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    isUser: (state) => state.user
  },
});