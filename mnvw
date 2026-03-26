#!/bin/sh

# Maven Wrapper Script (simplified)

BASEDIR=$(dirname "$0")

if [ -f "$BASEDIR/.mvn/wrapper/maven-wrapper.jar" ]; then
  java -jar "$BASEDIR/.mvn/wrapper/maven-wrapper.jar" "$@"
else
  echo "Error: Maven wrapper jar not found!"
  exit 1
fi