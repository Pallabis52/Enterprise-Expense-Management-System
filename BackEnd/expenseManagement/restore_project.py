import subprocess
import os

def restore_files():
    cwd = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement"
    commands = [
        ["git", "checkout", "HEAD", "--", "pom.xml"],
        ["git", "checkout", "HEAD", "--", "mvnw"],
        ["git", "checkout", "HEAD", "--", "mvnw.cmd"],
        ["git", "checkout", "HEAD", "--", "run_app.py"],
        ["git", "checkout", "HEAD", "--", "run_mvn.py"]
    ]
    
    results = []
    for cmd in commands:
        try:
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
            results.append({
                "command": ' '.join(cmd),
                "stdout": result.stdout,
                "stderr": result.stderr,
                "code": result.returncode
            })
        except Exception as e:
            results.append({
                "command": ' '.join(cmd),
                "error": str(e)
            })
            
    # Check if files exist now
    files = ["pom.xml", "mvnw", "mvnw.cmd", "run_app.py", "run_mvn.py"]
    for f in files:
        path = os.path.join(cwd, f)
        print(f"{f} exists: {os.path.exists(path)}")
        
    for r in results:
        print(f"--- Result for {r['command']} ---")
        if "error" in r:
            print(f"Error: {r['error']}")
        else:
            print(f"Code: {r['code']}")
            print(f"Stdout: {r['stdout']}")
            print(f"Stderr: {r['stderr']}")

if __name__ == "__main__":
    restore_files()
