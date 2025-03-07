const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authenticateAdmin = async (req, res, next) => {
  try {
    // Récupérer le token du header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Aucun token fourni, accès refusé",
      });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trouver l'admin par son ID
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé",
      });
    }

    // Ajouter l'admin à la requête
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalide",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'authentification",
      error: error.message,
    });
  }
};

module.exports = { authenticateAdmin };
