import { themeList, loadTheme, flatten } from './helpers.js';
import { mkdir, writeFile } from 'fs/promises';

const OUT_DIR = 'built'

// TODO: replace this with intended no-error mkdir way
await mkdir(OUT_DIR).catch(() => {});

let list = await themeList();
let themes = await Promise.all(list.map(async theme => [theme, await loadTheme(theme)]));

// Full theme manifest
const all_themes = [];
for (let [ id, theme ] of themes) {
    const tags = new Set(theme.tags ?? []);
    if (theme.variables.light) {
        tags.add('light');
    } else {
        tags.add('dark');
    }
    
    all_themes.push({
        ...theme,
        tags: [...tags].slice(0, 10)
    });
}

writeFile(`${OUT_DIR}/all.json`, JSON.stringify(all_themes));

// Manifest separated from themes
let manifest = {
    generated: new Date().toUTCString(),
    themes: {}
};

for (let [ id, theme ] of themes) {
    let out = {
        ...flatten(theme.variables),
        css: theme.css
    };

    delete theme.variables;
    delete theme.css;

    writeFile(`${OUT_DIR}/theme_${id}.json`, JSON.stringify(out));

    let { slug, ...t } = theme;
    manifest.themes[slug] = t;
}

writeFile(`${OUT_DIR}/manifest.json`, JSON.stringify(manifest));
