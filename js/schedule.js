if (!checkJudgeAccess()) {
    // Redirect is handled in checkJudgeAccess.
}

function bindNativePicker(inputId) {
    const input = document.getElementById(inputId);
    if (!input || input.dataset.pickerBound === 'true') {
        return;
    }

    const openPicker = () => {
        try {
            if (typeof input.showPicker === 'function') {
                input.showPicker();
            }
        } catch (_) {
            // Ignore browser restrictions; native fallback still works.
        }
    };

    input.addEventListener('focus', openPicker);
    input.addEventListener('click', openPicker);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openPicker();
        }
    });

    input.dataset.pickerBound = 'true';
}

function initSchedulePickers() {
    bindNativePicker('debateDate');
    bindNativePicker('debateTime');
}

function loadSchedule() {
    const participants = getParticipants();
    const tbody = document.getElementById('scheduleTable');

    if (participants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No participants registered yet.</td></tr>';
        return;
    }

    tbody.innerHTML = participants.map(participant => {
        const schedule = participant.schedule;
        const emailBtn = schedule ? `<button onclick="sendEmailFromTable(${participant.id})" class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem; background-color: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;">📧 Email</button>` : '';
        return `
            <tr>
                <td>${participant.name}</td>
                <td>${participant.topic}</td>
                <td>${participant.side || 'Not Assigned'}</td>
                <td>${schedule?.date || '-'}</td>
                <td>${schedule?.time || '-'}</td>
                <td>${schedule?.venue || '-'}</td>
                <td style="display: flex; gap: 0.5rem;">
                    <button onclick="openScheduleModal(${participant.id})" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                        ${schedule ? 'Edit' : 'Schedule'}
                    </button>
                    ${emailBtn}
                </td>
            </tr>
        `;
    }).join('');
}

function openScheduleModal(participantId) {
    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (!participant) return;

    document.getElementById('participantId').value = participantId;

    if (participant.schedule) {
        document.getElementById('debateDate').value = participant.schedule.date;
        document.getElementById('debateTime').value = participant.schedule.time;
        document.getElementById('venue').value = participant.schedule.venue;
        document.getElementById('sendEmailBtn').style.display = 'block';
    } else {
        document.getElementById('scheduleForm').reset();
        document.getElementById('participantId').value = participantId;
        document.getElementById('sendEmailBtn').style.display = 'none';
    }

    document.getElementById('scheduleModal').style.display = 'block';

    const dateInput = document.getElementById('debateDate');
    setTimeout(() => {
        if (!dateInput) return;
        dateInput.focus();
        try {
            if (typeof dateInput.showPicker === 'function') {
                dateInput.showPicker();
            }
        } catch (_) {
            // Ignore browser restrictions; focus keeps the control active.
        }
    }, 0);
}

function closeScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    document.getElementById('scheduleForm').reset();
}

document.getElementById('scheduleForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const participantId = parseInt(document.getElementById('participantId').value);
    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (participant) {
        participant.schedule = {
            date: document.getElementById('debateDate').value,
            time: document.getElementById('debateTime').value,
            venue: document.getElementById('venue').value
        };

        saveParticipants(participants);
        addLog('Schedule Update', `${participant.name} scheduled for ${participant.schedule.date} at ${participant.schedule.time}`);

        // Show email button after schedule is saved
        document.getElementById('sendEmailBtn').style.display = 'block';
        document.getElementById('saveScheduleBtn').value = 'Update Schedule';

        showAlert('Schedule saved successfully!', 'success');
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
            closeScheduleModal();
            loadSchedule();
        }, 1500);
    }
});

document.getElementById('scheduleModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeScheduleModal();
    }
});

// Email functions
function sendScheduleEmail() {
    const participantId = parseInt(document.getElementById('participantId').value);
    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (participant && participant.schedule) {
        const emailData = generateScheduleEmail(participant);
        if (emailData) {
            sendEmail(emailData);
        }
    } else {
        showAlert('Please save the schedule first', 'error');
    }
}

function sendEmailFromTable(participantId) {
    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (participant && participant.schedule) {
        const emailData = generateScheduleEmail(participant);
        if (emailData) {
            sendEmail(emailData);
        }
    } else {
        showAlert('Schedule information missing', 'error');
    }
}

loadSchedule();
initSchedulePickers();
