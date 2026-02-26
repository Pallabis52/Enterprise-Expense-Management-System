import os
import shutil
import re

def definitive_fix():
    print("Starting Definitive Fix...")
    base_dir = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement\src\main\java"
    target_dir = os.path.join(base_dir, "com", "expensemanagement")
    
    # List of subpackages to lowercase
    subs = ["AI", "Controller", "Config", "DTO", "Entities", "Exception", "Notification", "Repository", "Security", "Services", "Service"]

    if not os.path.exists(target_dir):
        print(f"Error: Target dir {target_dir} not found.")
        return

    # 1. Rename directories to lowercase in target_dir
    # Handle 'service' vs 'services' merge first
    service_dir = os.path.join(target_dir, "service")
    services_dir = os.path.join(target_dir, "services")
    if os.path.exists(service_dir) and os.path.exists(services_dir) and service_dir.lower() == services_dir.lower():
        # Case collision handled by renaming to tmp
        pass 
    elif os.path.exists(service_dir) and os.path.exists(services_dir):
        print("Merging 'service' into 'services'...")
        for item in os.listdir(service_dir):
            src = os.path.join(service_dir, item)
            dst = os.path.join(services_dir, item)
            if not os.path.exists(dst):
                shutil.move(src, dst)
            else:
                print(f"Skipping {item} as it already exists in services")
        shutil.rmtree(service_dir)

    # General rename to lowercase
    items = os.listdir(target_dir)
    for item in items:
        item_path = os.path.join(target_dir, item)
        if os.path.isdir(item_path):
            lower_name = item.lower()
            if item != lower_name:
                print(f"Renaming folder {item} -> {lower_name}")
                tmp = item_path + "_tmp_fix"
                os.rename(item_path, tmp)
                dst = os.path.join(target_dir, lower_name)
                if os.path.exists(dst):
                    for sub in os.listdir(tmp):
                        s_src = os.path.join(tmp, sub)
                        s_dst = os.path.join(dst, sub)
                        if not os.path.exists(s_dst):
                            shutil.move(s_src, s_dst)
                    shutil.rmtree(tmp)
                else:
                    os.rename(tmp, dst)

    # 2. Fix content in ALL Java files
    def update_file(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
             with open(filepath, 'r', encoding='latin-1') as f:
                content = f.read()
        
        new_content = content
        # Fix the base package com.ExpenseManagement -> com.expensemanagement
        new_content = re.sub(r'com\.[eE]xpense[mM]anagement', 'com.expensemanagement', new_content)
        
        # Specific fix for subpackages
        for s in subs:
            # Correcting com.expensemanagement.Sub -> com.expensemanagement.sub
            pattern = re.compile(re.escape('com.expensemanagement.') + re.escape(s), re.IGNORECASE)
            new_content = pattern.sub('com.expensemanagement.' + s.lower(), new_content)
        
        # Cleanup 'service' -> 'services'
        new_content = new_content.replace('com.expensemanagement.service.', 'com.expensemanagement.services.')
        # Specific package declarations if missed
        new_content = re.sub(r'package com\.expensemanagement\.service;', r'package com.expensemanagement.services;', new_content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False

    count = 0
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".java"):
                if update_file(os.path.join(root, file)):
                    count += 1
    print(f"Updated package/imports in {count} files.")

    # 3. Clean up ExpenseManagementApplication.java
    app_file = os.path.join(base_dir, "com", "expensemanagement", "ExpenseManagementApplication.java")
    if os.path.exists(app_file):
        with open(app_file, 'r', encoding='utf-8') as f:
            app_content = f.read()
        
        # Remove dual paths and keep only lowercase ones
        app_content = app_content.replace('{"com.expensemanagement.repository", "com.expensemanagement.Repository"}', '"com.expensemanagement.repository"')
        app_content = app_content.replace('{"com.expensemanagement.entities", "com.expensemanagement.Entities"}', '"com.expensemanagement.entities"')
        
        with open(app_file, 'w', encoding='utf-8') as f:
            f.write(app_content)
        print("Cleaned up ExpenseManagementApplication.java")

if __name__ == "__main__":
    definitive_fix()
    print("Fix Completed Successfully.")
