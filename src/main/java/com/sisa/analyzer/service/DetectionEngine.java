package com.sisa.analyzer.service;

import com.sisa.analyzer.model.Finding;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DetectionEngine {

    private static final String EMAIL_REGEX = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}";
    private static final String PHONE_REGEX = "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b";
    private static final String API_KEY_REGEX = "(?i)(api[_-]?key|token)[\\s:=]+[\"']?[A-Za-z0-9-_]{16,}[\"']?";
    private static final String PASSWORD_REGEX = "(?i)(password|passwd|pwd)[\\s:=]+[\"']?[^ \\n\\r\"']+[\"']?";
    private static final String STACK_TRACE_REGEX = "Exception in thread \".+\"|at [a-zA-Z0-9.$]+\\.[a-zA-Z0-9_]+\\([a-zA-Z0-9]+\\.java:\\d+\\)";

    private final Pattern emailPattern = Pattern.compile(EMAIL_REGEX);
    private final Pattern phonePattern = Pattern.compile(PHONE_REGEX);
    private final Pattern apiKeyPattern = Pattern.compile(API_KEY_REGEX);
    private final Pattern passwordPattern = Pattern.compile(PASSWORD_REGEX);
    private final Pattern stackTracePattern = Pattern.compile(STACK_TRACE_REGEX);

    public List<Finding> analyzeLine(String line, int lineNumber) {
        List<Finding> findings = new ArrayList<>();

        checkPattern(emailPattern, line, lineNumber, "EMAIL", "MEDIUM", "Email address exposed", findings);
        checkPattern(phonePattern, line, lineNumber, "PHONE", "LOW", "Phone number exposed", findings);
        checkPattern(apiKeyPattern, line, lineNumber, "API_KEY", "CRITICAL", "API key or token exposed", findings);
        checkPattern(passwordPattern, line, lineNumber, "PASSWORD", "CRITICAL", "Hardcoded password exposed", findings);
        checkPattern(stackTracePattern, line, lineNumber, "STACK_TRACE", "HIGH", "Stack trace exposure", findings);
        
        // Simple heuristic for generic SQL Injection (very basic for demo)
        if (line.toLowerCase().contains("select ") && line.toLowerCase().contains(" from ") && line.contains("'")) {
            findings.add(new Finding("SQL_INJECTION", "Possible SQLi detected", lineNumber, "CRITICAL", "Suspicious SQL pattern"));
        }

        return findings;
    }

    private void checkPattern(Pattern pattern, String line, int lineNumber, String type, String severity, String description, List<Finding> findings) {
        Matcher matcher = pattern.matcher(line);
        while (matcher.find()) {
            findings.add(new Finding(type, matcher.group(), lineNumber, severity, description));
        }
    }
}
