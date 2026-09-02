const fs = require('fs');
const path = require('path');

const COLOR_MAP = {
  // Backgrounds
  '#F5F0E6': '#FDF8F5', // Kora Cotton -> Sand
  '#F9F6EF': '#FFFBF9', // Lighter Kora -> Lighter Sand

  // Primary / Actions
  '#2C3E52': '#C2593F', // Indigo Deep -> Terracotta
  '#A8432F': '#8B3A2B', // Madder Red -> Deep Rust

  // Text
  '#3A2E28': '#2A1B18', // Kattha Ink -> Espresso
  '#8A8F94': '#8C7C75', // Slate Mist -> Warm Grey
  
  // Status
  '#D9A441': '#E59F4A', // Turmeric -> Amber
  '#6B7F63': '#738054', // Sage Thread -> Olive
  
  // Dark mode / Photo background
  '#1A1A1A': '#2A1B18',
  '#3F5670': '#A64631', // A lighter variant of terracotta for the camera button in home
};

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [oldColor, newColor] of Object.entries(COLOR_MAP)) {
    // Regex for case-insensitive exact replace
    const regex = new RegExp(oldColor, 'gi');
    if (regex.test(content)) {
      content = content.replace(regex, newColor);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
}

const targetFiles = [
  'mobile/global.css',
  'mobile/app/(tabs)/_layout.tsx',
  'mobile/app/(tabs)/index.tsx',
  'mobile/app/(tabs)/speak.tsx',
  'mobile/app/(tabs)/photo.tsx',
  'mobile/app/(tabs)/products.tsx',
];

targetFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    replaceColorsInFile(fullPath);
  } else {
    console.warn(`File not found: ${fullPath}`);
  }
});
