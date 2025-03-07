const express = require("express");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const Admin = require("../models/Admin");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Inscription d'un nouvel administrateur
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Un utilisateur avec cet email ou ce nom d'utilisateur existe déjà",
      });
    }

    // Créer le nouvel admin
    const admin = await Admin.create({
      username,
      email,
      password,
    });

    // Générer un token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
});

// Connexion d'un administrateur
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé",
      });
    }

    // Vérifier le mot de passe
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe incorrect",
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
});

// Route protégée - Obtenir le profil de l'admin connecté
router.get("/profile", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Erreur de récupération du profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
});

module.exports = router;
