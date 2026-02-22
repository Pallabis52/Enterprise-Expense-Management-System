@echo off
mvn clean compile > build_log.txt 2>&1
echo DONE >> build_log.txt
