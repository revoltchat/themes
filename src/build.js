import { themeList, loadTheme, ensureDefined, flatten } from './helpers.js';
import { mkdir, writeFile } from 'fs/promises';

const OUT_DIR = 'built'

// TODO: replace this with intended no-error mkdir way
await mkdir(OUT_DIR).catch(() => {});

let list = await themeList();
let themes = await Promise.all(list.map(async theme => [theme, await loadTheme(theme)]));

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
