<script setup>
import { onMounted, ref, watch } from "vue";
const winner = ref("test");
const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  score: {
    type: Boolean,
    required: true,
  },
});
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
};
const checkWinner = () => {
  // Vérifier si les scores existent
  if (props.match.homeScore === null || props.match.awayScore === null) {
    winner.value = "pending"; // Match pas encore joué
    return;
  }

  if (props.match.homeScore > props.match.awayScore) {
    winner.value = "home";
  } else if (props.match.homeScore < props.match.awayScore) {
    winner.value = "away";
  } else {
    winner.value = "draw";
  }
};
onMounted(() => {
  if (props.score) {
    checkWinner();
  }
});

// Surveiller les changements de la prop score
watch(
  () => props.score,
  (newValue) => {
    if (newValue) {
      checkWinner();
    }
  }
);
</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
    <!-- Cadre de la table de babyfoot -->
    <rect
      x="100"
      y="50"
      width="600"
      height="300"
      rx="10"
      fill="#5d4037"
      stroke="#3e2723"
      stroke-width="8" />

    <!-- Surface de jeu -->
    <rect
      x="120"
      y="70"
      width="560"
      height="260"
      fill="#4caf50"
      stroke="#388e3c"
      stroke-width="4" />

    <!-- Ligne centrale -->
    <line x1="400" y1="70" x2="400" y2="330" stroke="white" stroke-width="4" />

    <!-- Cercle central -->
    <circle
      cx="400"
      cy="200"
      r="40"
      fill="none"
      stroke="white"
      stroke-width="4" />

    <!-- Zones de but -->
    <rect
      x="120"
      y="150"
      width="40"
      height="100"
      fill="none"
      stroke="white"
      stroke-width="4" />
    <rect
      x="640"
      y="150"
      width="40"
      height="100"
      fill="none"
      stroke="white"
      stroke-width="4" />

    <!-- Barres -->
    <line
      x1="180"
      y1="70"
      x2="180"
      y2="330"
      stroke="#a1887f"
      stroke-width="6" />
    <line
      x1="260"
      y1="70"
      x2="260"
      y2="330"
      stroke="#a1887f"
      stroke-width="6" />
    <line
      x1="340"
      y1="70"
      x2="340"
      y2="330"
      stroke="#a1887f"
      stroke-width="6" />

    <line
      x1="460"
      y1="70"
      x2="460"
      y2="330"
      stroke="#a1887f"
      stroke-width="6" />
    <line
      x1="540"
      y1="70"
      x2="540"
      y2="330"
      stroke="#a1887f"
      stroke-width="6" />
    <line
      x1="620"
      y1="70"
      x2="620"
      y2="330"
      stroke="#a1887f"
      stroke-width="6" />

    <!-- Joueurs équipe gauche (orange) -->
    <circle
      cx="180"
      cy="130"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="180"
      cy="200"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="180"
      cy="270"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="260"
      cy="150"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="260"
      cy="250"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="340"
      cy="120"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="340"
      cy="200"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="340"
      cy="280"
      r="12"
      fill="#ef854d"
      stroke="#000"
      stroke-width="2" />

    <!-- Joueurs équipe droite (bleu) -->
    <circle
      cx="460"
      cy="120"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="460"
      cy="200"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="460"
      cy="280"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="540"
      cy="150"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="540"
      cy="250"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />

    <circle
      cx="620"
      cy="130"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="620"
      cy="200"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />
    <circle
      cx="620"
      cy="270"
      r="12"
      fill="#2196f3"
      stroke="#000"
      stroke-width="2" />

    <!-- Nom des équipes -->
    <text
      x="220"
      y="30"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#ef854d"
      text-anchor="middle">
      {{ match.homeTeam.name }} {{ winner === "home" ? "&nbsp; 🚀" : "" }}
    </text>
    <text
      x="580"
      y="30"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#2196f3"
      text-anchor="middle">
      {{ match.awayTeam.name }} {{ winner === "away" ? " &nbsp; 🚀" : "" }}
    </text>

    <!-- Poignées sur les côtés -->
    <rect x="80" y="160" width="20" height="80" fill="#3e2723" rx="5" />
    <rect x="700" y="160" width="20" height="80" fill="#3e2723" rx="5" />

    <!-- Score -->
    <rect
      x="350"
      y="10"
      width="100"
      height="40"
      fill="#121212"
      stroke="#ef854d"
      stroke-width="2"
      rx="5" />
    <text
      v-if="!score"
      x="370"
      y="38"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#ffffff">
      {{ formatDate(match.playedDate) }}
    </text>
    <text
      v-if="score"
      x="370"
      y="38"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#ef854d">
      {{ match.homeScore ? match.homeScore : 0 }}
    </text>
    <text
      v-if="score"
      x="400"
      y="38"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#ffffff">
      -
    </text>
    <text
      v-if="score"
      x="420"
      y="38"
      font-family="Arial"
      font-size="24"
      font-weight="bold"
      fill="#2196f3">
      {{ match.awayScore ? match.awayScore : 0 }}
    </text>
  </svg>
</template>
