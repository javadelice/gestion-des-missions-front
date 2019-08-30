/**
 * Configuration commune à l'environnement de développement et celui de production.
 *
 */
export const config = {
  apiVersion : 'versions',
  apiActuator: 'actuator',
  apiLogin: 'login',
  apiLogout: 'logout',
  apiAuthMe: 'me',
  apiNoteDeFrais: 'notedefrais',
  apiLignesDeFraisFromNdfId: 'notedefrais/',
  apiLignedefrais: 'lignedefrais',
  apiLignesDeFraisFromMissionId: 'notedefrais?mission=',
  apiModifyLigneDeFrais: 'lignedefrais',
  apiAjouterLigneDeFrais: 'lignedefrais',
  apiDeleteLigneDeFrais: 'lignedefrais?id=',
  apiMissions : 'missions'
};
