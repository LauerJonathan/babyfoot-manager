const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const {
  getTournamentMatches,
  updateMatchScore,
  getTournamentStandings,
  getAllMatch,
} = require("../controllers/matchController");

const router = express.Router();

// Routes publiques
router.get("/match", getAllMatch);
router.get("/tournaments/:tournamentId", getTournamentMatches);
router.get("/tournaments/:tournamentId/standings", getTournamentStandings);

// Routes protégées (administrateurs uniquement)
router.put("/:id/score", authenticateAdmin, updateMatchScore);

module.exports = router;
