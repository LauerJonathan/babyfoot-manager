import axios from "axios";

const state = {
  teams: [],
  isLoading: false,
  error: null,
  registrationSuccess: false,
};

const mutations = {
  SET_TEAMS(state, teams) {
    state.teams = teams;
  },
  SET_LOADING(state, status) {
    state.isLoading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_REGISTRATION_SUCCESS(state, status) {
    state.registrationSuccess = status;
  },
  ADD_TEAM(state, team) {
    state.teams.push(team);
  },
};

const actions = {
  // Récupérer toutes les équipes
  async fetchTeams({ commit }) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const response = await axios.get("/api/teams");
      commit("SET_TEAMS", response.data.data);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors de la récupération des équipes";
      commit("SET_ERROR", errorMessage);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Créer une nouvelle équipe
  async createTeam({ commit }, teamData) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);
    commit("SET_REGISTRATION_SUCCESS", false);

    try {
      const response = await axios.post("/api/teams", {
        name: teamData.name,
        player1Name: teamData.player1Name,
        player2Name: teamData.player2Name,
      });

      commit("ADD_TEAM", response.data.team);
      commit("SET_REGISTRATION_SUCCESS", true);

      return response.data.team;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Erreur lors de la création de l'équipe";
      commit("SET_ERROR", errorMessage);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  // Réinitialiser le statut de succès
  resetRegistrationStatus({ commit }) {
    commit("SET_REGISTRATION_SUCCESS", false);
  },
};

const getters = {
  allTeams: (state) => state.teams,
  isLoading: (state) => state.isLoading,
  error: (state) => state.error,
  registrationSuccess: (state) => state.registrationSuccess,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
