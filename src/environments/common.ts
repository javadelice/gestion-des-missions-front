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
  apiCreateNoteDeFrais: 'notedefrais',
  apiLignesDeFraisFromNdfId: 'notedefrais/',
  apiCheckAllowance: 'mission?idMission=',
  apiLignedefrais: 'lignedefrais',
  apiLignesDeFraisFromMissionId: 'notedefrais?idMission=',
  apiModifyLigneDeFrais: 'lignedefrais',
  apiAjouterLigneDeFrais: 'lignedefrais',
  apiDeleteLigneDeFrais: 'lignedefrais?id=',
  apiMissions : 'missions'
};
