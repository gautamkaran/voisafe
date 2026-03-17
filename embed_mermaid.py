import re
import os

readme_path = r'c:\Users\karan\Desktop\vps\voisafe\README.md'

with open(readme_path, 'r', encoding='utf-8') as f:
    readme_content = f.read()

def replace_with_mermaid(match):
    alt_text = match.group(1)
    svg_path = match.group(2)
    
    # Deriving mmd path from svg path
    mmd_filename = os.path.basename(svg_path).replace('.svg', '.mmd')
    mmd_filepath = os.path.join(r'c:\Users\karan\Desktop\vps\voisafe\diagrams', mmd_filename)
    
    try:
        with open(mmd_filepath, 'r', encoding='utf-8') as mmd_file:
            mmd_content = mmd_file.read().strip()
        
        # Format as markdown mermaid block
        return f"```mermaid\n{mmd_content}\n```"
    except Exception as e:
        print(f"Error reading {mmd_filepath}: {e}")
        return match.group(0) # Fallback to original if error

# Regex to find standard Markdown images linked to the diagrams folder
# E.g., ![ER Diagram](diagrams/er_diagram.svg)
pattern = re.compile(r'!\[([^\]]*)\]\((diagrams/[^)]+\.svg)\)')

new_readme_content = pattern.sub(replace_with_mermaid, readme_content)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(new_readme_content)

print("Successfully embedded raw Mermaid code into README.md")
