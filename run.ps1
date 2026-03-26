$ErrorActionPreference = "Stop"

# Auto-fix JAVA_HOME if it's pointing to the MSI installer or is missing
$currentJavaHome = [Environment]::GetEnvironmentVariable("JAVA_HOME")
if ([string]::IsNullOrWhiteSpace($currentJavaHome) -or $currentJavaHome.EndsWith(".msi")) {
    Write-Host "Notice: Incorrect JAVA_HOME detected. Auto-fixing for this session..."
    if (Test-Path "C:\Program Files\Java\jdk-17") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
    } elseif (Test-Path "C:\Program Files\Java\jdk-24") {
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-24"
    }
}

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
