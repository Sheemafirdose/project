if (!checkJudgeAccess()) {
    // Redirect is handled in checkJudgeAccess.
}

function loadParticipants() {
    const participants = getParticipants();
    const tbody = document.getElementById('participantsTable');

    if (participants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No participants registered yet.</td></tr>';
        return;
    }

    const filterCollege = document.getElementById('filterCollege').value;
    const filterSide = document.getElementById('filterSide').value;

    let filtered = participants;

    if (filterCollege) {
        filtered = filtered.filter(p => p.college === filterCollege);
    }

    if (filterSide) {
        if (filterSide === 'Unassigned') {
            filtered = filtered.filter(p => !p.side);
        } else {
            filtered = filtered.filter(p => p.side === filterSide);
        }
    }

    tbody.innerHTML = filtered.map(participant => `
        <tr>
            <td><strong>${participant.regNumber || 'N/A'}</strong></td>
            <td>${participant.name}</td>
            <td>${participant.college}</td>
            <td>${participant.topic}</td>
            <td>
                <select onchange="assignSide(${participant.id}, this.value)" style="padding: 0.5rem; border-radius: 4px;">
                    <option value="" ${!participant.side ? 'selected' : ''}>Not Assigned</option>
                    <option value="For" ${participant.side === 'For' ? 'selected' : ''}>For</option>
                    <option value="Against" ${participant.side === 'Against' ? 'selected' : ''}>Against</option>
                </select>
            </td>
            <td>${formatScheduleStatus(participant)}</td>
            <td>${participant.scores?.total ?? 0}</td>
            <td>
                <button onclick="deleteParticipant(${participant.id})" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function formatScheduleStatus(participant) {
    if (!participant.schedule?.date || !participant.schedule?.time) {
        return 'Not Scheduled';
    }

    const venueText = participant.schedule.venue ? ` (${participant.schedule.venue})` : '';
    return `${participant.schedule.date} ${participant.schedule.time}${venueText}`;
}

function populateCollegeFilter() {
    const participants = getParticipants();
    const colleges = [...new Set(participants.map(p => p.college).filter(Boolean))].sort();
    const filterCollege = document.getElementById('filterCollege');

    filterCollege.innerHTML = '<option value="">All Colleges</option>';

    colleges.forEach(college => {
        const option = document.createElement('option');
        option.value = college;
        option.textContent = college;
        filterCollege.appendChild(option);
    });
}

function filterParticipants() {
    loadParticipants();
}

function assignSide(participantId, side) {
    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (participant) {
        participant.side = side || null;
        saveParticipants(participants);
        addLog('Side Assignment', `${participant.name} assigned to ${side || 'unassigned'}`);
        showAlert('Side assigned successfully!', 'success');
        loadParticipants();
    }
}

function cleanupDuplicates() {
    const participants = getParticipants();
    if (participants.length === 0) {
        showAlert('No participants available for cleanup.', 'warning');
        return;
    }

    const seenEmails = new Set();
    const uniqueParticipants = [];
    let removed = 0;

    participants.forEach(participant => {
        const key = (participant.email || '').trim().toLowerCase();

        if (!key) {
            uniqueParticipants.push(participant);
            return;
        }

        if (!seenEmails.has(key)) {
            seenEmails.add(key);
            uniqueParticipants.push(participant);
        } else {
            removed += 1;
        }
    });

    if (removed === 0) {
        showAlert('No duplicate participants found.', 'warning');
        return;
    }

    saveParticipants(uniqueParticipants);
    addLog('Duplicate Cleanup', `${removed} duplicate participant(s) removed`);
    showAlert(`${removed} duplicate participant(s) removed successfully.`, 'success');
    populateCollegeFilter();
    loadParticipants();
}

function deleteParticipant(participantId) {
    if (!confirm('Are you sure you want to delete this participant?')) {
        return;
    }

    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);
    const filtered = participants.filter(p => p.id !== participantId);

    saveParticipants(filtered);
    addLog('Participant Deleted', `${participant.name} removed from system`);
    showAlert('Participant deleted successfully!', 'success');
    populateCollegeFilter();
    loadParticipants();
}

function exportLineup() {
    const participants = getParticipants();

    if (participants.length === 0) {
        showAlert('No participants to export!', 'warning');
        return;
    }

    let csvContent = 'Name,College,Topic,Side,Total Score\n';

    participants.forEach(p => {
        csvContent += `"${p.name}","${p.college}","${p.topic}","${p.side || 'Not Assigned'}",${p.scores.total}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-lineup-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    addLog('Export', 'Participant lineup exported');
    showAlert('Lineup exported successfully!', 'success');
}

function clearAllData() {
    if (!confirm('Are you sure you want to clear ALL participant data? This action cannot be undone!')) {
        return;
    }

    if (!confirm('This will permanently delete all participants, scores, and schedules. Continue?')) {
        return;
    }

    localStorage.removeItem('debateParticipants');
    addLog('Data Cleared', 'All participant data cleared by judge');
    showAlert('All data cleared successfully!', 'success');
    populateCollegeFilter();
    loadParticipants();
}

populateCollegeFilter();
loadParticipants();
