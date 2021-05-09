import { themeList, loadTheme, ensureDefined, flatten } from './helpers.js';
import { mkdir, writeFile } from 'fs/promises';

await mkdir('out').catch(() => {});

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

    writeFile(`out/theme_${id}.json`, JSON.stringify(out));

    let { slug, ...t } = theme;
    manifest.themes[slug] = t;
}

writeFile('out/manifest.json', JSON.stringify(manifest));
