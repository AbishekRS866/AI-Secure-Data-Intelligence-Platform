<<<<<<< HEAD
# AI Secure Data Intelligence Platform - Beginner's Guide 🚀

Welcome to your 1-day MVP of the AI Secure Data Intelligence Platform! This guide will explain each part of the project, how to run it, and how to test it.

## 📂 Full Project Structure

```text
sisa1/
│
├── pom.xml                                  <-- Maven configuration file (Dependencies)
├── src/main/
│   ├── java/com/sisa/analyzer/
│   │   ├── AnalyzerApplication.java         <-- Spring Boot Main Entry Point
│   │   │
│   │   ├── controller/
│   │   │   └── AnalyzerController.java      <-- Handles API Requests (POST /api/analyze)
│   │   │
│   │   ├── model/
│   │   │   ├── AnalyzeRequest.java          <-- DTO for JSON requests
│   │   │   ├── AnalyzeResponse.java         <-- DTO for the API Response
│   │   │   └── Finding.java                 <-- DTO representing a single detected risk
│   │   │
│   │   └── service/
│   │       ├── DetectionEngine.java         <-- Core Logic: Uses Regex to find PII/Secrets
│   │       ├── RiskEngine.java              <-- Core Logic: Calculates Risk Score (0-100)
│   │       ├── OpenAiService.java           <-- AI Integration: Mocks AI insights
│   │       └── LogAnalyzerService.java      <-- Orchestrator connecting all services
│   │
│   └── resources/
│       ├── application.properties           <-- Spring Boot Configuration
│       └── static/                          <-- Frontend files
│           ├── index.html                   <-- Modern Web UI structure
│           ├── css/styles.css               <-- Styling for the UI (Dark mode, glassmorphism)
│           └── js/app.js                    <-- Javascript logic linking UI to Backend
```

---

## 🧩 Clear Explanation of Each Module

### 1. Spring Boot Backend (Java)
- **Controller Layer (`AnalyzerController`)**: This is the entry point for the REST API. It handles file uploads and text input, reads their contents, and passes them to the Service layer.
- **Service Layer (`LogAnalyzerService`)**: The main "manager" that takes the raw text and coordinates the analysis using the engines.
- **Detection Engine (`DetectionEngine`)**: A specialized component containing Regular Expressions (Regex) designed to spot sensitive data like Emails, Phone numbers, Passwords, API Keys, and Stack Traces.
- **Risk Engine (`RiskEngine`)**: A math-based component that looks at all the findings and assigns a score up to 100 based on the severity of the findings (e.g., getting higher score for Critical API keys).
- **AI Service (`OpenAiService`)**: In this MVP, this acts as a placeholder meant to connect to OpenAI's API. It formulates a final, human-readable insight based on what was detected.

### 2. Frontend (HTML, CSS, JS)
- `index.html`: Contains the layout. It uses a modern layout with a file upload box, text box, and responsive grid system.
- `styles.css`: Uses high-end visual features like "Glassmorphism" (blurring background elements) and animated glowing globes to make the UI look very premium. Risk levels are heavily color-coded to guide user attention.
- `app.js`: Connects to `POST /api/analyze`. It takes the user's file or text, sends it to the Java backend, and gracefully handles loading states and rendering the returned JSON data into beautiful cards and tables.

---

## ▶️ How to Run locally

1. **Install Java & Maven**: Ensure you have Java 17+ and Maven installed on your machine.
2. **Open Terminal**: Navigate to this folder.
3. **Compile & Run**: Execute `mvn spring-boot:run`
*(Note: If you are on Windows and don't have Maven installed globally, you can execute `.\run.ps1` which will download Maven for you.)*
4. **Access the Frontend**: Open your browser and go to `http://localhost:8080`

---

## 🧪 API Testing Using Postman

Even without the frontend, you can test the backend directly using Postman.

### Test 1: Testing with Raw Text (JSON)

1. Open Postman.
2. Change the method to `POST`.
3. Set URL to `http://localhost:8080/api/analyze/json`.
4. Go to **Body** -> **raw** -> **JSON**.
5. Paste the following test payload:
```json
{
  "text": "User login successful for user test@example.com.\nException in thread \"main\" java.lang.NullPointerException\nAPI_KEY=\"AKIAIOSFODNN7EXAMPLE\""
}
```
6. Click **Send**.
7. Observe the clean JSON response showing Risk Score, Findings, and Summary!

Enjoy your powerful MVP! 🌟
=======
# AI-Secure-Data-Intelligence-Platform
>>>>>>> 04c02bcd5699d8a85227af4fd8ad23b1321d6e54
