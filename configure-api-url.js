const fs = require('fs');
const path = require('path');
const filesToUpdate = [
  'src/app/petugas/hewan/detail-hewan/detail-hewan.page.ts',
  'src/app/petugas/kegiatan/detail-kegiatan/detail-kegiatan.page.ts',
  'src/app/services/auth.service.ts',
  'src/app/services/kandang.service.ts',
  'src/app/services/kegiatan.service.ts',
  'src/app/services/notifikasi.service.ts',
  'src/app/services/peternak.service.ts',
  'src/app/services/populasi.service.ts',
  'src/app/services/wilayah.service.ts'
];
let updatedCount = 0;

filesToUpdate.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('http://localhost:8000/api')) {
       // Only standard replacements without backticks because some strings might be concatenated
       content = content.replace(/['"]http:\/\/localhost:8000\/api['"]/g, 'environment.apiUrl');
       content = content.replace(/['"]http:\/\/localhost:8000\/api\/([^'"]+)['"]/g, '`${environment.apiUrl}/$1`');
       
       // Handle cases where people did: `http://localhost:8000/api/${something}`
       content = content.replace(/`http:\/\/localhost:8000\/api\//g, '`${environment.apiUrl}/');
       content = content.replace(/`http:\/\/localhost:8000\/api/g, '`${environment.apiUrl}');

       // Make sure environment is imported if we just added it
       if (!content.includes('import { environment }')) {
            // Find depth based on path
            const depth = file.split('/').length - 2;
            let relativeEnvPath = '../'.repeat(depth) + 'environments/environment';
            if (depth === 0) relativeEnvPath = './environments/environment';
            
            // For detail pages
            if(file.includes('detail-hewan')) relativeEnvPath = '../../../../environments/environment';
            if(file.includes('detail-kegiatan')) relativeEnvPath = '../../../../environments/environment';

            // Insert after the last import
            const importLines = content.split('\n');
            let lastImportIndex = 0;
            for(let i=0; i<importLines.length; i++){
                if(importLines[i].startsWith('import ')){
                    lastImportIndex = i;
                }
            }
            importLines.splice(lastImportIndex + 1, 0, `import { environment } from '${relativeEnvPath}';`);
            content = importLines.join('\n');
       }
       
       fs.writeFileSync(fullPath, content);
       console.log('Updated: ' + file);
       updatedCount++;
    }
  }
});
console.log('Total files updated:', updatedCount);
