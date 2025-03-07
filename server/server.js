const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { sequelize, createDatabaseIfNotExists } = require("./config/database");
const { syncDatabase } = require("./models/index");

const adminRoutes = require("./routes/adminRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const matchRoutes = require("./routes/matchRoutes");

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 5000;

// Sécuriser l'application
app.use(helmet());
app.use(cors());
app.use(express.json());

// Protection contre les abus (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limite à 100 requêtes par IP
});
app.use(limiter);

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API de gestion de tournois de baby-foot" });
});

// Gestion des erreurs pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

const startServer = async () => {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log("Connexion à MySQL réussie");
    await syncDatabase();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();
