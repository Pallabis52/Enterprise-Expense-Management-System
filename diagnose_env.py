import os
import time
import subprocess

def diagnose():
    print("--- System Diagnostics ---")
    print(f"Current Time: {time.ctime()}")
    
    # 1. Memory usage (approximate via system commands)
    try:
        result = subprocess.run(["systeminfo"], capture_output=True, text=True)
        for line in result.stdout.splitlines():
            if "Total Physical Memory" in line or "Available Physical Memory" in line:
                print(line.strip())
    except:
        pass
        
    # 2. Check for Java processes
    print("\n--- Java Processes ---")
    try:
        result = subprocess.run(["tasklist", "/FI", "IMAGENAME eq java.exe"], capture_output=True, text=True)
        print(result.stdout)
    except:
        pass

    # 3. List recent files in root and BackEnd
    print("\n--- Recent Files (Last 1 hour) ---")
    dirs = [
        r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System",
        r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement"
    ]
    
    now = time.time()
    for d in dirs:
        print(f"\nDirectory: {d}")
        if not os.path.exists(d):
            print("Folder does not exist.")
            continue
        for f in os.listdir(d):
            path = os.path.join(d, f)
            try:
                mtime = os.path.getmtime(path)
                if now - mtime < 3600: # 1 hour
                    print(f"[{time.ctime(mtime)}] {f}")
            except:
                pass

if __name__ == "__main__":
    diagnose()
