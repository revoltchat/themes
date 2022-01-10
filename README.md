# Revolt Themes

## Folder Structure

```
data
|- theme_slug
   |- Preset.toml
   |- Custom.css (optional)
```

## Preset Information

Each preset comes with a bit of information to identify it.

```toml
# URL friendly name
slug = "my-theme"

# Display name
name = "My Theme"

# Authors' name
creator = "An Individual"

# The commit this preset was built against (optional)
# Should only be specified if you use custom CSS that tends to break between updates
commit = "eea13a3"

# Preset description
description = "neat"

# Tags (optional)
# Must be a single alphanumeric word
tags = ["sunset", "blue"]
```
