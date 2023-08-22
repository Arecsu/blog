import os
import json
import shutil

folder_path = './fluentui-emoji/assets'
json_file_name = "metadata.json"
output_path = './output'

try:
  shutil.rmtree(output_path)
  print(f"Deleted {output_path} and its contents.")
except Exception as e:
  # print(f"Error: {e}")
  pass

os.mkdir(output_path)

skintones = ['Dark', 'Light', 'Medium', 'Default', 'Medium-Dark', 'Medium-Light']
# the Default skintone doesn't have a unicode modifier. It's just the unicode value
skintones_with_modifiers = {
  'Light':          '1f3fb',
  'Medium-Light':   '1f3fc',
  'Medium':         '1f3fd',
  'Medium-Dark':    '1f3fe',
  'Dark':           '1f3ff'
}

# folders inside each emoji
# 3D     = Fluent Emoji 3D   ==> PNG 256x256
# Color  = Fluent Emoji 3D   ==> SVG
# Flat   = Fluent Emoji Flat ==> SVG
# emojiTypes = ['3D', 'Color', 'Flat']
# skipping 3D because I want to process the format with another app
emojiTypes = ['Color', 'Flat']

# Get a list of subfolders in the specified directory
subfolders = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]

def create_unicode_folder(unicode_value, srcPath, json_srcPath):
  unicode_folder_name = unicode_value.replace(' ', '-')
  destinationPath = os.path.join(output_path, unicode_folder_name)
  os.mkdir(destinationPath)
  # print(srcPath)
  # print(new_path)
  for emojiType in emojiTypes:
    srcPath_emojiType = os.path.join(srcPath, emojiType)
    srcFileNameWithExtension = os.listdir(srcPath_emojiType)[0]
    srcFileExtension = os.path.splitext(srcFileNameWithExtension)[-1]
    srcFilePath_emojiType = os.path.join(srcPath_emojiType, srcFileNameWithExtension)
    destinationFilePath_emojiType = os.path.join(destinationPath, emojiType.lower() + srcFileExtension)
    shutil.copy2(srcFilePath_emojiType, destinationFilePath_emojiType)

  # shutil.copytree(srcPath, new_path)
  # shutil.copy(json_srcPath, unicode_folder_name)


# Iterate through the subfolders and rename them
for folder in subfolders:
    emoji_srcPath = os.path.join(folder_path, folder)
    json_file_path = os.path.join(emoji_srcPath, json_file_name)
    
    with open(json_file_path, "r", encoding="utf-8") as json_file:
      data = json.load(json_file)

    emoji_character = data["glyph"]
    emoji_unicode = data["unicode"]
    hasUnicodeSkinTones = "unicodeSkintones" in data


    if hasUnicodeSkinTones:
      emoji_with_skintone_unicode_group = data["unicodeSkintones"]
      for key in skintones_with_modifiers:
          for emoji_with_skintone_unicode in emoji_with_skintone_unicode_group:
            if skintones_with_modifiers[key] in emoji_with_skintone_unicode:
              emoji_with_skintone_srcPath = os.path.join(emoji_srcPath, key)
              create_unicode_folder(emoji_with_skintone_unicode, emoji_with_skintone_srcPath, json_file_path)
              # print(f'{key} {skintones_with_modifiers[key]} => {unicode_skin_tone}')
      continue
    
    create_unicode_folder(emoji_unicode, emoji_srcPath, json_file_path)


    # if len(data["unicode"]) > 6:
      # print("Glyph:", glyph_value)
      # print(data["unicode"].replace(' ', '-'))
      # if hasUnicodeSkinTones:
        # print("unicodeSkintones:", data["unicodeSkintones"])
        # for skintone in skintones:
            # print('mas que 6')
          # check_path = os.path.join(emoji_parent_path, skintone)
          # if os.path.exists(check_path) == False:
            # print('xddddddd')

#     new_name = f'${hex(ord(folder))}'
#     old_path = os.path.join(folder_path, folder)
#     new_path = os.path.join(folder_path, new_name)
    
#     # Check if the new name already exists, and if so, modify it to avoid conflicts
#     count = 1
#     while os.path.exists(new_path):
#         new_name = f'{folder}-{folder}-{count}'
#         new_path = os.path.join(folder_path, new_name)
#         count += 1

#     # Rename the folder
#     os.rename(old_path, new_path)
#     print(f'Renamed "{folder}" to "{new_name}"')

# print('Folder renaming completed.')

''' javascript
emoji = "🧏‍♀️" // corresponds to  1f469-200d-2695-fe0f
code1 = emoji.codePointAt(0).toString(16) // gives only 1f469
code2 = [...emoji].map(e => e.codePointAt(0).toString(16)).join(`-`) // gives correctly 1f469-200d-2695-fe0f
console.log(code1) // 1f9cf
console.log(code2) // 1f9cf-200d-2640-fe0f


1f9cf
1f9cf-200d-2640-fe0f
'''