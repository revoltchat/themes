import * as fs from "https://deno.land/std@0.119.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.119.0/path/mod.ts";
import * as toml from "https://deno.land/std@0.119.0/encoding/toml.ts";

import primer from "https://cdn.skypack.dev/@primer/primitives?dts";
// import { desaturate } from "https://cdn.skypack.dev/color2k?dts";

type ValueOf<T> = T[keyof T];
type PrimerTheme = ValueOf<typeof primer["colors"]>;

function capitalize(word: string) {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
}

const tags = ["colorblind", "high-contrast"];

function generateTheme(name: string, theme: PrimerTheme) {
  const light = name.includes("light");
  if (!light) {
    theme.canvas.inset = theme.canvas.overlay;
  }

  const variables = {
    light: light,
    accent: light ? theme.accent.emphasis : theme.accent.fg,
    background: theme.canvas.default,
    foreground: theme.fg.default,
    block: theme.scale.gray.at(9),
    "message-box": theme.canvas.default,
    mention: theme.sponsors.fg,
    success: theme.success.fg,
    warning: theme.attention.fg,
    error: theme.danger.fg,
    hover: light ? theme.neutral.muted : theme.neutral.subtle,
    scrollbar: {
      thumb: theme.scale.red.at(4),
      track: "transparent",
    },
    primary: {
      background: theme.canvas.default,
      foreground: theme.fg.default,
      header: theme.canvas.inset,
    },
    secondary: {
      background: theme.canvas.inset,
      foreground: theme.fg.muted,
      header: theme.canvas.inset,
    },
    tertiary: {
      background: theme.canvas.inset,
      foreground: theme.fg.muted,
    },
    status: {
      online: theme.success.fg,
      away: theme.attention.fg,
      busy: theme.danger.fg,
      streaming: theme.done.fg,
      invisible: theme.neutral.emphasis,
    },
    "border-color": theme.border.default,
  };

  const kebabName = name.replaceAll("_", "-");
  const humanName = capitalize(name.replaceAll("_", " "));

  return {
    slug: `primer-${kebabName}`,
    name: `Primer ${humanName}`,
    tags: tags.filter((tag) => kebabName.includes(tag)),
    creator: "bree",
    description: `${humanName} theme using primer color primatives.`,
    version: "1.0.0",
    variables,
  };
}

const themes = Object.entries(primer.colors)
  .map(([name, theme]) => generateTheme(name, theme));

for (const theme of themes) {
  const themeDir = `./data/${theme.slug}/`;

  await fs.ensureDir(themeDir);

  console.log(`Writitng ${themeDir}`);
  await Deno.writeTextFile(
    path.resolve(themeDir, "Preset.toml"),
    toml.stringify(theme),
  );
  await Deno.copyFile(
    "./scripts/primer.css",
    path.resolve(themeDir, "Custom.css"),
  );
}
