package com.sisa.analyzer.service;

import com.sisa.analyzer.model.Finding;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RiskEngine {

    public int calculateRiskScore(List<Finding> findings) {
        int score = 0;
        for (Finding finding : findings) {
            switch (finding.getSeverity()) {
                case "CRITICAL": score += 30; break;
                case "HIGH": score += 20; break;
                case "MEDIUM": score += 10; break;
                case "LOW": score += 5; break;
            }
        }
        return Math.min(score, 100);
    }

    public String determineRiskLevel(int score) {
        if (score >= 80) return "CRITICAL";
        if (score >= 50) return "HIGH";
        if (score >= 20) return "MEDIUM";
        return "LOW";
    }
}
