<!-- MatchCalendar.vue -->
<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <h1>Calendrier des Matchs</h1>
      <div class="calendar-controls">
        <button @click="previousMonth" class="control-btn">
          &lt; Précédent
        </button>
        <span class="current-month"
          >{{ currentMonthName }} {{ currentYear }}</span
        >
        <button @click="nextMonth" class="control-btn">Suivant &gt;</button>
      </div>
    </div>

    <div class="calendar-body">
      <!-- Jours de la semaine -->
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>

      <!-- Grille du calendrier -->
      <div class="calendar-grid">
        <!-- Cellules vides pour l'alignement -->
        <div
          v-for="n in firstDayOfMonth"
          :key="'empty-' + n"
          class="calendar-day empty"></div>

        <!-- Jours du mois -->
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="calendar-day"
          :class="{ 'has-matches': hasMatchesOnDay(day), today: isToday(day) }"
          @click="selectDay(day)">
          <span class="day-number">{{ day }}</span>
          <div v-if="hasMatchesOnDay(day)" class="match-indicator">
            {{ getMatchCountForDay(day) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des matchs du jour sélectionné -->
    <div v-if="selectedDay" class="day-matches">
      <h2>
        Matchs du {{ selectedDay }} {{ currentMonthName }} {{ currentYear }}
      </h2>
      <div v-if="selectedDayMatches.length === 0" class="no-matches">
        Aucun match prévu pour cette journée
      </div>
      <div v-else class="matches-list">
        <div
          v-for="match in selectedDayMatches"
          :key="match.id"
          class="match-card">
          <div class="match-header">
            <span class="match-time">{{
              formatTime(match.playedDate || match.scheduledDate)
            }}</span>
            <span :class="['match-status', match.status]">{{
              formatStatus(match.status)
            }}</span>
          </div>
          <div class="match-teams">
            <div class="team home-team">
              <span class="team-name">{{ match.homeTeam.name }}</span>
              <span class="team-players">{{
                formatTeamPlayers(match.homeTeam)
              }}</span>
            </div>
            <div class="match-score">
              <span v-if="match.status === 'completed'">
                {{ match.homeScore }} - {{ match.awayScore }}
              </span>
              <span v-else>VS</span>
            </div>
            <div class="team away-team">
              <span class="team-name">{{ match.awayTeam.name }}</span>
              <span class="team-players">{{
                formatTeamPlayers(match.awayTeam)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchCalendar",
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDay: null,
      weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      // Données simulées
      matches: [
        {
          id: 1,
          tournamentId: 1,
          homeTeamId: 1,
          awayTeamId: 2,
          homeScore: 10,
          awayScore: 8,
          status: "completed",
          scheduledDate: null,
          playedDate: "2025-03-07T16:49:43.000Z",
          createdAt: "2025-03-07T16:48:10.000Z",
          updatedAt: "2025-03-07T16:49:43.000Z",
          homeTeam: {
            id: 1,
            name: "Les Invincibles",
            player1Name: "Thomas Dupont",
            player2Name: "Marie Martin",
            createdAt: "2025-03-07T16:46:22.000Z",
            updatedAt: "2025-03-07T16:46:22.000Z",
          },
          awayTeam: {
            id: 2,
            name: "Foosballs",
            player1Name: "Pierre Lambert",
            player2Name: "Julie Dubois",
            createdAt: "2025-03-07T16:46:37.000Z",
            updatedAt: "2025-03-07T16:46:37.000Z",
          },
        },
        {
          id: 2,
          tournamentId: 1,
          homeTeamId: 3,
          awayTeamId: 4,
          homeScore: null,
          awayScore: null,
          status: "scheduled",
          scheduledDate: "2025-03-15T14:00:00.000Z",
          playedDate: null,
          homeTeam: {
            id: 3,
            name: "Les Titans",
            player1Name: "Jean Moreau",
            player2Name: "Sophie Bernard",
            createdAt: "2025-03-07T16:46:22.000Z",
            updatedAt: "2025-03-07T16:46:22.000Z",
          },
          awayTeam: {
            id: 4,
            name: "Les Raptors",
            player1Name: "Nicolas Petit",
            player2Name: "Camille Leroy",
            createdAt: "2025-03-07T16:46:37.000Z",
            updatedAt: "2025-03-07T16:46:37.000Z",
          },
        },
        {
          id: 3,
          tournamentId: 1,
          homeTeamId: 5,
          awayTeamId: 6,
          homeScore: null,
          awayScore: null,
          status: "scheduled",
          scheduledDate: "2025-03-15T16:30:00.000Z",
          playedDate: null,
          homeTeam: {
            id: 5,
            name: "Les Dragons",
            player1Name: "Philippe Martin",
            player2Name: "Laura Simon",
            createdAt: "2025-03-07T16:46:22.000Z",
            updatedAt: "2025-03-07T16:46:22.000Z",
          },
          awayTeam: {
            id: 6,
            name: "Les Comètes",
            player1Name: "Antoine Dupont",
            player2Name: "Emma Petit",
            createdAt: "2025-03-07T16:46:37.000Z",
            updatedAt: "2025-03-07T16:46:37.000Z",
          },
        },
        {
          id: 4,
          tournamentId: 1,
          homeTeamId: 1,
          awayTeamId: 3,
          homeScore: null,
          awayScore: null,
          status: "scheduled",
          scheduledDate: "2025-03-22T15:00:00.000Z",
          playedDate: null,
          homeTeam: {
            id: 1,
            name: "Les Invincibles",
            player1Name: "Thomas Dupont",
            player2Name: "Marie Martin",
            createdAt: "2025-03-07T16:46:22.000Z",
            updatedAt: "2025-03-07T16:46:22.000Z",
          },
          awayTeam: {
            id: 3,
            name: "Les Titans",
            player1Name: "Jean Moreau",
            player2Name: "Sophie Bernard",
            createdAt: "2025-03-07T16:46:37.000Z",
            updatedAt: "2025-03-07T16:46:37.000Z",
          },
        },
        {
          id: 5,
          tournamentId: 1,
          homeTeamId: 2,
          awayTeamId: 5,
          homeScore: null,
          awayScore: null,
          status: "scheduled",
          scheduledDate: "2025-03-28T18:00:00.000Z",
          playedDate: null,
          homeTeam: {
            id: 2,
            name: "Foosballs",
            player1Name: "Pierre Lambert",
            player2Name: "Julie Dubois",
            createdAt: "2025-03-07T16:46:22.000Z",
            updatedAt: "2025-03-07T16:46:22.000Z",
          },
          awayTeam: {
            id: 5,
            name: "Les Dragons",
            player1Name: "Philippe Martin",
            player2Name: "Laura Simon",
            createdAt: "2025-03-07T16:46:37.000Z",
            updatedAt: "2025-03-07T16:46:37.000Z",
          },
        },
      ],
    };
  },
  computed: {
    // Premier jour du mois (0 = Dimanche, 1 = Lundi, etc.)
    firstDayOfMonth() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay();
    },
    // Nombre de jours dans le mois
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },
    // Nom du mois courant
    currentMonthName() {
      const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ];
      return months[this.currentMonth];
    },
    // Matchs du jour sélectionné
    selectedDayMatches() {
      if (!this.selectedDay) return [];

      const selectedDate = new Date(
        this.currentYear,
        this.currentMonth,
        this.selectedDay
      );
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      return this.matches.filter((match) => {
        const matchDate = new Date(match.playedDate || match.scheduledDate);
        return matchDate >= startOfDay && matchDate <= endOfDay;
      });
    },
  },
  methods: {
    // Navigation entre les mois
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.selectedDay = null;
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.selectedDay = null;
    },
    // Vérifie s'il y a des matchs pour un jour donné
    hasMatchesOnDay(day) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return this.matches.some((match) => {
        const matchDate = new Date(match.playedDate || match.scheduledDate);
        return matchDate >= startOfDay && matchDate <= endOfDay;
      });
    },
    // Retourne le nombre de matchs pour un jour donné
    getMatchCountForDay(day) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return this.matches.filter((match) => {
        const matchDate = new Date(match.playedDate || match.scheduledDate);
        return matchDate >= startOfDay && matchDate <= endOfDay;
      }).length;
    },
    // Sélectionne un jour
    selectDay(day) {
      this.selectedDay = day;
    },
    // Vérifie si le jour est aujourd'hui
    isToday(day) {
      const today = new Date();
      return (
        day === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear()
      );
    },
    // Formate l'heure d'un match
    formatTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    // Formate le statut d'un match
    formatStatus(status) {
      const statusMap = {
        completed: "Terminé",
        scheduled: "Programmé",
        cancelled: "Annulé",
      };
      return statusMap[status] || status;
    },
    // Formate les noms des joueurs d'une équipe
    formatTeamPlayers(team) {
      const formatName = (fullName) => {
        if (!fullName || typeof fullName !== "string") {
          return "";
        }

        const parts = fullName.trim().split(" ");
        if (parts.length === 1) {
          return parts[0];
        }

        const firstName = parts[0];
        const lastInitial = parts[1].charAt(0).toUpperCase();

        return `${firstName}.${lastInitial}`;
      };

      return `${formatName(team.player1Name)} & ${formatName(
        team.player2Name
      )}`;
    },
  },
  mounted() {
    // Sélectionner la date d'aujourd'hui par défaut
    const today = new Date();
    if (
      today.getMonth() === this.currentMonth &&
      today.getFullYear() === this.currentYear
    ) {
      this.selectedDay = today.getDate();
    }
  },
};
</script>

<style scoped>
.calendar-container {
  background-color: #121212;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
  margin: 0 auto;
}

.calendar-header {
  margin-bottom: 20px;
}

h1 {
  color: #ef854d;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8rem;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.control-btn {
  background-color: #1e1e1e;
  color: #ef854d;
  border: 2px solid #ef854d;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background-color: #ef854d;
  color: #121212;
}

.current-month {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 5px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: #ef854d;
  padding: 10px;
  background-color: #1e1e1e;
  border-radius: 5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  position: relative;
  aspect-ratio: 1;
  background-color: #1e1e1e;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
}

.calendar-day:hover {
  background-color: #333;
}

.calendar-day.empty {
  background-color: transparent;
  cursor: default;
}

.day-number {
  position: absolute;
  top: 5px;
  left: 5px;
  font-weight: bold;
}

.has-matches {
  background-color: rgba(239, 133, 77, 0.2);
  border: 1px solid #ef854d;
}

.today {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(239, 133, 77, 0.5);
}

.match-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #ef854d;
  color: #121212;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.day-matches {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.day-matches h2 {
  color: #ef854d;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.no-matches {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.matches-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.match-card {
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.match-time {
  color: #fff;
  font-weight: bold;
}

.match-status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.match-status.completed {
  background-color: #4caf50;
  color: #fff;
}

.match-status.scheduled {
  background-color: #2196f3;
  color: #fff;
}

.match-status.cancelled {
  background-color: #f44336;
  color: #fff;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.match-score {
  padding: 0 15px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #ef854d;
}

.home-team {
  text-align: right;
}

.away-team {
  text-align: left;
}

.team-name {
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
}

.team-players {
  font-size: 0.9rem;
  color: #ccc;
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .calendar-day {
    padding: 5px;
  }

  .day-number {
    font-size: 0.8rem;
  }

  .matches-list {
    grid-template-columns: 1fr;
  }
}
</style>
