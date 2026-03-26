document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');

    const resultsSection = document.getElementById('resultsSection');
    const riskLevelValue = document.getElementById('riskLevelValue');
    const riskBadge = document.getElementById('riskBadge');

    const summaryText = document.getElementById('summaryText');
    const insightsList = document.getElementById('insightsList');

    const findingsCount = document.getElementById('findingsCount');
    const findingsTableBody = document.querySelector('#findingsTable tbody');

    // UI Handle File Selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
            textInput.value = ''; // clear text if file is uploaded
        } else {
            fileNameDisplay.textContent = 'No file selected';
        }
    });

    textInput.addEventListener('input', () => {
        if (textInput.value.trim() !== '') {
            fileInput.value = ''; // clear file if text is inputted
            fileNameDisplay.textContent = 'No file selected';
        }
    });

    // Analyze Action
    analyzeBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        const text = textInput.value.trim();

        if (!file && !text) {
            alert('Please upload a file or paste log text to analyze.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('text', text);
        }

        try {
            const response = await fetch("/api/analyze", {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.warn('Backend fetch failed. Automatically simulating backend analysis locally...', error);
            try {
                const data = await localAnalyze(file, text);
                displayResults(data);
            } catch (e) {
                console.error(e);
                alert('An error occurred during local analysis.');
            }
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        const btnText = analyzeBtn.querySelector('.btn-text');
        const loader = analyzeBtn.querySelector('.loader');

        if (isLoading) {
            btnText.textContent = 'Analyzing...';
            loader.classList.remove('hidden');
            analyzeBtn.disabled = true;
        } else {
            btnText.textContent = 'Analyze Logs';
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    }

    async function localAnalyze(file, text) {
        let content = text;
        if (file) {
            content = await file.text();
        }

        const allFindings = [];
        if (!content || content.trim() === '') {
            return { summary: "No content provided.", findings: [], riskScore: 0, riskLevel: "LOW", insights: [] };
        }

        const lines = content.split(/\r?\n/);

        function checkRegex(pattern, line, lineNumber, type, severity, description) {
            const regex = new RegExp(pattern, 'g');
            let match;
            while ((match = regex.exec(line)) !== null) {
                allFindings.push({ type, value: match[0], lineNumber, severity, description });
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i + 1;
            checkRegex('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}', line, lineNumber, "EMAIL", "MEDIUM", "Email address exposed");
            checkRegex('\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', line, lineNumber, "PHONE", "LOW", "Phone number exposed");
            checkRegex('(?:api[_-]?key|token)[\\s:=]+["\']?[A-Za-z0-9-_]{16,}["\']?', line, lineNumber, "API_KEY", "CRITICAL", "API key or token exposed");
            checkRegex('(?:password|passwd|pwd)[\\s:=]+["\']?[^ \\n\\r"\']+["\']?', line, lineNumber, "PASSWORD", "CRITICAL", "Hardcoded password exposed");
            checkRegex('Exception in thread ".+"|at [a-zA-Z0-9.$]+\\.[a-zA-Z0-9_]+\\([a-zA-Z0-9]+\\.java:\\d+\\)', line, lineNumber, "STACK_TRACE", "HIGH", "Stack trace exposure");

            if (line.toLowerCase().includes("select ") && line.toLowerCase().includes(" from ") && line.includes("'")) {
                allFindings.push({ type: "SQL_INJECTION", value: "Possible SQLi detected", lineNumber, severity: "CRITICAL", description: "Suspicious SQL pattern" });
            }
        }

        let score = 0;
        allFindings.forEach(f => {
            if (f.severity === "CRITICAL") score += 30;
            if (f.severity === "HIGH") score += 20;
            if (f.severity === "MEDIUM") score += 10;
            if (f.severity === "LOW") score += 5;
        });
        score = Math.min(score, 100);

        let level = score >= 80 ? "CRITICAL" : (score >= 50 ? "HIGH" : (score >= 20 ? "MEDIUM" : "LOW"));

        let summary = allFindings.length === 0
            ? "No sensitive data or security risks detected in the analyzed logs. The logs appear clean."
            : `Analyzed log file and found ${allFindings.length} potential security issues. The overall risk score is ${score}/100. Immediate attention recommended for Critical and High severity findings.`;

        const insights = [];
        if (allFindings.length === 0) {
            insights.push("System is operating without leaking sensitive information.");
        } else {
            const hasCreds = allFindings.some(f => f.type === "API_KEY" || f.type === "PASSWORD");
            const hasPii = allFindings.some(f => f.type === "EMAIL" || f.type === "PHONE");
            const hasStack = allFindings.some(f => f.type === "STACK_TRACE");

            if (hasCreds) insights.push("CRITICAL: Hardcoded credentials or API keys were detected in logs. These must be rotated immediately and removed from source code/logs.");
            if (hasPii) insights.push("WARNING: PII (Personally Identifiable Information) detected. Ensure logs comply with GDPR/CCPA regulations by masking this data.");
            if (hasStack) insights.push("INFO: Stack traces exposed in logs can reveal internal system architecture to attackers. Consider disabling detailed stack traces in production.");
        }

        return { summary, findings: allFindings, riskScore: score, riskLevel: level, insights };
    }

    function displayResults(data) {
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });

        // Update Risk Badge
        riskLevelValue.textContent = data.riskLevel;
        riskBadge.className = `risk-badge risk-${data.riskLevel}`;

        // Update Summary & Insights
        summaryText.textContent = data.summary;

        insightsList.innerHTML = '';
        if (data.insights && data.insights.length > 0) {
            data.insights.forEach(insight => {
                const li = document.createElement('li');
                li.textContent = insight;
                if (insight.startsWith('CRITICAL')) li.classList.add('CRITICAL');
                else if (insight.startsWith('WARNING')) li.classList.add('WARNING');
                else li.classList.add('INFO');
                insightsList.appendChild(li);
            });
        }

        // Update Findings Table
        findingsCount.textContent = data.findings ? data.findings.length : 0;
        findingsTableBody.innerHTML = '';

        if (data.findings && data.findings.length > 0) {
            // Sort to put critical first
            const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            const sortedFindings = data.findings.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

            sortedFindings.forEach(finding => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${finding.lineNumber}</td>
                    <td><strong>${finding.type}</strong></td>
                    <td><span class="badge ${finding.severity}">${finding.severity}</span></td>
                    <td>${finding.description}<br><small style="color:var(--text-muted); font-family:monospace;">${escapeHtml(finding.value)}</small></td>
                `;
                findingsTableBody.appendChild(tr);
            });
        } else {
            findingsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No findings detected</td></tr>';
        }
    }

    function escapeHtml(unsafe) {
        return (unsafe || '').toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
