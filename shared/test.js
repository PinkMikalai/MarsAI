import { participationSchema, contributorSchema, tagSchema, stillSchema } from './schemas/participationSchema.js';
import { commonSchema } from './schemas/commonSchema.js';

console.log('✅ Tous les schémas sont chargés avec succès !');
console.log('📋 Champs du participationSchema:', Object.keys(participationSchema.shape).length, 'champs');
console.log('📋 contributorSchema:', Object.keys(contributorSchema.shape));
console.log('📋 tagSchema:', Object.keys(tagSchema.shape));
console.log('📋 stillSchema:', Object.keys(stillSchema.shape));
console.log('📋 commonSchema:', Object.keys(commonSchema));