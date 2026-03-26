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
            const response = await fetch('http://localhost:8080/api/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during analysis. Make sure the backend is running.');
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
