const Admin = require("../models/Admin");

const createDefaultAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà
    const adminCount = await Admin.count();

    if (adminCount === 0) {
      // Aucun admin n'existe, créer l'admin par défaut
      // On passe le mot de passe en clair, le hook beforeCreate se chargera du hachage
      await Admin.create({
        username: "admin",
        email: "admin@babyfoot.com",
        password: "Admin123!",
      });

      console.log("🔑 : Test identifiers");
      console.log("Email: admin@babyfoot.com");
      console.log("Mot de passe: Admin123!");
    } else {
      console.log(
        "ℹ️ Des administrateurs existent déjà, aucun administrateur par défaut créé"
      );
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de la création de l'administrateur par défaut:",
      error
    );
  }
};

module.exports = { createDefaultAdmin };
