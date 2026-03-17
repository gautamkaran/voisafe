import re
import os

readme_path = r'c:\Users\karan\Desktop\vps\voisafe\README.md'

with open(readme_path, 'r', encoding='utf-8') as f:
    readme_content = f.read()

# Dictionary to map section headers or diagram names to their corresponding SVG files
svg_map = {
    '4.1 ER Diagram': 'diagrams/er_diagram.svg',
    '4.2 Data Flow Diagram': 'diagrams/data_flow_diagram.svg',
    '4.3.1 Use case diagram': 'diagrams/use_case_diagram.svg',
    '4.3.2 Class diagram': 'diagrams/class_diagram.svg',
    '4.3.3 Component diagram': 'diagrams/component_diagram.svg',
    '4.3.4 Deployment diagram': 'diagrams/deployment_diagram.svg',
    '4.3.5 Activity diagram': 'diagrams/activity_diagram.svg',
    '4.3.6 Sequence diagram': 'diagrams/sequence_diagram.svg',
    '4.4 Architectural Design': 'diagrams/architectural_design.svg',
    '4.5.2 Time Line Chart (Gantt Chart)': 'diagrams/gantt_chart.svg'
}

# Regex to find standard Markdown mermaid blocks
pattern = re.compile(r'```mermaid\n.*?\n```', re.DOTALL)

# Find all blocks
blocks = pattern.findall(readme_content)

if len(blocks) == 10:
    # Replace in order they appear in the file
    svg_paths = list(svg_map.values())
    for i in range(10):
        svg_path = svg_paths[i]
        diagram_name = os.path.basename(svg_path).replace('.svg', '').replace('_', ' ').title()
        replacement = f"![{diagram_name}]({svg_path})"
        readme_content = readme_content.replace(blocks[i], replacement, 1)

    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print("Successfully replaced raw Mermaid code with SVG image links in README.md")
else:
    print(f"Error: Found {len(blocks)} mermaid blocks instead of 10. Could not perform safe replacement.")
