import os
import shutil
import sys

def comprehensive_fix():
    print("Starting Comprehensive Fix v5...")
    base_dir = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement\src\main\java"
    # Note: Using lowercase in join might still match uppercase on Windows, but let's be aware.
    target_dir = os.path.join(base_dir, "com", "expensemanagement")
    
    print(f"Target Directory: {target_dir}")
    if not os.path.exists(target_dir):
        print("ERROR: Target directory not found!")
        return

    # 1. Rename directories to lowercase in target_dir
    items = os.listdir(target_dir)
    print(f"Items in target_dir: {items}")
    for item in items:
        path = os.path.join(target_dir, item)
        if os.path.isdir(path) and item != item.lower():
            print(f"Attempting to rename folder: {item} -> {item.lower()}")
            tmp = os.path.join(target_dir, item + "_V5_TMP")
            dst = os.path.join(target_dir, item.lower())
            try:
                # Rename to TMP
                os.rename(path, tmp)
                print(f"  Renamed to TMP: {tmp}")
                # Re-check if destination exists (due to potential race or existing folder)
                if os.path.exists(dst) and dst != tmp:
                    print(f"  Destination {dst} already exists, merging...")
                    for sub in os.listdir(tmp):
                        shutil.move(os.path.join(tmp, sub), os.path.join(dst, sub))
                    os.rmdir(tmp)
                else:
                    os.rename(tmp, dst)
                print(f"  Successfully renamed {item} to {item.lower()}")
            except Exception as e:
                print(f"  FAILED to rename folder {item}: {e}")

    # 2. Fix content in all Java files recursively
    replacements = {
        "com.expensemanagement.AI": "com.expensemanagement.ai",
        "com.expensemanagement.Controller": "com.expensemanagement.controller",
        "com.expensemanagement.Config": "com.expensemanagement.config",
        "com.expensemanagement.DTO": "com.expensemanagement.dto",
        "com.expensemanagement.Entities": "com.expensemanagement.entities",
        "com.expensemanagement.Exception": "com.expensemanagement.exception",
        "com.expensemanagement.Notification": "com.expensemanagement.notification",
        "com.expensemanagement.Repository": "com.expensemanagement.repository",
        "com.expensemanagement.Security": "com.expensemanagement.security",
        "com.expensemanagement.Services": "com.expensemanagement.services",
        "com.expensemanagement.service": "com.expensemanagement.services",
        "com.ExpenseManagement": "com.expensemanagement",
        "com.expensemanagement.repository.AuditLogRepository": "com.expensemanagement.repository.AuditLogRepository" # placeholder
    }

    count = 0
    for dirpath, dirnames, filenames in os.walk(base_dir):
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
                        count += 1
                except Exception as e:
                    print(f"Error processing file {file_path}: {e}")
    print(f"Fixed content in {count} files.")

if __name__ == "__main__":
    comprehensive_fix()
    print("Fix completed.")
