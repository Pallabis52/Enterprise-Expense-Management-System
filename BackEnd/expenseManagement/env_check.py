import subprocess
import os

def check_maven():
    try:
        result = subprocess.run(["mvn", "-version"], capture_output=True, text=True)
        print("Maven Version Output:")
        print(result.stdout)
        print(result.stderr)
    except Exception as e:
        print(f"Maven not found in PATH: {e}")

def restore_mvnw():
    cwd = r"c:\Users\swain\OneDrive\Desktop\Expense Management\Enterprise-Expense-Management-System\BackEnd\expenseManagement"
    # Basic mvnw.cmd content for Windows
    mvnw_cmd_content = '@REM ----------------------------------------------------------------------------\n@REM Maven2 Start Up Batch script\n@REM ----------------------------------------------------------------------------\n@echo off\nSETLOCAL\nSET "MAVEN_PROJECTBASEDIR=%~dp0"\nset MAVEN_CMD_LINE_ARGS=%*\n"%MAVEN_PROJECTBASEDIR%\\.mvn\\wrapper\\maven-wrapper.jar" %MAVEN_CMD_LINE_ARGS%\n'
    # Actually, a better way is to just use 'mvn' if it's in path.
    # But let's try to see if git can restore it now.
    try:
        subprocess.run(["git", "checkout", "HEAD", "--", "mvnw", "mvnw.cmd"], cwd=cwd)
    except:
        pass

if __name__ == "__main__":
    check_maven()
    restore_mvnw()
