# Fluent Emoji A9R

Converts the name structure from the official [Microsoft's Fluent Emoji](https://github.com/microsoft/fluentui-emoji) release.

Originally, they use CLDR Short Name in their folder structure. To access them directly in a Nuxt/Vue component with minimal code, they have to be converted to Unicode codepoint (U+code).

# Usage

1. Fetch the icons from Microsoft's Fluent Emoji](https://github.com/microsoft/fluentui-emoji) repo (~130mb).

`git clone https://github.com/microsoft/fluentui-emoji.git`

2. Use the script `convert.py`

`python convert.py`

3. Copy the content of the output folder `fluentui-emoji-converted` to `/assets/fluent-emojis/` in the Nuxt project.