import subprocess
import os
import time

def master_repair():
    root_dir = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System"
    backend_dir = os.path.join(root_dir, "BackEnd", "expenseManagement")
    log_file = os.path.join(root_dir, "MASTER_REPAIR_LOG.txt")
    
    with open(log_file, "w") as f:
        f.write(f"--- MASTER REPAIR START: {time.ctime()} ---\n")
        f.flush()
        
        # 1. Kill all java.exe
        f.write("Killing all java.exe processes...\n")
        subprocess.run(["taskkill", "/F", "/IM", "java.exe", "/T"], capture_output=True)
        time.sleep(2)
        
        # 2. Delete target
        target_dir = os.path.join(backend_dir, "target")
        if os.path.exists(target_dir):
            f.write("Deleting target directory...\n")
            subprocess.run(["cmd", "/c", "rmdir", "/s", "/q", target_dir], capture_output=True)
            
        # 3. MVN PACKAGE (Build the JAR)
        f.write("Building JAR (mvn package -DskipTests)...\n")
        f.flush()
        try:
            # We use mvn directly assuming it's in path
            # If not, we'd need mvnw but let's try mvn first as mvnw was missing
            result = subprocess.run(["mvn", "package", "-DskipTests"], cwd=backend_dir, capture_output=True, text=True)
            f.write("--- BUILD STDOUT ---\n")
            f.write(result.stdout)
            f.write("\n--- BUILD STDERR ---\n")
            f.write(result.stderr)
            f.write(f"\nBuild Return Code: {result.returncode}\n")
            f.flush()
            
            if result.returncode != 0:
                 f.write("[RETRY] Build failed with 'mvn'. Trying 'mvnw.cmd'...\n")
                 result = subprocess.run(["cmd", "/c", "mvnw.cmd", "package", "-DskipTests"], cwd=backend_dir, capture_output=True, text=True)
                 f.write(result.stdout)
                 f.write(result.stderr)

            if result.returncode != 0:
                f.write("\n[FATAL] Build failed again. Stop.\n")
                return
        except Exception as e:
            f.write(f"ERROR during building: {e}\n")
            return

        # 4. RUN JAR
        jar_path = os.path.join(backend_dir, "target", "expenseManagement-0.0.1-SNAPSHOT.jar")
        if not os.path.exists(jar_path):
            f.write(f"[ERROR] JAR not found at {jar_path}\n")
            return
            
        f.write(f"Starting JAR: {jar_path} with 512MB limit...\n")
        f.flush()
        
        try:
            # Run in background
            proc = subprocess.Popen(
                ["java", "-Xmx512m", "-jar", jar_path],
                cwd=backend_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            
            # Monitor first 60 seconds
            start_time = time.time()
            while time.time() - start_time < 60:
                line = proc.stdout.readline()
                if not line: break
                f.write(line)
                f.flush()
                if "Started ExpenseManagementApplication" in line:
                    f.write("\n[SUCCESS] Application started!\n")
                    break
        except Exception as e:
            f.write(f"ERROR during execution: {e}\n")

if __name__ == "__main__":
    master_repair()
