const { sequelize } = require("../config/database");
const Admin = require("./Admin");
const Tournament = require("./Tournament");
const Team = require("./Team");
const TournamentTeam = require("./TournamentTeam");
const Match = require("./Match");
const { createDefaultAdmin } = require("../seeders/adminSeeder");

// Définition des associations
// Admin - Tournament
Admin.hasMany(Tournament, { foreignKey: "createdById" });
Tournament.belongsTo(Admin, { foreignKey: "createdById" });

// Tournament - Team (Many-to-Many)
Tournament.belongsToMany(Team, {
  through: TournamentTeam,
  foreignKey: "tournamentId",
});
Team.belongsToMany(Tournament, {
  through: TournamentTeam,
  foreignKey: "teamId",
});

// Associations directes avec TournamentTeam
Tournament.hasMany(TournamentTeam, { foreignKey: "tournamentId" });
TournamentTeam.belongsTo(Tournament, { foreignKey: "tournamentId" });

Team.hasMany(TournamentTeam, { foreignKey: "teamId" });
TournamentTeam.belongsTo(Team, { foreignKey: "teamId" });

// Tournament - Match
Tournament.hasMany(Match, { foreignKey: "tournamentId" });
Match.belongsTo(Tournament, { foreignKey: "tournamentId" });

// Team - Match (comme équipe à domicile)
Team.hasMany(Match, { foreignKey: "homeTeamId", as: "homeMatches" });
Match.belongsTo(Team, { foreignKey: "homeTeamId", as: "homeTeam" });

// Team - Match (comme équipe à l'extérieur)
Team.hasMany(Match, { foreignKey: "awayTeamId", as: "awayMatches" });
Match.belongsTo(Team, { foreignKey: "awayTeamId", as: "awayTeam" });

const syncDatabase = async () => {
  try {
    // Sync tous les modèles avec la base de données
    await sequelize.sync({ force: false });
    console.log("🔄 Base de données synchronisée");

    // Créer l'administrateur par défaut si nécessaire
    await createDefaultAdmin();
  } catch (error) {
    console.error("❌ Erreur de synchronisation:", error);
  }
};

module.exports = {
  sequelize,
  Admin,
  Tournament,
  Team,
  TournamentTeam,
  Match,
  syncDatabase,
};
