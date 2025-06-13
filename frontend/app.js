class DevCraftAPI {
    constructor(baseUrl = 'http://localhost:8000') {
        this.baseUrl = baseUrl;
    }

    async analyzeProject(description, features = []) {
        const response = await fetch(`${this.baseUrl}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, features })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur analyse: ${response.statusText}`);
        }
        
        return await response.json();
    }

    async generateProject(projectName, description, features = []) {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                project_name: projectName,
                description,
                features
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur génération: ${response.statusText}`);
        }
        
        return await response.json();
    }

    async getJobStatus(jobId) {
        const response = await fetch(`${this.baseUrl}/api/status/${jobId}`);
        if (!response.ok) {
            throw new Error(`Erreur statut: ${response.statusText}`);
        }
        return await response.json();
    }

    streamLogs(jobId, onLog, onComplete) {
        const eventSource = new EventSource(`${this.baseUrl}/api/logs/${jobId}`);
        
        eventSource.onmessage = (event) => {
            if (event.data === '[STREAM_END]') {
                eventSource.close();
                onComplete();
            } else {
                onLog(event.data);
            }
        };
        
        eventSource.onerror = () => {
            eventSource.close();
            onComplete();
        };
        
        return eventSource;
    }

    getDownloadUrl(jobId) {
        return `${this.baseUrl}/api/download/${jobId}`;
    }
}

// Instance globale
const api = new DevCraftAPI();

// Intégration avec l'interface existante
async function analyzeProject() {
    const description = document.getElementById('projectDescription').value;
    const features = Array.from(document.querySelectorAll('.feature-chip input:checked'))
        .map(cb => cb.closest('.feature-chip').dataset.feature);
    
    try {
        showTypingIndicator();
        const analysis = await api.analyzeProject(description, features);
        hideTypingIndicator();
        displayAnalysisAdvanced(analysis);
    } catch (error) {
        hideTypingIndicator();
        showError(`Erreur d'analyse: ${error.message}`);
    }
}

async function startGeneration() {
    const projectName = generateProjectName();
    const description = conversationState.projectData.description;
    const features = conversationState.projectData.features;
    
    try {
        const result = await api.generateProject(projectName, description, features);
        addMessage('ai', `🚀 Génération lancée ! Job ID: ${result.job_id}`);
        startJobMonitoring(result.job_id);
    } catch (error) {
        showError(`Erreur de génération: ${error.message}`);
    }
}

function startJobMonitoring(jobId) {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.classList.add('active');
    
    // Polling du statut
    const statusInterval = setInterval(async () => {
        try {
            const status = await api.getJobStatus(jobId);
            updateProgressUI(status);
            
            if (status.status === 'completed') {
                clearInterval(statusInterval);
                showDownloadButton(jobId);
            } else if (status.status === 'error') {
                clearInterval(statusInterval);
                showError('Erreur lors de la génération');
            }
        } catch (error) {
            console.error('Erreur monitoring:', error);
        }
    }, 3000);
    
    // Stream des logs
    api.streamLogs(
        jobId,
        (logData) => {
            // Afficher les logs en temps réel
            console.log('Log:', logData);
        },
        () => {
            console.log('Stream terminé');
        }
    );
}

function showDownloadButton(jobId) {
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn-primary';
    downloadBtn.innerHTML = '📥 Télécharger le projet';
    downloadBtn.onclick = () => {
        window.open(api.getDownloadUrl(jobId), '_blank');
    };
    
    document.querySelector('.progress-container').appendChild(downloadBtn);
} 