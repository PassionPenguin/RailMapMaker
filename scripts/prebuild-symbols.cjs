const fs = require('fs');
const path = require('path');

async function downloadMaterialSymbols() {
  try {
    const symbolsPath = path.join(__dirname, '..', 'symbols.json');
    const symbols = JSON.parse(fs.readFileSync(symbolsPath, 'utf8'));

    const uniqueSymbols = [...new Set(symbols)].sort((a, b) => a.localeCompare(b));
    const symbolsJoined = uniqueSymbols.join(',');

    const cssUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded&icon_names=${symbolsJoined}&display=block`;
    const cssResponse = await fetch(cssUrl);
    if (!cssResponse.ok) {
      throw new Error(`Failed to fetch CSS: ${cssResponse.status}`);
    }
    const css = await cssResponse.text();

    const urlMatch = css.match(/src:\s*url\(([^)]+)\)/);
    if (!urlMatch) {
      throw new Error('Could not find font URL in CSS');
    }
    const fontUrl = urlMatch[1];

    const fontResponse = await fetch(fontUrl);
    if (!fontResponse.ok) {
      throw new Error(`Failed to fetch font: ${fontResponse.status}`);
    }
    const fontBuffer = Buffer.from(await fontResponse.arrayBuffer());

    const publicPath = path.join(__dirname, '..', 'public');
    const fontsPath = path.join(publicPath, 'fonts');
    fs.mkdirSync(fontsPath, { recursive: true });

    const fontPath = path.join(fontsPath, 'material-symbols.woff');
    fs.writeFileSync(fontPath, fontBuffer);

    const newCss = css.replace(/src:\s*url\([^)]+\)/, 'src: url(/fonts/material-symbols.woff)');
    const cssPath = path.join(__dirname, '..', 'src', 'material-symbols.css');
    fs.writeFileSync(cssPath, newCss);

    console.log('Material Symbols downloaded and processed successfully.');
  } catch (error) {
    const fallbackFontPath = path.join(__dirname, '..', 'public', 'fonts', 'material-symbols.woff');
    const fallbackCssPath = path.join(__dirname, '..', 'src', 'material-symbols.css');
    if (fs.existsSync(fallbackFontPath) && fs.existsSync(fallbackCssPath)) {
      console.warn('Warning: failed to download Material Symbols, using existing local assets instead.');
      console.warn(error);
      return;
    }

    console.error('Error downloading Material Symbols, and no local fallback assets were found:', error);
    process.exit(1);
  }
}

downloadMaterialSymbols();
