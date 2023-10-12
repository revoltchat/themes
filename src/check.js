import { themeList, loadTheme, ensureDefined, flatten } from './helpers.js';

let list = await themeList();
let themes = await Promise.all(list.map(async theme => [theme, await loadTheme(theme)]));

for (let [ id, theme ] of themes) {
    let flat = flatten(theme.variables);
    try {
        ensureDefined(
            flat,
            [
                'light',
                'accent',
                'background',
                'foreground',
                'block',
                'message-box',
                'mention',
                'success',
                'warning',
                'error',
                'hover',
                'scrollbar-thumb',
                'scrollbar-track',
                'primary-background',
                'primary-header',
                'secondary-background',
                'secondary-foreground',
                'secondary-header',
                'tertiary-background',
                'tertiary-foreground',
                'status-online',
                'status-away',
                'status-busy',
                'status-streaming',
                'status-invisible',
            ]
        );
    } catch (err) {
        throw `Failed to check "${id}": ${err}`;
    }
}
