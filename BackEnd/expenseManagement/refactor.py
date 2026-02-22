
import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace('package com.ExpenseManagement', 'package com.expensemanagement')
        new_content = new_content.replace('import com.ExpenseManagement', 'import com.expensemanagement')
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    start_dir = r"src\main\java\com\expensemanagement"
    for root, dirs, files in os.walk(start_dir):
        for file in files:
            if file.endswith(".java"):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
