<script setup>
import { ref } from "vue";
import field from "../components/cards/field.vue";
const matchesList = ref({
  success: true,
  data: [
    {
      id: 1,
      homeTeamId: 3,
      awayTeamId: 7,
      homeTeam: {
        id: 3,
        name: "Les Titans",
        logo: "titans_logo.png",
      },
      awayTeam: {
        id: 7,
        name: "Les Chatons",
        logo: "chatons_logo.png",
      },
      tournamentId: 1,
      playedDate: "2025-03-15T17:00:00.000Z",
      location: "Terrain A",
      status: "scheduled",
      homeScore: 3,
      awayScore: 1,
    },
    {
      id: 2,
      homeTeamId: 5,
      awayTeamId: 2,
      homeTeam: {
        id: 5,
        name: "Les Faucons",
        logo: "faucons_logo.png",
      },
      awayTeam: {
        id: 2,
        name: "Les Loups",
        logo: "loups_logo.png",
      },
      tournamentId: 1,
      playedDate: "2025-03-16T16:30:00.000Z",
      location: "Terrain B",
      status: "scheduled",
      homeScore: 3,
      awayScore: 0,
    },
    {
      id: 3,
      homeTeamId: 4,
      awayTeamId: 8,
      homeTeam: {
        id: 4,
        name: "Les Dragons",
        logo: "dragons_logo.png",
      },
      awayTeam: {
        id: 8,
        name: "Les Requins",
        logo: "requins_logo.png",
      },
      tournamentId: 1,
      playedDate: "2025-03-20T18:15:00.000Z",
      location: "Terrain A",
      status: "scheduled",
      homeScore: 3,
      awayScore: 5,
    },
    {
      id: 4,
      homeTeamId: 1,
      awayTeamId: 6,
      homeTeam: {
        id: 1,
        name: "Les Aigles",
        logo: "aigles_logo.png",
      },
      awayTeam: {
        id: 6,
        name: "Les Lions",
        logo: "lions_logo.png",
      },
      tournamentId: 1,
      playedDate: "2025-03-22T15:45:00.000Z",
      location: "Terrain C",
      status: "scheduled",
      homeScore: 3,
      awayScore: 1,
    },
    {
      id: 5,
      homeTeamId: 9,
      awayTeamId: 10,
      homeTeam: {
        id: 9,
        name: "Les Panthères",
        logo: "pantheres_logo.png",
      },
      awayTeam: {
        id: 10,
        name: "Les Comètes",
        logo: "cometes_logo.png",
      },
      tournamentId: 1,
      playedDate: "2025-03-25T19:00:00.000Z",
      location: "Terrain B",
      status: "scheduled",
      homeScore: 8,
      awayScore: 6,
    },
  ],
});
</script>

<template>
  <h1>Les perf' de la semaine</h1>
  <section class="cardsContainer">
    <div class="card" v-for="match in matchesList.data" :key="match.id">
      <field :match="match" :score="true" />
    </div>
  </section>
</template>

<style scoped>
.cardsContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 80%;
  gap: 5%;
  margin: 0 auto;
}
.card {
  display: block;
  width: 30%;
  margin: 40px 0;
}
</style>
