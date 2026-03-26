FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# ✅ IMPORTANT FIX (permission issue)
RUN chmod +x mvnw

RUN ./mvnw clean install -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/analyzer-0.0.1-SNAPSHOT.jar"]