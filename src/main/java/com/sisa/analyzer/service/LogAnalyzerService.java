package com.sisa.analyzer.service;

import com.sisa.analyzer.model.AnalyzeResponse;
import com.sisa.analyzer.model.Finding;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LogAnalyzerService {

    private final DetectionEngine detectionEngine;
    private final RiskEngine riskEngine;
    private final OpenAiService openAiService;

    public LogAnalyzerService(DetectionEngine detectionEngine, RiskEngine riskEngine, OpenAiService openAiService) {
        this.detectionEngine = detectionEngine;
        this.riskEngine = riskEngine;
        this.openAiService = openAiService;
    }

    public AnalyzeResponse analyzeText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new AnalyzeResponse();
        }

        List<Finding> allFindings = new ArrayList<>();
        String[] lines = text.split("\\r?\\n");
        
        for (int i = 0; i < lines.length; i++) {
            List<Finding> lineFindings = detectionEngine.analyzeLine(lines[i], i + 1);
            allFindings.addAll(lineFindings);
        }

        int score = riskEngine.calculateRiskScore(allFindings);
        String level = riskEngine.determineRiskLevel(score);
        
        AnalyzeResponse response = new AnalyzeResponse();
        response.setFindings(allFindings);
        response.setRiskScore(score);
        response.setRiskLevel(level);
        
        response.setSummary(openAiService.generateSummary(allFindings, score));
        response.setInsights(openAiService.generateInsights(allFindings));
        
        return response;
    }
}
