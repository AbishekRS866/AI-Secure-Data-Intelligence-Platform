package com.sisa.analyzer.model;

import java.util.List;

public class AnalyzeResponse {
    private String summary;
    private List<Finding> findings;
    private int riskScore; // 0 - 100
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private List<String> insights;

    public AnalyzeResponse() {}

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<Finding> getFindings() { return findings; }
    public void setFindings(List<Finding> findings) { this.findings = findings; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public List<String> getInsights() { return insights; }
    public void setInsights(List<String> insights) { this.insights = insights; }
}
