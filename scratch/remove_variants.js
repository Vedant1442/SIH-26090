const fs = require('fs');
const files = ['mobile/app/(tabs)/index.tsx', 'mobile/app/(tabs)/photo.tsx', 'mobile/app/(tabs)/speak.tsx', 'mobile/app/(tabs)/products.tsx'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/variant="[^"]+"/g, '');
  fs.writeFileSync(f, content);
  console.log('Fixed variants in ' + f);
});
