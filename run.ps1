$ErrorActionPreference = "Stop"

$MavenDir = ".\apache-maven-3.9.6"
$MavenZip = "maven.zip"

if (-not (Test-Path "$MavenDir\bin\mvn.cmd")) {
    Write-Host "Maven not found. Downloading Apache Maven..."
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile $MavenZip
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $MavenZip -DestinationPath "." -Force
    Remove-Item $MavenZip
    Write-Host "Maven downloaded and extracted."
}

Write-Host "Starting Spring Boot Application..."
& "$MavenDir\bin\mvn.cmd" spring-boot:run
