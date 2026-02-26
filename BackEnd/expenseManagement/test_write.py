import os

path = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement\src\main\java\com\expensemanagement\entities\Team.java"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace('.Entities', '.entities')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("FILE NOT FOUND")
