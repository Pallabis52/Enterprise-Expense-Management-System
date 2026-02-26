import os

def fix_all():
    print("Standardizing all Java files...")
    replacements = {
        "package com.expensemanagement.AI": "package com.expensemanagement.ai",
        "package com.expensemanagement.Controller": "package com.expensemanagement.controller",
        "package com.expensemanagement.Config": "package com.expensemanagement.config",
        "package com.expensemanagement.DTO": "package com.expensemanagement.dto",
        "package com.expensemanagement.Entities": "package com.expensemanagement.entities",
        "package com.expensemanagement.Exception": "package com.expensemanagement.exception",
        "package com.expensemanagement.Notification": "package com.expensemanagement.notification",
        "package com.expensemanagement.Repository": "package com.expensemanagement.repository",
        "package com.expensemanagement.Security": "package com.expensemanagement.security",
        "package com.expensemanagement.Services": "package com.expensemanagement.services",
        "import com.expensemanagement.AI": "import com.expensemanagement.ai",
        "import com.expensemanagement.Controller": "import com.expensemanagement.controller",
        "import com.expensemanagement.Config": "import com.expensemanagement.config",
        "import com.expensemanagement.DTO": "import com.expensemanagement.dto",
        "import com.expensemanagement.Entities": "import com.expensemanagement.entities",
        "import com.expensemanagement.Exception": "import com.expensemanagement.exception",
        "import com.expensemanagement.Notification": "import com.expensemanagement.notification",
        "import com.expensemanagement.Repository": "import com.expensemanagement.repository",
        "import com.expensemanagement.Security": "import com.expensemanagement.security",
        "import com.expensemanagement.Services": "import com.expensemanagement.services",
        "import com.expensemanagement.service": "import com.expensemanagement.services"
    }

    count = 0
    for dirpath, dirnames, filenames in os.walk('src'):
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
                    print(f"Error processing {file_path}: {e}")
    print(f"Successfully updated {count} files.")

if __name__ == "__main__":
    fix_all()
