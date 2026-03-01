import subprocess
import os
import time

def rebuild_and_run():
    cwd = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement"
    log_file = os.path.join(cwd, "final_rebuild_log.txt")
    
    with open(log_file, "w") as f:
        f.write("--- Starting Clean Rebuild ---\n")
        f.flush()
        
        # 1. mvn clean compile
        print("Running mvn clean compile...")
        try:
            result = subprocess.run(["mvn", "clean", "compile"], cwd=cwd, capture_output=True, text=True)
            f.write("--- MVN CLEAN COMPILE STDOUT ---\n")
            f.write(result.stdout)
            f.write("\n--- MVN CLEAN COMPILE STDERR ---\n")
            f.write(result.stderr)
            f.write(f"\nReturn Code: {result.returncode}\n")
            f.flush()
            
            if result.returncode != 0:
                print("Compilation FAILED. Check logs.")
                return
        except Exception as e:
            f.write(f"FAILED to run mvn compile: {e}\n")
            return

        # 2. mvn spring-boot:run (Background)
        print("Starting spring-boot:run...")
        f.write("\n--- Starting Application ---\n")
        f.flush()
        
        try:
            # We use Popen to run it in the background
            process = subprocess.Popen(
                ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-Xmx256m -Xms128m -Xss256k -XX:+UseSerialGC"], 
                cwd=cwd, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT, 
                text=True
            )
            
            # Read first 100 lines or wait 60 seconds to see if it starts
            start_time = time.time()
            while time.time() - start_time < 90:
                line = process.stdout.readline()
                if not line:
                    break
                f.write(line)
                f.flush()
                if "Started ExpenseManagementApplication" in line:
                    print("Application STARTED successfully!")
                    f.write("\n[SUCCESS] Application detected as started.\n")
                    break
                if "ERROR" in line or "Exception" in line:
                    # Continue reading for a bit to get the full error
                    pass
            
            # If it's still running, let it run in background
            print("Finished monitoring startup phase.")
        except Exception as e:
            f.write(f"FAILED to run spring-boot:run: {e}\n")

if __name__ == "__main__":
    rebuild_and_run()
