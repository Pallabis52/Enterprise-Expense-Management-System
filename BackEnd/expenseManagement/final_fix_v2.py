import os
import re

def fix_all():
    print("Standardizing all Java files (v2)...")
    subpackages = ["AI", "Controller", "Config", "DTO", "Entities", "Exception", "Notification", "Repository", "Security", "Services"]
    
    count = 0
    for dirpath, dirnames, filenames in os.walk('src'):
        for filename in filenames:
            if filename.endswith(".java"):
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for s in subpackages:
                        # Replace com.expensemanagement.<Sub> or com.ExpenseManagement.<Sub>
                        # with com.expensemanagement.<sub_lower>
                        pattern = re.compile(r"com\.[eE]xpense[mM]anagement\." + re.escape(s), re.IGNORECASE)
                        new_content = pattern.sub("com.expensemanagement." + s.lower(), new_content)
                    
                    # Also generic com.ExpenseManagement -> com.expensemanagement
                    new_content = re.sub(r"com\.[eE]xpense[mM]anagement(?![\.a-z])", "com.expensemanagement", new_content)

                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        count += 1
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    print(f"Successfully updated {count} files.")

if __name__ == "__main__":
    fix_all()
