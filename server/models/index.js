const { sequelize } = require('../config/database');
const Admin = require('./Admin');

// Ajouter ici les autres modèles à mesure qu'ils sont créés

const syncDatabase = async () => {
  try {
    // Sync tous les modèles avec la base de données
    // force: true va supprimer et recréer les tables (à utiliser avec précaution)
    await sequelize.sync({ force: false });
    console.log('🔄 Base de données synchronisée');
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
  }
};

module.exports = {
  sequelize,
  Admin,
  syncDatabase
};