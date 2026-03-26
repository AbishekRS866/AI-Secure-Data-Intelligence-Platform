package com.sisa.analyzer.controller;

import com.sisa.analyzer.model.AnalyzeRequest;
import com.sisa.analyzer.model.AnalyzeResponse;
import com.sisa.analyzer.service.LogAnalyzerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend to call backend
public class AnalyzerController {

    private final LogAnalyzerService analyzerService;

    public AnalyzerController(LogAnalyzerService analyzerService) {
        this.analyzerService = analyzerService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalyzeResponse> analyze(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "text", required = false) String text) {
        
        String contentToAnalyze = null;

        if (file != null && !file.isEmpty()) {
            try {
                contentToAnalyze = new String(file.getBytes(), StandardCharsets.UTF_8);
            } catch (IOException e) {
                return ResponseEntity.badRequest().build();
            }
        } else if (text != null && !text.trim().isEmpty()) {
            contentToAnalyze = text;
        }

        if (contentToAnalyze == null) {
            return ResponseEntity.badRequest().body(new AnalyzeResponse());
        }

        AnalyzeResponse response = analyzerService.analyzeText(contentToAnalyze);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping(value = "/analyze/json", consumes = "application/json")
    public ResponseEntity<AnalyzeResponse> analyzeJson(@RequestBody AnalyzeRequest request) {
        if (request == null || request.getText() == null) {
            return ResponseEntity.badRequest().build();
        }
        AnalyzeResponse response = analyzerService.analyzeText(request.getText());
        return ResponseEntity.ok(response);
    }
}
