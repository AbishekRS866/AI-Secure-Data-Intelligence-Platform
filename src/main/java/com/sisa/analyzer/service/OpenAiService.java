package com.sisa.analyzer.service;

import com.sisa.analyzer.model.Finding;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpenAiService {

    public String generateSummary(List<Finding> findings, int riskScore) {
        if (findings.isEmpty()) {
            return "No sensitive data or security risks detected in the analyzed logs. The logs appear clean.";
        }
        return "Analyzed log file and found " + findings.size() + " potential security issues. " +
               "The overall risk score is " + riskScore + "/100. Immediate attention recommended for Critical and High severity findings.";
    }

    public List<String> generateInsights(List<Finding> findings) {
        List<String> insights = new ArrayList<>();
        if (findings.isEmpty()) {
            insights.add("System is operating without leaking sensitive information.");
            return insights;
        }

        boolean hasCredentials = findings.stream().anyMatch(f -> "API_KEY".equals(f.getType()) || "PASSWORD".equals(f.getType()));
        boolean hasPii = findings.stream().anyMatch(f -> "EMAIL".equals(f.getType()) || "PHONE".equals(f.getType()));
        boolean hasStackTrace = findings.stream().anyMatch(f -> "STACK_TRACE".equals(f.getType()));

        if (hasCredentials) {
            insights.add("CRITICAL: Hardcoded credentials or API keys were detected in logs. These must be rotated immediately and removed from source code/logs.");
        }
        if (hasPii) {
            insights.add("WARNING: PII (Personally Identifiable Information) detected. Ensure logs comply with GDPR/CCPA regulations by masking this data.");
        }
        if (hasStackTrace) {
            insights.add("INFO: Stack traces exposed in logs can reveal internal system architecture to attackers. Consider disabling detailed stack traces in production.");
        }
        
        return insights;
    }
}
