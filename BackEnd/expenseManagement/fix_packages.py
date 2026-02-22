import os

def fix_packages(root_dir):
    target = "com.ExpenseManagement"
    replacement = "com.expensemanagement"
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".java"):
                file_path = os.path.join(dirpath, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if target in content:
                        new_content = content.replace(target, replacement)
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    # Adjust path to where the script is located relative to src
    root_dir = os.path.join(os.getcwd(), "src", "main", "java", "com", "expensemanagement")
    print(f"Scanning directory: {root_dir}")
    if os.path.exists(root_dir):
        fix_packages(root_dir)
        print("Done.")
    else:
        print(f"Directory not found: {root_dir}")
