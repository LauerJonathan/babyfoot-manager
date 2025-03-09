const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const {
  createTeam,
  getAllTeams,
  addTeamToTournament,
  removeTeamFromTournament,
} = require("../controllers/teamController");

const router = express.Router();

// Routes publiques
router.get("/", getAllTeams);
router.post("/", createTeam);

// Routes protégées (administrateurs uniquement)
router.post("/register", authenticateAdmin, addTeamToTournament);
router.delete(
  "/:teamId/tournaments/:tournamentId",
  authenticateAdmin,
  removeTeamFromTournament
);

module.exports = router;
