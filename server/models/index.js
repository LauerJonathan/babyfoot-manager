const { sequelize } = require('../config/database');
const Admin = require('./Admin');
const { createDefaultAdmin } = require('../seeders/adminSeeder');

// Ajouter ici les autres modèles à mesure qu'ils sont créés

const syncDatabase = async () => {
  try {
    // Sync tous les modèles avec la base de données
    await sequelize.sync({ force: false });
    console.log('🔄 Base de données synchronisée');
    
    // Créer l'administrateur par défaut si nécessaire
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
  }
};

module.exports = {
  sequelize,
  Admin,
  syncDatabase
};