@echo off
mvn spring-boot:run -Dspring-boot.run.profiles=dev -DskipTests > startup_log.txt 2>&1
