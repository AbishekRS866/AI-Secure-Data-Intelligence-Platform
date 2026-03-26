package com.sisa.analyzer.model;

public class Finding {
    private String type;
    private String value;
    private int lineNumber;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private String description;

    public Finding() {}

    public Finding(String type, String value, int lineNumber, String severity, String description) {
        this.type = type;
        this.value = value;
        this.lineNumber = lineNumber;
        this.severity = severity;
        this.description = description;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    
    public int getLineNumber() { return lineNumber; }
    public void setLineNumber(int lineNumber) { this.lineNumber = lineNumber; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
