<!-- Dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Vue d'ensemble</h2>
      <div class="date-filter">
        <select v-model="timeRange" @change="updateDashboard">
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
          <option value="all">Tout le temps</option>
        </select>
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon tournaments">🏆</div>
        <div class="stat-content">
          <h3>Tournois</h3>
          <div class="stat-value">{{ stats.tournaments.total }}</div>
          <div class="stat-details">
            <span class="active">{{ stats.tournaments.active }} actifs</span>
            <span class="pending">{{ stats.tournaments.pending }} à venir</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon teams">👥</div>
        <div class="stat-content">
          <h3>Équipes</h3>
          <div class="stat-value">{{ stats.teams.total }}</div>
          <div class="stat-details">
            <span>{{ stats.teams.registered }} inscrites ce mois</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon matches">⚽</div>
        <div class="stat-content">
          <h3>Matchs</h3>
          <div class="stat-value">{{ stats.matches.total }}</div>
          <div class="stat-details">
            <span class="completed">{{ stats.matches.completed }} joués</span>
            <span class="scheduled">{{ stats.matches.scheduled }} à venir</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon players">👤</div>
        <div class="stat-content">
          <h3>Joueurs</h3>
          <div class="stat-value">{{ stats.players.total }}</div>
          <div class="stat-details">
            <span>{{ stats.players.active }} actifs</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-sections">
      <div class="section upcoming-tournaments">
        <div class="section-header">
          <h3>Prochains tournois</h3>
          <router-link to="/admin/tournaments" class="view-all"
            >Voir tout</router-link
          >
        </div>
        <div class="content-table">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Équipes</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tournament in upcomingTournaments"
                :key="tournament.id">
                <td>{{ tournament.name }}</td>
                <td>{{ formatDate(tournament.startDate) }}</td>
                <td>{{ tournament.teamsCount }} / {{ tournament.maxTeams }}</td>
                <td>
                  <span class="status" :class="tournament.status">
                    {{ formatStatus(tournament.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="upcomingTournaments.length === 0">
                <td colspan="4" class="no-data">Aucun tournoi à venir</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section recent-matches">
        <div class="section-header">
          <h3>Matchs récents</h3>
          <router-link to="/admin/matches" class="view-all"
            >Voir tout</router-link
          >
        </div>
        <div class="content-table">
          <table>
            <thead>
              <tr>
                <th>Équipes</th>
                <th>Score</th>
                <th>Date</th>
                <th>Tournoi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in recentMatches" :key="match.id">
                <td>{{ match.homeTeam }} vs {{ match.awayTeam }}</td>
                <td class="score">
                  {{ match.homeScore }} - {{ match.awayScore }}
                </td>
                <td>{{ formatDate(match.playedDate) }}</td>
                <td>{{ match.tournament }}</td>
              </tr>
              <tr v-if="recentMatches.length === 0">
                <td colspan="4" class="no-data">Aucun match récent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="dashboard-charts">
      <div class="chart tournamentChart">
        <h3>Activité des tournois</h3>
        <div class="chart-container">
          <!-- Ici, nous simulerons un graphique avec une image ou du HTML basique -->
          <div class="chart-placeholder">
            <div class="bar-container">
              <div class="chart-label">Jan</div>
              <div class="chart-bar" style="height: 30%"></div>
            </div>
            <div class="bar-container">
              <div class="chart-label">Fév</div>
              <div class="chart-bar" style="height: 45%"></div>
            </div>
            <div class="bar-container">
              <div class="chart-label">Mar</div>
              <div class="chart-bar" style="height: 65%"></div>
            </div>
            <div class="bar-container">
              <div class="chart-label">Avr</div>
              <div class="chart-bar" style="height: 40%"></div>
            </div>
            <div class="bar-container">
              <div class="chart-label">Mai</div>
              <div class="chart-bar active" style="height: 80%"></div>
            </div>
            <div class="bar-container">
              <div class="chart-label">Jui</div>
              <div class="chart-bar" style="height: 60%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart teamStats">
        <h3>Statistiques des équipes</h3>
        <div class="top-teams">
          <div v-for="team in topTeams" :key="team.id" class="team-stat">
            <div class="team-rank">{{ team.rank }}</div>
            <div class="team-info">
              <div class="team-name">{{ team.name }}</div>
              <div class="team-details">
                <span>{{ team.wins }} V</span>
                <span>{{ team.losses }} D</span>
                <span>{{ team.draws }} N</span>
              </div>
            </div>
            <div class="team-points">{{ team.points }} pts</div>
          </div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3>Actions rapides</h3>
      <div class="action-buttons">
        <router-link
          to="/admin/tournaments/create"
          class="action-btn create-tournament">
          <span class="action-icon">🏆</span>
          <span class="action-text">Créer un tournoi</span>
        </router-link>
        <router-link to="/admin/teams/create" class="action-btn add-team">
          <span class="action-icon">👥</span>
          <span class="action-text">Ajouter une équipe</span>
        </router-link>
        <router-link
          to="/admin/matches/schedule"
          class="action-btn schedule-match">
          <span class="action-icon">📅</span>
          <span class="action-text">Planifier des matchs</span>
        </router-link>
        <router-link to="/admin/results" class="action-btn view-results">
          <span class="action-icon">📊</span>
          <span class="action-text">Voir les résultats</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      timeRange: "month",
      stats: {
        tournaments: {
          total: 12,
          active: 3,
          pending: 4,
        },
        teams: {
          total: 28,
          registered: 5,
        },
        matches: {
          total: 86,
          completed: 72,
          scheduled: 14,
        },
        players: {
          total: 56,
          active: 42,
        },
      },
      upcomingTournaments: [
        {
          id: 1,
          name: "Tournoi de Printemps",
          startDate: "2025-04-15T09:00:00.000Z",
          teamsCount: 8,
          maxTeams: 16,
          status: "registration",
        },
        {
          id: 2,
          name: "Challenge Entreprises",
          startDate: "2025-05-22T14:00:00.000Z",
          teamsCount: 6,
          maxTeams: 8,
          status: "scheduled",
        },
        {
          id: 3,
          name: "Coupe d'Été",
          startDate: "2025-07-10T10:00:00.000Z",
          teamsCount: 4,
          maxTeams: 24,
          status: "registration",
        },
      ],
      recentMatches: [
        {
          id: 1,
          homeTeam: "Les Invincibles",
          awayTeam: "Foosballs",
          homeScore: 10,
          awayScore: 8,
          playedDate: "2025-03-07T16:49:43.000Z",
          tournament: "Tournoi d'Hiver",
        },
        {
          id: 2,
          homeTeam: "Les Titans",
          awayTeam: "Les Comètes",
          homeScore: 10,
          awayScore: 5,
          playedDate: "2025-03-05T14:30:00.000Z",
          tournament: "Tournoi d'Hiver",
        },
        {
          id: 3,
          homeTeam: "Les Dragons",
          awayTeam: "Les Raptors",
          homeScore: 10,
          awayScore: 9,
          playedDate: "2025-03-04T17:15:00.000Z",
          tournament: "Tournoi d'Hiver",
        },
      ],
      topTeams: [
        {
          id: 1,
          rank: 1,
          name: "Les Invincibles",
          wins: 12,
          losses: 2,
          draws: 0,
          points: 36,
        },
        {
          id: 3,
          rank: 2,
          name: "Les Titans",
          wins: 10,
          losses: 4,
          draws: 0,
          points: 30,
        },
        {
          id: 5,
          rank: 3,
          name: "Les Dragons",
          wins: 8,
          losses: 4,
          draws: 2,
          points: 26,
        },
        {
          id: 2,
          rank: 4,
          name: "Foosballs",
          wins: 7,
          losses: 6,
          draws: 1,
          points: 22,
        },
        {
          id: 4,
          rank: 5,
          name: "Les Raptors",
          wins: 6,
          losses: 8,
          draws: 0,
          points: 18,
        },
      ],
      recentActivity: [
        {
          type: "tournament",
          text: "Nouveau tournoi créé : <strong>Coupe d'Été</strong>",
          time: "Il y a 2 heures",
        },
        {
          type: "team",
          text: "Nouvelle équipe inscrite : <strong>Les Comètes</strong> pour le tournoi <strong>Challenge Entreprises</strong>",
          time: "Il y a 5 heures",
        },
        {
          type: "match",
          text: "Match terminé : <strong>Les Titans 10 - 5 Les Comètes</strong>",
          time: "Il y a 1 jour",
        },
        {
          type: "team",
          text: "Nouvelle équipe inscrite : <strong>Les Faucons</strong> pour le tournoi <strong>Tournoi de Printemps</strong>",
          time: "Il y a 2 jours",
        },
        {
          type: "match",
          text: "Matchs générés pour le tournoi <strong>Tournoi d'Hiver</strong>",
          time: "Il y a 3 jours",
        },
      ],
    };
  },
  methods: {
    updateDashboard() {
      // Cette méthode serait utilisée pour mettre à jour les données
      // en fonction de la plage de temps sélectionnée
      console.log("Mise à jour du tableau de bord pour:", this.timeRange);
      // Dans un environnement réel, on ferait un appel API ici
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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
  },
  mounted() {
    // Ici, vous pourriez charger les données initiales
    this.updateDashboard();
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.dashboard-header h2 {
  color: #fff;
  font-size: 1.8rem;
  margin: 0;
}

.date-filter select {
  background-color: #1e1e1e;
  color: white;
  border: 1px solid #333;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

.date-filter select:focus {
  border-color: #ef854d;
}

/* Cartes de statistiques */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 15px;
}

.stat-icon.tournaments {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.stat-icon.teams {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.stat-icon.matches {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.stat-icon.players {
  background-color: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #aaa;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.stat-details {
  margin-top: 5px;
  font-size: 0.85rem;
  color: #aaa;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stat-details .active {
  color: #4caf50;
}

.stat-details .pending,
.stat-details .scheduled {
  color: #2196f3;
}

.stat-details .completed {
  color: #ef854d;
}

/* Sections */
.dashboard-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.section {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  color: white;
  font-size: 1.2rem;
}

.view-all {
  color: #ef854d;
  text-decoration: none;
  font-size: 0.9rem;
}

.view-all:hover {
  text-decoration: underline;
}

/* Tables */
.content-table {
  overflow-x: auto;
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
  font-weight: bold;
  color: #aaa;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 1px solid #333;
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

.score {
  font-weight: bold;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status.registration {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.status.scheduled {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.status.in_progress {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.status.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.status.cancelled {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.no-data {
  text-align: center;
  color: #aaa;
  font-style: italic;
}

/* Graphiques */
.dashboard-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.chart {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart h3 {
  margin: 0 0 15px 0;
  color: white;
  font-size: 1.2rem;
}

.chart-container {
  height: 200px;
  position: relative;
}

/* Placeholder pour graphique simple */
.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 10px 0;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.chart-bar {
  width: 30px;
  background-color: rgba(239, 133, 77, 0.5);
  border-radius: 3px 3px 0 0;
  transition: all 0.3s ease;
}

.chart-bar:hover,
.chart-bar.active {
  background-color: #ef854d;
}

.chart-label {
  margin-top: 10px;
  color: #aaa;
  font-size: 0.8rem;
}

/* Classement des équipes */
.top-teams {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-stat {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}

.team-stat:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.team-rank {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  margin-right: 15px;
}

.team-info {
  flex: 1;
}

.team-name {
  color: white;
  margin-bottom: 5px;
}

.team-details {
  font-size: 0.8rem;
  color: #aaa;
  display: flex;
  gap: 10px;
}

.team-points {
  font-weight: bold;
  color: #ef854d;
}

/* Actions rapides */
.quick-actions {
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quick-actions h3 {
  margin: 0 0 15px 0;
  color: white;
  font-size: 1.2rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #2a2a2a;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-3px);
}

.create-tournament:hover {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.add-team:hover {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.schedule-match:hover {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.view-results:hover {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.action-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.activity-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 15px;
  font-size: 1.2rem;
}

.activity-icon.tournament {
  background-color: rgba(239, 133, 77, 0.2);
  color: #ef854d;
}

.activity-icon.team {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.activity-icon.match {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.activity-details {
  flex: 1;
}

.activity-text {
  color: white;
  margin-bottom: 5px;
}

.activity-text strong {
  color: #ef854d;
}

.activity-time {
  font-size: 0.8rem;
  color: #aaa;
}

/* Responsive design */
@media (max-width: 992px) {
  .dashboard-sections,
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
