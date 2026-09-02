const fs = require('fs');
const files = ['mobile/app/(tabs)/index.tsx', 'mobile/app/(tabs)/photo.tsx', 'mobile/app/(tabs)/speak.tsx', 'mobile/app/(tabs)/products.tsx'];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+'@hugeicons\/core-free-icons';/, (match, icons) => {
    const iconList = icons.split(',').map(i => i.trim());
    return iconList.map(i => `import ${i} from '@hugeicons/core-free-icons/dist/esm/${i}';`).join('\n');
  });
  fs.writeFileSync(f, content);
  console.log('Fixed ' + f);
});
