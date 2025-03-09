<!-- Results.vue -->
<template>
  <div class="results-page">
    <div class="page-header">
      <div class="header-title">
        <h2>Résultats et classements</h2>
        <p class="subtitle">
          Consultez les résultats des matchs et les classements des tournois
        </p>
      </div>
      <div class="header-actions">
        <div class="tournament-filter">
          <label for="tournamentFilter">Tournoi :</label>
          <select
            id="tournamentFilter"
            v-model="selectedTournament"
            @change="loadTournamentData">
            <option value="">Tous les tournois</option>
            <option
              v-for="tournament in tournaments"
              :key="tournament.id"
              :value="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Onglets pour naviguer entre résultats et classement -->
    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'results' }"
        @click="activeTab = 'results'">
        Résultats des matchs
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'standings' }"
        @click="activeTab = 'standings'">
        Classements
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="tab-content">
      <!-- Onglet des résultats -->
      <div v-if="activeTab === 'results'" class="results-tab">
        <!-- Filtre et recherche -->
        <div class="filters">
          <div class="search">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher une équipe..."
              @input="filterMatches" />
          </div>
          <div class="filter-group">
            <select v-model="statusFilter" @change="filterMatches">
              <option value="">Tous les statuts</option>
              <option value="completed">Terminés</option>
              <option value="scheduled">À venir</option>
              <option value="in_progress">En cours</option>
            </select>
          </div>
        </div>

        <!-- Tableau des matchs -->
        <div class="matches-table-container">
          <table class="matches-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tournoi</th>
                <th class="team-col">Équipe domicile</th>
                <th>Score</th>
                <th class="team-col">Équipe extérieur</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="match in filteredMatches"
                :key="match.id"
                :class="{ editable: match.status !== 'completed' }">
                <td>
                  {{ formatDate(match.playedDate || match.scheduledDate) }}
                </td>
                <td>{{ match.tournament }}</td>
                <td class="team-col">
                  <div class="team-info">
                    <div>{{ match.homeTeam }}</div>
                    <div class="team-players">
                      {{ formatTeamPlayers(match.homeTeamPlayers) }}
                    </div>
                  </div>
                </td>
                <td class="score-col">
                  <div v-if="match.status === 'completed'" class="score">
                    <span
                      :class="{ winner: match.homeScore > match.awayScore }"
                      >{{ match.homeScore }}</span
                    >
                    <span>-</span>
                    <span
                      :class="{ winner: match.awayScore > match.homeScore }"
                      >{{ match.awayScore }}</span
                    >
                  </div>
                  <div
                    v-else
                    class="score-entry"
                    :class="{
                      active: isEditing && editingMatchId === match.id,
                    }">
                    <template v-if="isEditing && editingMatchId === match.id">
                      <input
                        type="number"
                        v-model="editScore.homeScore"
                        min="0"
                        class="score-input" />
                      <span>-</span>
                      <input
                        type="number"
                        v-model="editScore.awayScore"
                        min="0"
                        class="score-input" />
                    </template>
                    <template v-else>
                      <span>vs</span>
                    </template>
                  </div>
                </td>
                <td class="team-col">
                  <div class="team-info">
                    <div>{{ match.awayTeam }}</div>
                    <div class="team-players">
                      {{ formatTeamPlayers(match.awayTeamPlayers) }}
                    </div>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="match.status">
                    {{ formatStatus(match.status) }}
                  </span>
                </td>
                <td class="actions">
                  <div v-if="match.status !== 'completed'">
                    <button
                      v-if="isEditing && editingMatchId === match.id"
                      class="action-btn save"
                      @click="saveScore(match.id)">
                      Enregistrer
                    </button>
                    <button
                      v-else
                      class="action-btn edit"
                      @click="startEditing(match)">
                      Saisir score
                    </button>
                  </div>
                  <div v-else>
                    <button
                      class="action-btn view"
                      @click="viewMatchDetails(match.id)">
                      Détails
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Message si aucun match -->
              <tr v-if="filteredMatches.length === 0">
                <td colspan="7" class="no-data">
                  Aucun match ne correspond aux critères de recherche
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Onglet des classements -->
      <div v-if="activeTab === 'standings'" class="standings-tab">
        <!-- Message si aucun tournoi sélectionné -->
        <div v-if="!selectedTournament" class="no-tournament-message">
          <p>Veuillez sélectionner un tournoi pour voir son classement</p>
        </div>

        <!-- Tableau de classement -->
        <div v-else class="standings-container">
          <h3 class="tournament-name">{{ getCurrentTournamentName() }}</h3>

          <table class="standings-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Équipe</th>
                <th>J</th>
                <th>V</th>
                <th>N</th>
                <th>D</th>
                <th>BP</th>
                <th>BC</th>
                <th>Diff</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, index) in standings"
                :key="team.id"
                :class="{ 'top-three': index < 3 }">
                <td class="position">{{ index + 1 }}</td>
                <td class="team-name">
                  <div class="team-info">
                    <div>{{ team.name }}</div>
                    <div class="team-players">
                      {{ formatTeamPlayers(team.players) }}
                    </div>
                  </div>
                </td>
                <td>{{ team.matchesPlayed }}</td>
                <td>{{ team.matchesWon }}</td>
                <td>{{ team.matchesDraw }}</td>
                <td>{{ team.matchesLost }}</td>
                <td>{{ team.goalsFor }}</td>
                <td>{{ team.goalsAgainst }}</td>
                <td
                  :class="{
                    positive: team.goalDifference > 0,
                    negative: team.goalDifference < 0,
                  }">
                  {{ team.goalDifference > 0 ? "+" : ""
                  }}{{ team.goalDifference }}
                </td>
                <td class="points">{{ team.points }}</td>
              </tr>
              <!-- Message si aucune équipe -->
              <tr v-if="standings.length === 0">
                <td colspan="10" class="no-data">
                  Aucune équipe inscrite à ce tournoi ou aucun match joué
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Explication des abréviations -->
          <div class="legend">
            <p>
              <strong>J</strong>: Joués, <strong>V</strong>: Victoires,
              <strong>N</strong>: Nuls, <strong>D</strong>: Défaites,
              <strong>BP</strong>: Buts Pour, <strong>BC</strong>: Buts Contre,
              <strong>Diff</strong>: Différence, <strong>Pts</strong>: Points
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails de match -->
    <div v-if="showMatchModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Détails du match</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div v-if="selectedMatch" class="match-details">
          <div class="match-header">
            <div class="match-tournament">{{ selectedMatch.tournament }}</div>
            <div class="match-date">
              {{ formatDateTime(selectedMatch.playedDate) }}
            </div>
          </div>

          <div class="match-score-display">
            <div class="team home-team">
              <div class="team-name">{{ selectedMatch.homeTeam }}</div>
              <div class="team-players">
                {{ formatTeamPlayers(selectedMatch.homeTeamPlayers) }}
              </div>
            </div>
            <div class="match-score">
              <span
                class="score-value"
                :class="{
                  winner: selectedMatch.homeScore > selectedMatch.awayScore,
                }">
                {{ selectedMatch.homeScore }}
              </span>
              <span class="score-separator">-</span>
              <span
                class="score-value"
                :class="{
                  winner: selectedMatch.awayScore > selectedMatch.homeScore,
                }">
                {{ selectedMatch.awayScore }}
              </span>
            </div>
            <div class="team away-team">
              <div class="team-name">{{ selectedMatch.awayTeam }}</div>
              <div class="team-players">
                {{ formatTeamPlayers(selectedMatch.awayTeamPlayers) }}
              </div>
            </div>
          </div>

          <div class="match-stats">
            <h4>Statistiques</h4>
            <table class="stats-table">
              <tr>
                <td class="home-stat">
                  {{ selectedMatch.stats.homePossession }}%
                </td>
                <th>Possession</th>
                <td class="away-stat">
                  {{ selectedMatch.stats.awayPossession }}%
                </td>
              </tr>
              <tr>
                <td class="home-stat">{{ selectedMatch.stats.homeShots }}</td>
                <th>Tirs</th>
                <td class="away-stat">{{ selectedMatch.stats.awayShots }}</td>
              </tr>
              <tr>
                <td class="home-stat">
                  {{ selectedMatch.stats.homeShotsOnTarget }}
                </td>
                <th>Tirs cadrés</th>
                <td class="away-stat">
                  {{ selectedMatch.stats.awayShotsOnTarget }}
                </td>
              </tr>
              <tr>
                <td class="home-stat">{{ selectedMatch.stats.homeCorners }}</td>
                <th>Corners</th>
                <td class="away-stat">{{ selectedMatch.stats.awayCorners }}</td>
              </tr>
            </table>
          </div>

          <div class="match-notes" v-if="selectedMatch.notes">
            <h4>Notes</h4>
            <p>{{ selectedMatch.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Results",
  data() {
    return {
      activeTab: "results",
      selectedTournament: "",
      searchQuery: "",
      statusFilter: "",
      isEditing: false,
      editingMatchId: null,
      editScore: {
        homeScore: 0,
        awayScore: 0,
      },
      showMatchModal: false,
      selectedMatch: null,

      // Données simulées
      tournaments: [
        { id: 1, name: "Tournoi d'Hiver 2025" },
        { id: 2, name: "Tournoi de Printemps" },
        { id: 3, name: "Challenge Entreprises" },
      ],
      matches: [
        {
          id: 1,
          tournament: "Tournoi d'Hiver 2025",
          tournamentId: 1,
          homeTeam: "Les Invincibles",
          homeTeamPlayers: "Thomas Dupont & Marie Martin",
          homeScore: 10,
          awayTeam: "Foosballs",
          awayTeamPlayers: "Pierre Lambert & Julie Dubois",
          awayScore: 8,
          playedDate: "2025-03-07T16:49:43.000Z",
          status: "completed",
          stats: {
            homePossession: 55,
            awayPossession: 45,
            homeShots: 18,
            awayShots: 14,
            homeShotsOnTarget: 12,
            awayShotsOnTarget: 10,
            homeCorners: 4,
            awayCorners: 3,
          },
          notes:
            "Match très disputé avec une belle remontée des Foosballs en deuxième partie de jeu.",
        },
        {
          id: 2,
          tournament: "Tournoi d'Hiver 2025",
          tournamentId: 1,
          homeTeam: "Les Titans",
          homeTeamPlayers: "Jean Moreau & Sophie Bernard",
          homeScore: 10,
          awayTeam: "Les Comètes",
          awayTeamPlayers: "Antoine Dupont & Emma Petit",
          awayScore: 5,
          playedDate: "2025-03-05T14:30:00.000Z",
          status: "completed",
          stats: {
            homePossession: 68,
            awayPossession: 32,
            homeShots: 22,
            awayShots: 8,
            homeShotsOnTarget: 15,
            awayShotsOnTarget: 6,
            homeCorners: 7,
            awayCorners: 2,
          },
        },
        {
          id: 3,
          tournament: "Tournoi d'Hiver 2025",
          tournamentId: 1,
          homeTeam: "Les Dragons",
          homeTeamPlayers: "Philippe Martin & Laura Simon",
          homeScore: 10,
          awayTeam: "Les Raptors",
          awayTeamPlayers: "Nicolas Petit & Camille Leroy",
          awayScore: 9,
          playedDate: "2025-03-04T17:15:00.000Z",
          status: "completed",
          stats: {
            homePossession: 51,
            awayPossession: 49,
            homeShots: 16,
            awayShots: 15,
            homeShotsOnTarget: 13,
            awayShotsOnTarget: 12,
            homeCorners: 5,
            awayCorners: 4,
          },
        },
        {
          id: 4,
          tournament: "Tournoi de Printemps",
          tournamentId: 2,
          homeTeam: "Les Invincibles",
          homeTeamPlayers: "Thomas Dupont & Marie Martin",
          awayTeam: "Les Titans",
          awayTeamPlayers: "Jean Moreau & Sophie Bernard",
          scheduledDate: "2025-04-18T15:00:00.000Z",
          status: "scheduled",
        },
        {
          id: 5,
          tournament: "Tournoi de Printemps",
          tournamentId: 2,
          homeTeam: "Les Dragons",
          homeTeamPlayers: "Philippe Martin & Laura Simon",
          awayTeam: "Les Comètes",
          awayTeamPlayers: "Antoine Dupont & Emma Petit",
          scheduledDate: "2025-04-18T17:30:00.000Z",
          status: "scheduled",
        },
        {
          id: 6,
          tournament: "Challenge Entreprises",
          tournamentId: 3,
          homeTeam: "Tech Wizards",
          homeTeamPlayers: "Julien Blanc & Sarah Morel",
          awayTeam: "Finance Masters",
          awayTeamPlayers: "David Roux & Alice Girard",
          playedDate: "2025-03-01T13:00:00.000Z",
          homeScore: 10,
          awayScore: 7,
          status: "completed",
          stats: {
            homePossession: 60,
            awayPossession: 40,
            homeShots: 20,
            awayShots: 12,
            homeShotsOnTarget: 14,
            awayShotsOnTarget: 8,
            homeCorners: 6,
            awayCorners: 3,
          },
        },
      ],
      standings: [
        {
          id: 1,
          name: "Les Invincibles",
          players: "Thomas Dupont & Marie Martin",
          matchesPlayed: 3,
          matchesWon: 3,
          matchesDraw: 0,
          matchesLost: 0,
          goalsFor: 30,
          goalsAgainst: 18,
          goalDifference: 12,
          points: 9,
        },
        {
          id: 2,
          name: "Les Titans",
          players: "Jean Moreau & Sophie Bernard",
          matchesPlayed: 3,
          matchesWon: 2,
          matchesDraw: 0,
          matchesLost: 1,
          goalsFor: 25,
          goalsAgainst: 15,
          goalDifference: 10,
          points: 6,
        },
        {
          id: 3,
          name: "Les Dragons",
          players: "Philippe Martin & Laura Simon",
          matchesPlayed: 3,
          matchesWon: 2,
          matchesDraw: 0,
          matchesLost: 1,
          goalsFor: 24,
          goalsAgainst: 19,
          goalDifference: 5,
          points: 6,
        },
        {
          id: 4,
          name: "Foosballs",
          players: "Pierre Lambert & Julie Dubois",
          matchesPlayed: 3,
          matchesWon: 1,
          matchesDraw: 0,
          matchesLost: 2,
          goalsFor: 18,
          goalsAgainst: 20,
          goalDifference: -2,
          points: 3,
        },
        {
          id: 5,
          name: "Les Raptors",
          players: "Nicolas Petit & Camille Leroy",
          matchesPlayed: 3,
          matchesWon: 1,
          matchesDraw: 0,
          matchesLost: 2,
          goalsFor: 19,
          goalsAgainst: 22,
          goalDifference: -3,
          points: 3,
        },
        {
          id: 6,
          name: "Les Comètes",
          players: "Antoine Dupont & Emma Petit",
          matchesPlayed: 3,
          matchesWon: 0,
          matchesDraw: 0,
          matchesLost: 3,
          goalsFor: 10,
          goalsAgainst: 32,
          goalDifference: -22,
          points: 0,
        },
      ],
    };
  },
  computed: {
    filteredMatches() {
      let result = [...this.matches];

      // Filtrer par tournoi
      if (this.selectedTournament) {
        result = result.filter(
          (match) => match.tournamentId === parseInt(this.selectedTournament)
        );
      }

      // Filtrer par statut
      if (this.statusFilter) {
        result = result.filter((match) => match.status === this.statusFilter);
      }

      // Filtrer par recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (match) =>
            match.homeTeam.toLowerCase().includes(query) ||
            match.awayTeam.toLowerCase().includes(query) ||
            (match.homeTeamPlayers &&
              match.homeTeamPlayers.toLowerCase().includes(query)) ||
            (match.awayTeamPlayers &&
              match.awayTeamPlayers.toLowerCase().includes(query))
        );
      }

      return result;
    },
  },
  methods: {
    loadTournamentData() {
      // Dans une implémentation réelle, cette méthode ferait un appel API
      // pour récupérer les données du tournoi sélectionné
      console.log(
        "Chargement des données pour le tournoi:",
        this.selectedTournament
      );

      // Simule le chargement des données de classement pour le tournoi sélectionné
      // Dans une implémentation réelle, cela viendrait de l'API
    },
    formatDate(dateString) {
      if (!dateString) return "Non programmé";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatDateTime(dateString) {
      if (!dateString) return "Non programmé";
      const date = new Date(dateString);
      return `${date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
    formatStatus(status) {
      const statusMap = {
        completed: "Terminé",
        scheduled: "Programmé",
        in_progress: "En cours",
        cancelled: "Annulé",
      };
      return statusMap[status] || status;
    },
    formatTeamPlayers(players) {
      if (!players) return "";

      // Si les joueurs sont déjà formatés, les retourner tels quels
      if (players.includes("&")) return players;

      // Formater les noms
      const formatName = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        if (parts.length === 1) return parts[0];
        return `${parts[0]}.${parts[1].charAt(0)}`;
      };

      const playerNames = players
        .split(",")
        .map((name) => formatName(name.trim()));
      return playerNames.join(" & ");
    },
    filterMatches() {
      // Cette méthode existe pour pouvoir être appelée lors des événements d'input/change
      // La filtration réelle est faite par la computed property filteredMatches
    },
    startEditing(match) {
      this.isEditing = true;
      this.editingMatchId = match.id;
      this.editScore = {
        homeScore: match.homeScore || 0,
        awayScore: match.awayScore || 0,
      };
    },
    saveScore(matchId) {
      // Trouver le match et mettre à jour son score
      const matchIndex = this.matches.findIndex((m) => m.id === matchId);
      if (matchIndex !== -1) {
        this.matches[matchIndex].homeScore = parseInt(this.editScore.homeScore);
        this.matches[matchIndex].awayScore = parseInt(this.editScore.awayScore);
        this.matches[matchIndex].status = "completed";
        this.matches[matchIndex].playedDate = new Date().toISOString();

        // Ajouter des statistiques simulées
        this.matches[matchIndex].stats = {
          homePossession: Math.floor(Math.random() * 40) + 30,
          awayPossession: 0, // Calculé ci-dessous
          homeShots: Math.floor(Math.random() * 15) + 10,
          awayShots: Math.floor(Math.random() * 15) + 5,
          homeShotsOnTarget: Math.floor(Math.random() * 10) + 5,
          awayShotsOnTarget: Math.floor(Math.random() * 10) + 3,
          homeCorners: Math.floor(Math.random() * 6) + 1,
          awayCorners: Math.floor(Math.random() * 6) + 1,
        };

        // Calculer la possession adverse
        this.matches[matchIndex].stats.awayPossession =
          100 - this.matches[matchIndex].stats.homePossession;

        // Réinitialiser l'état d'édition
        this.isEditing = false;
        this.editingMatchId = null;

        // Dans une application réelle, vous feriez ici un appel API pour sauvegarder
        console.log("Score sauvegardé:", this.matches[matchIndex]);
      }
    },
    viewMatchDetails(matchId) {
      const match = this.matches.find((m) => m.id === matchId);
      if (match) {
        this.selectedMatch = match;
        this.showMatchModal = true;
      }
    },
    closeModal() {
      this.showMatchModal = false;
      this.selectedMatch = null;
    },
    getCurrentTournamentName() {
      if (!this.selectedTournament) return "";
      const tournament = this.tournaments.find(
        (t) => t.id === parseInt(this.selectedTournament)
      );
      return tournament ? tournament.name : "";
    },
  },
  mounted() {
    // Dans une implémentation réelle, charger les données au montage
    // Vous feriez ici des appels API pour récupérer les tournois, etc.
  },
};
</script>

<style scoped>
.results-page {
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

.tournament-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tournament-filter label {
  color: #fff;
}

.tournament-filter select {
  background-color: #1e1e1e;
  color: white;
  border: 1px solid #333;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  min-width: 200px;
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 2px solid #333;
  margin-bottom: 20px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #aaa;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #ef854d;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ef854d;
}

.tab-content {
  flex: 1;
}

/* Filters */
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
}

.filter-group {
  display: flex;
  gap: 10px;
}

.filter-group select {
  padding: 10px 15px;
  border: 1px solid #333;
  background-color: #121212;
  color: white;
  border-radius: 5px;
}

/* Tables */
.matches-table-container,
.standings-container {
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #121212;
  color: #aaa;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
}

td {
  color: white;
  border-bottom: 1px solid #333;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.team-col {
  min-width: 160px;
}

.team-info {
  display: flex;
  flex-direction: column;
}

.team-players {
  font-size: 0.8rem;
  color: #aaa;
}

.score-col {
  text-align: center;
  min-width: 100px;
}

.score {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  font-size: 1.1rem;
}

.score .winner {
  color: #ef854d;
}

.score-entry {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.score-input {
  width: 40px;
  text-align: center;
  padding: 5px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: white;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status-badge.scheduled {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.status-badge.in_progress {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.status-badge.cancelled {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.actions {
  text-align: center;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.edit {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.action-btn.edit:hover {
  background-color: rgba(33, 150, 243, 0.5);
}

.action-btn.save {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.action-btn.save:hover {
  background-color: rgba(76, 175, 80, 0.5);
}

.action-btn.view {
  background-color: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.action-btn.view:hover {
  background-color: rgba(158, 158, 158, 0.5);
}

.no-data {
  text-align: center;
  color: #aaa;
  font-style: italic;
  padding: 30px;
}

/* Standings Tab */
.no-tournament-message {
  text-align: center;
  padding: 40px;
  color: #aaa;
  background-color: #1e1e1e;
  border-radius: 8px;
}

.tournament-name {
  padding: 15px;
  margin: 0;
  background-color: #2a2a2a;
  color: #ef854d;
  font-size: 1.3rem;
}

.standings-table .position {
  text-align: center;
  font-weight: bold;
}

.standings-table .team-name {
  min-width: 180px;
}

.standings-table .points {
  font-weight: bold;
  color: #ef854d;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.top-three {
  background-color: rgba(239, 133, 77, 0.05);
}

.top-three:hover {
  background-color: rgba(239, 133, 77, 0.1);
}

.legend {
  padding: 15px;
  color: #aaa;
  font-size: 0.85rem;
  text-align: center;
  border-top: 1px solid #333;
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

.match-details {
  padding: 20px;
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.match-tournament {
  font-weight: bold;
  color: #ef854d;
}

.match-date {
  color: #aaa;
}

.match-score-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.match-score-display .team {
  flex: 1;
  text-align: center;
}

.home-team {
  text-align: right;
  padding-right: 20px;
}

.away-team {
  text-align: left;
  padding-left: 20px;
}

.match-score {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.score-value {
  font-size: 2rem;
  font-weight: bold;
}

.score-separator {
  color: #aaa;
  margin: 0 5px;
}

.team-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.match-stats h4,
.match-notes h4 {
  color: #ef854d;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.stats-table {
  width: 100%;
  margin-bottom: 20px;
}

.stats-table th {
  text-align: center;
  background-color: transparent;
  color: #aaa;
  text-transform: none;
  font-weight: normal;
  width: 33%;
}

.stats-table td {
  border-bottom: none;
}

.home-stat {
  text-align: right;
}

.away-stat {
  text-align: left;
}

.match-notes p {
  color: #ddd;
  font-style: italic;
}

/* Responsive */
@media (max-width: 992px) {
  .team-col {
    min-width: auto;
  }

  .matches-table th:nth-child(2),
  .matches-table td:nth-child(2) {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .matches-table th:nth-child(1),
  .matches-table td:nth-child(1) {
    display: none;
  }

  .standings-table th:nth-child(3),
  .standings-table th:nth-child(4),
  .standings-table th:nth-child(5),
  .standings-table th:nth-child(6),
  .standings-table td:nth-child(3),
  .standings-table td:nth-child(4),
  .standings-table td:nth-child(5),
  .standings-table td:nth-child(6) {
    display: none;
  }

  .match-score-display {
    flex-direction: column;
    gap: 15px;
  }

  .home-team,
  .away-team {
    text-align: center;
    padding: 0;
  }
}
</style>
