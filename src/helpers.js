import { parse } from 'toml';
import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';

export function ensureDefined(object, keys) {
    for (let key of keys) {
        if (typeof object[key] === 'undefined')
            throw `Key ${key} is not present on object.`;
    }
}

export function flatten(object, prefix = '') {
    let newObj = {};
    let actualPrefix = prefix.length === 0 ? '' : prefix + '-';
    for (let key of Object.keys(object)) {
        if (typeof object[key] === 'object') {
            newObj = {
                ...newObj,
                ...flatten(object[key], actualPrefix + key)
            }
        } else {
            newObj[actualPrefix + key] = object[key];
        }
    }

    return newObj;
}

export const themeList = () => readdir('data');
export const resolve = (theme, file) => `data/${theme}/${file}`;
export async function loadTheme(theme) {
    let file;
    try {
        file = await readFile(resolve(theme, 'Preset.toml'));
    } catch (err) {
        throw `Could not load Preset.toml for ${theme} - does it exist?`
    }

    let data = parse(file.toString());

    try {
        ensureDefined(data, [ 'slug', 'name', 'creator', 'description', 'variables' ]);
    } catch (err) {
        throw `Failed to parse "${theme}": ${err}`;
    }

    let css = resolve(theme, 'Custom.css');
    if (existsSync(css)) {
        data.css = (await readFile(css)).toString();
    }

    return data;
}
