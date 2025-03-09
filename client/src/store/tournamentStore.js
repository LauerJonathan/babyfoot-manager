import { reactive, readonly } from "vue";
import apiClient from "../plugins/axiosConfig";

// État initial
const state = reactive({
  tournaments: [],
  isLoading: false,
  error: null,
  success: false,
});

// Méthodes
const methods = {
  async fetchAllTournaments() {
    state.isLoading = true;
    state.error = null;

    try {
      const response = await apiClient.get("tournaments");

      // Adapter selon la structure de votre réponse
      state.tournaments =
        response.data.tournaments || response.data.data || response.data;
      return state.tournaments;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la récupération des tournois";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async createTournament(tournamentData) {
    state.isLoading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await apiClient.post("tournaments", {
        name: tournamentData.name,
        date: tournamentData.date,
        description: tournamentData.description,
        status: tournamentData.status,
      });

      // Si la création réussit, ajouter le tournoi à la liste
      if (state.tournaments.length > 0) {
        state.tournaments.push(response.data.tournament || response.data);
      }

      state.success = true;
      return response.data.tournament || response.data;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la création du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async updateTournament(tournamentData) {
    state.isLoading = true;
    state.error = null;
    state.success = false;

    try {
      const response = await apiClient.put(`tournaments/${tournamentData.id}`, {
        name: tournamentData.name,
        date: tournamentData.date,
        description: tournamentData.description,
        status: tournamentData.status,
      });

      // Mettre à jour le tournoi dans la liste
      const updatedTournament = response.data.tournament || response.data;
      const index = state.tournaments.findIndex(
        (t) => t.id === updatedTournament.id
      );
      if (index !== -1) {
        state.tournaments[index] = updatedTournament;
      }

      state.success = true;
      return updatedTournament;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la mise à jour du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  async deleteTournament(id) {
    state.isLoading = true;
    state.error = null;

    try {
      await apiClient.delete(`tournaments/${id}`);

      // Supprimer le tournoi de la liste
      const index = state.tournaments.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.tournaments.splice(index, 1);
      }

      return true;
    } catch (error) {
      state.error =
        error.response?.data?.message ||
        "Erreur lors de la suppression du tournoi";
      throw state.error;
    } finally {
      state.isLoading = false;
    }
  },

  resetSuccess() {
    state.success = false;
  },

  clearError() {
    state.error = null;
  },
};

// Exposer un état en lecture seule et les méthodes
export default {
  state: readonly(state),
  ...methods,
};
