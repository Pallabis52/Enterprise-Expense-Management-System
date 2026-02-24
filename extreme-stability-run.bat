@echo off
echo Starting Backend with EXTREME STABILITY (Low RAM) settings...
:: Target: Windows 11 + 6GB RAM System
:: Pins all memory regions to prevent system-wide 'malloc' failure
:: Decreased stack size and disabled heavy JIT features to save native RAM
java -Xmx320m ^
     -Xms128m ^
     -Xss256k ^
     -XX:MaxDirectMemorySize=64m ^
     -XX:MaxMetaspaceSize=128m ^
     -XX:ReservedCodeCacheSize=64m ^
     -XX:+UseSerialGC ^
     -XX:+ShowCodeDetailsInExceptionMessages ^
     -jar BackEnd/expenseManagement/target/expenseManagement-0.0.1-SNAPSHOT.jar
pause
