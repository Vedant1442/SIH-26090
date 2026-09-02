const fs = require('fs');
let f = 'mobile/app/(tabs)/_layout.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/variant="[^"]+"/g, '');
fs.writeFileSync(f, c);
