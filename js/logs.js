function loadLogs() {
    const logs = getLogs();
    const container = document.getElementById('logsContainer');

    if (logs.length === 0) {
        container.innerHTML = '<p class="alert alert-warning">No activity logs yet.</p>';
        return;
    }

    const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = sortedLogs.map(log => {
        const date = new Date(log.timestamp);
        const timeStr = date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let logClass = '';
        if (log.action.includes('Registration')) logClass = 'registration';
        else if (log.action.includes('Score')) logClass = 'score';
        else if (log.action.includes('Delete') || log.action.includes('Clear')) logClass = 'delete';

        return `
            <div class="log-entry ${logClass}">
                <div class="log-header">
                    <span class="log-action">${log.action}</span>
                    <span class="log-time">${timeStr}</span>
                </div>
                <div class="log-details">${log.details}</div>
            </div>
        `;
    }).join('');
}

function exportLogs() {
    const logs = getLogs();

    if (logs.length === 0) {
        showAlert('No logs to export!', 'warning');
        return;
    }

    let csvContent = 'Timestamp,Action,Details\n';

    logs.forEach(log => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        csvContent += `"${timestamp}","${log.action}","${log.details}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    addLog('Export', 'Event logs exported');
    showAlert('Logs exported successfully!', 'success');
    loadLogs();
}

function clearLogs() {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone!')) {
        return;
    }

    localStorage.removeItem('debateLogs');
    addLog('System', 'Event logs cleared');
    showAlert('Logs cleared successfully!', 'success');
    loadLogs();
}

loadLogs();
