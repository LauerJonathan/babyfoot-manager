<!-- Tournaments.vue -->
<template>
  <div class="tournaments-page">
    <div class="page-header">
      <div class="header-title">
        <h2>Gestion des tournois</h2>
        <p class="subtitle">Créez et gérez vos tournois de babyfoot</p>
      </div>
      <div class="header-actions">
        <button class="create-btn" @click="showCreateModal = true">
          <span class="icon">+</span>
          Créer un tournoi
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters">
      <div class="search">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un tournoi..."
          @input="filterTournaments" />
      </div>
      <div class="filter-group">
        <select v-model="statusFilter" @change="filterTournaments">
          <option value="">Tous les statuts</option>
          <option value="registration">Inscriptions ouvertes</option>
          <option value="scheduled">Programmé</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
        </select>
      </div>
    </div>

    <!-- Liste des tournois -->
    <div class="tournaments-list">
      <div
        v-for="tournament in filteredTournaments"
        :key="tournament.id"
        class="tournament-card">
        <div class="tournament-header">
          <h3 class="tournament-name">{{ tournament.name }}</h3>
          <span class="status-badge" :class="tournament.status">
            {{ formatStatus(tournament.status) }}
          </span>
        </div>

        <div class="tournament-info">
          <div class="info-row">
            <div class="info-label">Date</div>
            <div class="info-value">{{ formatDate(tournament.startDate) }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Lieu</div>
            <div class="info-value">{{ tournament.location }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Équipes</div>
            <div class="info-value">
              {{ tournament.teamsCount }}/{{ tournament.maxTeams }}
            </div>
          </div>
          <div class="info-row">
            <div class="info-label">Matchs</div>
            <div class="info-value">
              {{ tournament.matchesPlayed }}/{{ tournament.totalMatches }}
            </div>
          </div>
        </div>

        <div class="tournament-description">
          <p>{{ tournament.description }}</p>
        </div>

        <div class="tournament-actions">
          <button class="action-btn edit" @click="editTournament(tournament)">
            Modifier
          </button>
          <button
            class="action-btn view"
            @click="viewTournament(tournament.id)">
            Détails
          </button>
          <button
            v-if="
              tournament.status === 'registration' && tournament.teamsCount >= 2
            "
            class="action-btn generate"
            @click="generateMatches(tournament.id)">
            Générer les matchs
          </button>
          <button
            v-if="!['completed', 'cancelled'].includes(tournament.status)"
            class="action-btn status"
            @click="showStatusModal(tournament)">
            Changer statut
          </button>
          <button
            class="action-btn delete"
            @click="confirmDeleteTournament(tournament)"
            :disabled="tournament.status === 'in_progress'">
            Supprimer
          </button>
        </div>
      </div>

      <!-- Message si aucun tournoi trouvé -->
      <div v-if="filteredTournaments.length === 0" class="no-data">
        <p>Aucun tournoi ne correspond à vos critères</p>
        <button class="create-btn" @click="showCreateModal = true">
          Créer un tournoi
        </button>
      </div>
    </div>

    <!-- Modal de création/édition de tournoi -->
    <div
      v-if="showCreateModal || isEditing"
      class="modal-overlay"
      @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            {{ isEditing ? "Modifier le tournoi" : "Créer un nouveau tournoi" }}
          </h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="saveTournament" class="tournament-form">
          <div class="form-group">
            <label for="name">Nom du tournoi *</label>
            <input
              type="text"
              id="name"
              v-model="tournamentForm.name"
              required
              :class="{ error: errors.name }" />
            <span v-if="errors.name" class="error-message">{{
              errors.name
            }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Date de début *</label>
              <input
                type="datetime-local"
                id="startDate"
                v-model="tournamentForm.startDate"
                required
                :class="{ error: errors.startDate }" />
              <span v-if="errors.startDate" class="error-message">{{
                errors.startDate
              }}</span>
            </div>

            <div class="form-group">
              <label for="location">Lieu *</label>
              <input
                type="text"
                id="location"
                v-model="tournamentForm.location"
                required
                :class="{ error: errors.location }" />
              <span v-if="errors.location" class="error-message">{{
                errors.location
              }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="maxTeams">Nombre maximal d'équipes *</label>
              <input
                type="number"
                id="maxTeams"
                v-model="tournamentForm.maxTeams"
                min="2"
                max="64"
                required
                :class="{ error: errors.maxTeams }" />
              <span v-if="errors.maxTeams" class="error-message">{{
                errors.maxTeams
              }}</span>
            </div>

            <div class="form-group">
              <label for="status">Statut *</label>
              <select
                id="status"
                v-model="tournamentForm.status"
                required
                :class="{ error: errors.status }">
                <option value="registration">Inscriptions ouvertes</option>
                <option value="scheduled">Programmé</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
              <span v-if="errors.status" class="error-message">{{
                errors.status
              }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="tournamentForm.description"
              rows="4"
              :class="{ error: errors.description }"></textarea>
            <span v-if="errors.description" class="error-message">{{
              errors.description
            }}</span>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">
              Annuler
            </button>
            <button type="submit" class="submit-btn">
              {{ isEditing ? "Enregistrer" : "Créer" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation pour la suppression -->
    <div
      v-if="showDeleteConfirmation"
      class="modal-overlay"
      @click.self="cancelDelete">
      <div class="modal-content delete-confirmation">
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="close-btn" @click="cancelDelete">&times;</button>
        </div>
        <div class="confirmation-content">
          <p>
            Êtes-vous sûr de vouloir supprimer le tournoi
            <strong>{{ tournamentToDelete.name }}</strong> ?
          </p>

          <div
            v-if="
              tournamentToDelete.teamsCount > 0 ||
              tournamentToDelete.matchesPlayed > 0
            "
            class="warning">
            <p><strong>Attention :</strong> Ce tournoi contient :</p>
            <ul>
              <li v-if="tournamentToDelete.teamsCount > 0">
                {{ tournamentToDelete.teamsCount }} équipes inscrites
              </li>
              <li v-if="tournamentToDelete.matchesPlayed > 0">
                {{ tournamentToDelete.matchesPlayed }} matchs joués
              </li>
            </ul>
            <p>Toutes ces données seront définitivement supprimées.</p>
          </div>

          <div class="confirmation-actions">
            <button class="cancel-btn" @click="cancelDelete">Annuler</button>
            <button class="delete-btn" @click="deleteTournament">
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour changer le statut -->
    <div
      v-if="showStatusChangeModal"
      class="modal-overlay"
      @click.self="closeStatusModal">
      <div class="modal-content status-modal">
        <div class="modal-header">
          <h3>Changer le statut du tournoi</h3>
          <button class="close-btn" @click="closeStatusModal">&times;</button>
        </div>
        <div class="status-content">
          <p>
            Tournoi : <strong>{{ tournamentToUpdateStatus.name }}</strong>
          </p>
          <p>
            Statut actuel :
            <span class="status-badge" :class="tournamentToUpdateStatus.status">
              {{ formatStatus(tournamentToUpdateStatus.status) }}
            </span>
          </p>

          <div class="form-group">
            <label for="newStatus">Nouveau statut</label>
            <select id="newStatus" v-model="newStatus">
              <option
                value="registration"
                :disabled="!isStatusChangeAllowed('registration')">
                Inscriptions ouvertes
              </option>
              <option
                value="scheduled"
                :disabled="!isStatusChangeAllowed('scheduled')">
                Programmé
              </option>
              <option
                value="in_progress"
                :disabled="!isStatusChangeAllowed('in_progress')">
                En cours
              </option>
              <option
                value="completed"
                :disabled="!isStatusChangeAllowed('completed')">
                Terminé
              </option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div v-if="statusWarning" class="warning">
            <p>{{ statusWarning }}</p>
          </div>

          <div class="status-actions">
            <button class="cancel-btn" @click="closeStatusModal">
              Annuler
            </button>
            <button
              class="submit-btn"
              @click="updateTournamentStatus"
              :disabled="
                !newStatus || newStatus === tournamentToUpdateStatus.status
              ">
              Mettre à jour
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour la génération des matchs -->
    <div
      v-if="showGenerateMatchesModal"
      class="modal-overlay"
      @click.self="closeGenerateMatchesModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Générer les matchs</h3>
          <button class="close-btn" @click="closeGenerateMatchesModal">
            &times;
          </button>
        </div>
        <div class="generate-matches-content">
          <p>
            Vous êtes sur le point de générer automatiquement tous les matchs
            pour le tournoi <strong>{{ currentTournament.name }}</strong
            >.
          </p>

          <div class="tournament-setup">
            <div class="info-row">
              <div class="info-label">Équipes inscrites</div>
              <div class="info-value">{{ currentTournament.teamsCount }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Nombre de matchs à générer</div>
              <div class="info-value">
                {{ calculateTotalMatches(currentTournament.teamsCount) }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="matchFormat">Format des matchs</label>
            <select id="matchFormat" v-model="matchFormat">
              <option value="round_robin">
                Tournoi toutes rondes (chaque équipe joue contre toutes les
                autres)
              </option>
              <option
                value="elimination"
                :disabled="currentTournament.teamsCount < 4">
                Élimination directe
              </option>
              <option
                value="groups"
                :disabled="currentTournament.teamsCount < 6">
                Phase de groupes + élimination
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="schedulingOption">Programmation des matchs</label>
            <select id="schedulingOption" v-model="schedulingOption">
              <option value="auto">Générer automatiquement les horaires</option>
              <option value="manual">
                Je programmerai les matchs manuellement
              </option>
            </select>
          </div>

          <div v-if="schedulingOption === 'auto'" class="form-row">
            <div class="form-group">
              <label for="startTime">Heure de début</label>
              <input type="time" id="startTime" v-model="schedulingStartTime" />
            </div>

            <div class="form-group">
              <label for="matchDuration">Durée d'un match (minutes)</label>
              <input
                type="number"
                id="matchDuration"
                v-model="matchDuration"
                min="15"
                max="120"
                step="5" />
            </div>
          </div>

          <div class="warning">
            <p>
              <strong>Note :</strong> Une fois les matchs générés, le statut du
              tournoi passera automatiquement à "Programmé". Vous pourrez
              toujours modifier les horaires des matchs individuellement.
            </p>
          </div>

          <div class="generate-actions">
            <button class="cancel-btn" @click="closeGenerateMatchesModal">
              Annuler
            </button>
            <button class="generate-btn" @click="confirmGenerateMatches">
              Générer les matchs
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tournaments",
  data() {
    return {
      tournaments: [
        {
          id: 1,
          name: "Tournoi d'Hiver 2025",
          description:
            "Le tournoi annuel d'hiver avec les meilleures équipes de la région. Prix à gagner pour les trois premiers.",
          startDate: "2025-01-15T10:00:00.000Z",
          location: "Salle principale",
          maxTeams: 16,
          teamsCount: 16,
          matchesPlayed: 120,
          totalMatches: 120,
          status: "completed",
        },
        {
          id: 2,
          name: "Tournoi de Printemps",
          description:
            "Tournoi ouvert à tous les niveaux, parfait pour les débutants et les équipes intermédiaires.",
          startDate: "2025-04-15T09:00:00.000Z",
          location: "Salle principale",
          maxTeams: 16,
          teamsCount: 8,
          matchesPlayed: 0,
          totalMatches: 28,
          status: "registration",
        },
        {
          id: 3,
          name: "Challenge Entreprises",
          description:
            "Tournoi réservé aux équipes d'entreprises. Ambiance conviviale garantie !",
          startDate: "2025-05-22T14:00:00.000Z",
          location: "Espace loisirs",
          maxTeams: 8,
          teamsCount: 6,
          matchesPlayed: 0,
          totalMatches: 15,
          status: "scheduled",
        },
        {
          id: 4,
          name: "Coupe d'Été",
          description:
            "Le grand tournoi de l'été avec des équipes venues de toute la France.",
          startDate: "2025-07-10T10:00:00.000Z",
          location: "Salle principale",
          maxTeams: 24,
          teamsCount: 4,
          matchesPlayed: 0,
          totalMatches: 0,
          status: "registration",
        },
      ],
      searchQuery: "",
      statusFilter: "",

      // Modals and form state
      showCreateModal: false,
      isEditing: false,
      tournamentForm: {
        name: "",
        startDate: "",
        location: "",
        maxTeams: 16,
        description: "",
        status: "registration",
      },
      errors: {
        name: "",
        startDate: "",
        location: "",
        maxTeams: "",
        description: "",
        status: "",
      },

      // Delete confirmation
      showDeleteConfirmation: false,
      tournamentToDelete: null,

      // Status change
      showStatusChangeModal: false,
      tournamentToUpdateStatus: null,
      newStatus: "",
      statusWarning: "",

      // Generate matches
      showGenerateMatchesModal: false,
      currentTournament: null,
      matchFormat: "round_robin",
      schedulingOption: "auto",
      schedulingStartTime: "09:00",
      matchDuration: 30,
    };
  },
  computed: {
    filteredTournaments() {
      let result = [...this.tournaments];

      // Filtrer par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (tournament) =>
            tournament.name.toLowerCase().includes(query) ||
            tournament.description.toLowerCase().includes(query) ||
            tournament.location.toLowerCase().includes(query)
        );
      }

      // Filtrer par statut
      if (this.statusFilter) {
        result = result.filter(
          (tournament) => tournament.status === this.statusFilter
        );
      }

      return result;
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatStatus(status) {
      const statusMap = {
        registration: "Inscriptions ouvertes",
        scheduled: "Programmé",
        in_progress: "En cours",
        completed: "Terminé",
        cancelled: "Annulé",
      };
      return statusMap[status] || status;
    },
    filterTournaments() {
      // Cette méthode existe pour être appelée lors des événements d'input/change
      // Le filtrage est géré par la computed property
    },
    createTournament() {
      this.isEditing = false;
      this.tournamentForm = {
        name: "",
        startDate: this.formatDateForInput(new Date()),
        location: "Salle principale",
        maxTeams: 16,
        description: "",
        status: "registration",
      };
      this.showCreateModal = true;
      this.resetErrors();
    },
    editTournament(tournament) {
      this.isEditing = true;
      this.tournamentForm = {
        id: tournament.id,
        name: tournament.name,
        startDate: this.formatDateForInput(new Date(tournament.startDate)),
        location: tournament.location,
        maxTeams: tournament.maxTeams,
        description: tournament.description,
        status: tournament.status,
      };
      this.showCreateModal = true;
      this.resetErrors();
    },
    resetErrors() {
      this.errors = {
        name: "",
        startDate: "",
        location: "",
        maxTeams: "",
        description: "",
        status: "",
      };
    },
    validateForm() {
      let isValid = true;
      this.resetErrors();

      // Valider le nom
      if (!this.tournamentForm.name.trim()) {
        this.errors.name = "Le nom du tournoi est requis";
        isValid = false;
      } else if (this.tournamentForm.name.length < 3) {
        this.errors.name = "Le nom doit contenir au moins 3 caractères";
        isValid = false;
      }

      // Valider la date
      if (!this.tournamentForm.startDate) {
        this.errors.startDate = "La date de début est requise";
        isValid = false;
      } else {
        const selectedDate = new Date(this.tournamentForm.startDate);
        const now = new Date();

        if (this.isEditing) {
          // Pour l'édition, on vérifie si la date est passée et si le tournoi n'est pas terminé
          const tournament = this.tournaments.find(
            (t) => t.id === this.tournamentForm.id
          );
          if (
            selectedDate < now &&
            !["completed", "cancelled"].includes(tournament.status)
          ) {
            this.errors.startDate = "La date ne peut pas être dans le passé";
            isValid = false;
          }
        } else {
          // Pour la création, la date doit être future
          if (selectedDate < now) {
            this.errors.startDate = "La date ne peut pas être dans le passé";
            isValid = false;
          }
        }
      }

      // Valider le lieu
      if (!this.tournamentForm.location.trim()) {
        this.errors.location = "Le lieu est requis";
        isValid = false;
      }

      // Valider le nombre d'équipes
      if (!this.tournamentForm.maxTeams) {
        this.errors.maxTeams = "Le nombre maximum d'équipes est requis";
        isValid = false;
      } else if (this.tournamentForm.maxTeams < 2) {
        this.errors.maxTeams = "Minimum 2 équipes requises";
        isValid = false;
      } else if (this.tournamentForm.maxTeams > 64) {
        this.errors.maxTeams = "Maximum 64 équipes autorisées";
        isValid = false;
      }

      return isValid;
    },
    saveTournament() {
      if (!this.validateForm()) {
        return;
      }

      if (this.isEditing) {
        // Mettre à jour un tournoi existant
        const index = this.tournaments.findIndex(
          (t) => t.id === this.tournamentForm.id
        );
        if (index !== -1) {
          // Préserver les données non modifiables via le formulaire
          const teamsCount = this.tournaments[index].teamsCount;
          const matchesPlayed = this.tournaments[index].matchesPlayed;
          const totalMatches = this.tournaments[index].totalMatches;

          this.tournaments[index] = {
            ...this.tournamentForm,
            teamsCount,
            matchesPlayed,
            totalMatches,
          };

          // Dans une application réelle, vous feriez un appel API ici
          console.log("Tournoi mis à jour:", this.tournaments[index]);
        }
      } else {
        // Créer un nouveau tournoi
        const newTournament = {
          ...this.tournamentForm,
          id: this.tournaments.length + 1,
          teamsCount: 0,
          matchesPlayed: 0,
          totalMatches: 0,
        };

        this.tournaments.push(newTournament);

        // Dans une application réelle, vous feriez un appel API ici
        console.log("Nouveau tournoi créé:", newTournament);
      }

      this.closeModal();
    },
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    closeModal() {
      this.showCreateModal = false;
      this.isEditing = false;
    },
    viewTournament(tournamentId) {
      // Naviguer vers la page de détail du tournoi
      console.log("Voir les détails du tournoi:", tournamentId);
      // this.$router.push(`/admin/tournaments/${tournamentId}`);
    },
    confirmDeleteTournament(tournament) {
      this.tournamentToDelete = tournament;
      this.showDeleteConfirmation = true;
    },
    cancelDelete() {
      this.tournamentToDelete = null;
      this.showDeleteConfirmation = false;
    },
    deleteTournament() {
      // Supprimer le tournoi
      const index = this.tournaments.findIndex(
        (t) => t.id === this.tournamentToDelete.id
      );
      if (index !== -1) {
        this.tournaments.splice(index, 1);

        // Dans une application réelle, vous feriez un appel API ici
        console.log("Tournoi supprimé:", this.tournamentToDelete);
      }

      this.cancelDelete();
    },
    showStatusModal(tournament) {
      this.tournamentToUpdateStatus = tournament;
      this.newStatus = "";
      this.statusWarning = "";
      this.showStatusChangeModal = true;
    },
    closeStatusModal() {
      this.tournamentToUpdateStatus = null;
      this.showStatusChangeModal = false;
    },
    isStatusChangeAllowed(newStatus) {
      if (!this.tournamentToUpdateStatus) return false;

      const currentStatus = this.tournamentToUpdateStatus.status;

      // Règles de transition entre les statuts
      const allowedTransitions = {
        registration: ["scheduled", "cancelled"],
        scheduled: ["in_progress", "cancelled"],
        in_progress: ["completed", "cancelled"],
        completed: ["cancelled"],
        cancelled: [],
      };

      return allowedTransitions[currentStatus].includes(newStatus);
    },
    updateStatusWarning() {
      if (!this.newStatus || !this.tournamentToUpdateStatus) {
        this.statusWarning = "";
        return;
      }

      const warnings = {
        scheduled:
          "Assurez-vous que tous les matchs sont générés avant de passer à ce statut.",
        in_progress:
          "Ce changement indique que le tournoi a commencé et permet la saisie des scores.",
        completed:
          "Ce changement marque la fin du tournoi. Assurez-vous que tous les matchs sont terminés.",
        cancelled:
          "Cette action est irréversible. Tous les matchs à venir seront annulés.",
      };

      this.statusWarning = warnings[this.newStatus] || "";
    },
    updateTournamentStatus() {
      if (!this.newStatus || !this.tournamentToUpdateStatus) return;

      // Mettre à jour le statut
      const index = this.tournaments.findIndex(
        (t) => t.id === this.tournamentToUpdateStatus.id
      );
      if (index !== -1) {
        this.tournaments[index].status = this.newStatus;

        // Dans une application réelle, vous feriez un appel API ici
        console.log("Statut du tournoi mis à jour:", {
          tournamentId: this.tournamentToUpdateStatus.id,
          oldStatus: this.tournamentToUpdateStatus.status,
          newStatus: this.newStatus,
        });
      }

      this.closeStatusModal();
    },
    generateMatches(tournamentId) {
      const tournament = this.tournaments.find((t) => t.id === tournamentId);
      if (tournament) {
        this.currentTournament = tournament;
        this.showGenerateMatchesModal = true;
      }
    },
    calculateTotalMatches(teamsCount) {
      // Pour un tournoi "toutes rondes" (round-robin), chaque équipe joue contre toutes les autres
      // La formule est n(n-1)/2 où n est le nombre d'équipes
      return (teamsCount * (teamsCount - 1)) / 2;
    },
    closeGenerateMatchesModal() {
      this.currentTournament = null;
      this.showGenerateMatchesModal = false;
    },
    confirmGenerateMatches() {
      if (!this.currentTournament) return;

      // Calculer le nombre total de matchs
      const totalMatches = this.calculateTotalMatches(
        this.currentTournament.teamsCount
      );

      // Mettre à jour le tournoi
      const index = this.tournaments.findIndex(
        (t) => t.id === this.currentTournament.id
      );
      if (index !== -1) {
        this.tournaments[index].totalMatches = totalMatches;
        this.tournaments[index].status = "scheduled";

        // Dans une application réelle, vous feriez un appel API ici pour générer les matchs
        console.log("Matchs générés pour le tournoi:", {
          tournamentId: this.currentTournament.id,
          totalMatches,
          format: this.matchFormat,
          scheduling: this.schedulingOption,
          startTime: this.schedulingStartTime,
          matchDuration: this.matchDuration,
        });
      }

      this.closeGenerateMatchesModal();
    },
  },
  watch: {
    newStatus() {
      this.updateStatusWarning();
    },
  },
  mounted() {
    // Dans une application réelle, charger les données au montage
    // Vous feriez ici des appels API pour récupérer les tournois, etc.
  },
};
</script>

<style scoped>
.tournaments-page {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-title h2 {
  color: #fff;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
}

.subtitle {
  color: #aaa;
  margin: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ef854d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn:hover {
  background-color: #d67642;
  transform: translateY(-2px);
}

.create-btn .icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Filtres */
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 8px;
}

.search {
  flex: 1;
}

.search input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #333;
  background-color: #121212;
  color: white;
  border-radius: 5px;
  outline: none;
}

.search input:focus {
  border-color: #ef854d;
}

.filter-group {
  display: flex;
  gap: 10px;
  margin-left: 15px;
}

.filter-group select {
  padding: 10px 15px;
  border: 1px solid #333;
  background-color: #121212;
  color: white;
  border-radius: 5px;
  outline: none;
}

.filter-group select:focus {
  border-color: #ef854d;
}

/* Liste des tournois */
.tournaments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.tournament-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tournament-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.tournament-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
}

.tournament-name {
  margin: 0;
  color: #ef854d;
  font-size: 1.2rem;
  font-weight: bold;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.registration {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.status-badge.scheduled {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status-badge.in_progress {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-badge.cancelled {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.tournament-info {
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-row {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 5px;
}

.info-value {
  color: white;
  font-weight: bold;
}

.tournament-description {
  padding: 0 15px;
  flex: 1;
}

.tournament-description p {
  color: #ddd;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Limite à 2 lignes */
  text-overflow: ellipsis;
}

.tournament-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #333;
  flex-wrap: wrap;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 90px;
  max-width: 150px;
}

.action-btn.edit {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.action-btn.edit:hover {
  background-color: rgba(33, 150, 243, 0.5);
}

.action-btn.view {
  background-color: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.action-btn.view:hover {
  background-color: rgba(158, 158, 158, 0.5);
}

.action-btn.generate {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.action-btn.generate:hover {
  background-color: rgba(76, 175, 80, 0.5);
}

.action-btn.status {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.action-btn.status:hover {
  background-color: rgba(255, 193, 7, 0.5);
}

.action-btn.delete {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.action-btn.delete:hover {
  background-color: rgba(244, 67, 54, 0.5);
}

.action-btn:disabled {
  background-color: rgba(158, 158, 158, 0.1);
  color: #666;
  cursor: not-allowed;
}

.no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px;
  color: #aaa;
  background-color: #1e1e1e;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-data p {
  margin: 0;
  font-size: 1.1rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 10px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
}

.modal-header h3 {
  margin: 0;
  color: #ef854d;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Formulaire */
.tournament-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: white;
  font-weight: bold;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #ef854d;
}

input.error,
select.error,
textarea.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.cancel-btn {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background-color: #555;
}

.submit-btn {
  background-color: #ef854d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background-color: #d67642;
}

.submit-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* Confirmation de suppression */
.delete-confirmation .confirmation-content {
  padding: 20px;
}

.confirmation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.warning {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding: 15px;
  margin: 15px 0;
  color: #eee;
}

.warning p {
  margin: 0 0 10px 0;
}

.warning ul {
  margin: 0;
  padding-left: 20px;
}

.warning li {
  margin-bottom: 5px;
}

/* Status modal */
.status-modal .status-content {
  padding: 20px;
}

.status-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Generate matches modal */
.generate-matches-content {
  padding: 20px;
}

.tournament-setup {
  background-color: #2a2a2a;
  padding: 15px;
  border-radius: 5px;
  margin: 15px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.generate-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.generate-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover {
  background-color: #388e3c;
}

/* Responsive */
@media (max-width: 768px) {
  .tournaments-list {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
  }

  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .filter-group {
    width: 100%;
    margin-left: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
