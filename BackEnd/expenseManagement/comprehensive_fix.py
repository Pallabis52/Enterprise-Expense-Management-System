import os
import shutil

def comprehensive_fix():
    base_dir = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement\src\main\java"
    target_dir = os.path.join(base_dir, "com", "expensemanagement")
    
    # 1. Rename directories to lowercase in target_dir
    if os.path.exists(target_dir):
        items = os.listdir(target_dir)
        for item in items:
            path = os.path.join(target_dir, item)
            if os.path.isdir(path) and item != item.lower():
                tmp = os.path.join(target_dir, item + "_V4_TMP")
                dst = os.path.join(target_dir, item.lower())
                try:
                    os.rename(path, tmp)
                    if os.path.exists(dst):
                        for sub in os.listdir(tmp):
                            shutil.move(os.path.join(tmp, sub), os.path.join(dst, sub))
                        os.rmdir(tmp)
                    else:
                        os.rename(tmp, dst)
                    print(f"Renamed folder {item} to {item.lower()}")
                except Exception as e:
                    print(f"Error renaming folder {item}: {e}")

    # 2. Fix content in all Java files recursively from base_dir
    replacements = {
        ".AI": ".ai",
        ".Controller": ".controller",
        ".Config": ".config",
        ".DTO": ".dto",
        ".Entities": ".entities",
        ".Exception": ".exception",
        ".Notification": ".notification",
        ".Repository": ".repository",
        ".Security": ".security",
        ".Services": ".services",
        ".service": ".services", # merge service into services
        "package com.expensemanagement.Entities;": "package com.expensemanagement.entities;",
        "package com.expensemanagement.Repository;": "package com.expensemanagement.repository;",
        "package com.expensemanagement.Services;": "package com.expensemanagement.services;",
        "package com.expensemanagement.Controller;": "package com.expensemanagement.controller;",
        "package com.expensemanagement.Config;": "package com.expensemanagement.config;",
        "package com.expensemanagement.DTO;": "package com.expensemanagement.dto;",
        "package com.expensemanagement.AI;": "package com.expensemanagement.ai;",
        "com.ExpenseManagement": "com.expensemanagement"
    }

    # Also handle imports more safely with word boundaries or specific prefix
    # But for simplicity let's do a broad replacement as these are very specific to this project
    
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
                        # print(f"Fixed content in: {file_path}")
                except Exception as e:
                    print(f"Error processing file {file_path}: {e}")

if __name__ == "__main__":
    comprehensive_fix()
    print("Fix completed successfully.")
