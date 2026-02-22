import os

def fix_subpackages(root_dir):
    replacements = {
        "com.expensemanagement.Config": "com.expensemanagement.config",
        "com.expensemanagement.Controller": "com.expensemanagement.controller",
        "com.expensemanagement.DTO": "com.expensemanagement.dto",
        "com.expensemanagement.Entities": "com.expensemanagement.entities",
        "com.expensemanagement.Exception": "com.expensemanagement.exception",
        "com.expensemanagement.Notification": "com.expensemanagement.notification",
        "com.expensemanagement.Repository": "com.expensemanagement.repository",
        "com.expensemanagement.Security": "com.expensemanagement.security",
        "com.expensemanagement.Services": "com.expensemanagement.services"
    }
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".java"):
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for old, new in replacements.items():
                        new_content = new_content.replace(old, new)
                    
                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    root_dir = os.path.join(os.getcwd(), "src", "main", "java", "com", "expensemanagement")
    print(f"Scanning directory: {root_dir}")
    if os.path.exists(root_dir):
        fix_subpackages(root_dir)
        print("Done.")
    else:
        print(f"Directory not found: {root_dir}")
