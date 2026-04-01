const JUDGE_PASSWORD = 'RGM';

const loginSection = document.getElementById('loginSection');
const scoringSection = document.getElementById('scoringSection');
const accessNotice = document.getElementById('accessNotice');

function resolveNextPage(nextPage) {
    if (!nextPage) {
        return null;
    }

    if (/^https?:\/\//i.test(nextPage) || nextPage.startsWith('/')) {
        return nextPage;
    }

    return `/${nextPage.replace(/^\/+/, '')}`;
}

function checkExistingLogin() {
    const judgeLoggedIn = localStorage.getItem('judgeLoggedIn');
    if (judgeLoggedIn === 'true') {
        const nextPage = sessionStorage.getItem('judgeNextPage');
        if (nextPage) {
            sessionStorage.removeItem('judgeNextPage');
            window.location.href = resolveNextPage(nextPage);
            return;
        }
        showScoringSection();
    } else {
        const notice = sessionStorage.getItem('judgeAccessNotice');
        if (notice) {
            accessNotice.textContent = notice;
            accessNotice.style.display = 'block';
            sessionStorage.removeItem('judgeAccessNotice');
        }
    }
}

document.getElementById('judgeLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username.length > 0 && password === JUDGE_PASSWORD) {
        localStorage.setItem('judgeLoggedIn', 'true');
        addLog('Judge Login', `Judge logged in successfully`);

        const nextPage = sessionStorage.getItem('judgeNextPage');
        if (nextPage) {
            sessionStorage.removeItem('judgeNextPage');
            window.location.href = resolveNextPage(nextPage);
        } else {
            showScoringSection();
        }
    } else {
        showAlert('Invalid password! Access is allowed only with password RGM.', 'error');
    }
});

function showScoringSection() {
    loginSection.style.display = 'none';
    scoringSection.style.display = 'block';
    loadParticipantsForScoring();
}

function loadParticipantsForScoring() {
    const participants = getParticipants();
    const container = document.getElementById('participantsList');

    if (participants.length === 0) {
        container.innerHTML = '<p class="alert alert-warning">No participants registered yet.</p>';
        return;
    }

    container.innerHTML = participants.map(participant => `
        <div class="glass-container" style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h3 style="margin-bottom: 0.25rem;">${participant.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        ${participant.college} | ${participant.topic}
                        ${participant.side ? ` | <strong>${participant.side}</strong>` : ''}
                    </p>
                </div>
                <div style="text-align: right;">
                    <p style="font-size: 1.5rem; font-weight: bold; color: #93c5fd;">
                        ${participant.scores.total}
                    </p>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">Total Score</p>
                </div>
            </div>

            <form onsubmit="saveScore(event, ${participant.id})" class="scoring-form">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="content_${participant.id}">Content (0-30)</label>
                        <input type="number" id="content_${participant.id}" min="0" max="30" value="${participant.scores.content}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="delivery_${participant.id}">Delivery (0-30)</label>
                        <input type="number" id="delivery_${participant.id}" min="0" max="30" value="${participant.scores.delivery}" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="rebuttal_${participant.id}">Rebuttal (0-40)</label>
                        <input type="number" id="rebuttal_${participant.id}" min="0" max="40" value="${participant.scores.rebuttal}" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Update Score</button>
            </form>
        </div>
    `).join('');
}

function saveScore(event, participantId) {
    event.preventDefault();

    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (participant) {
        const content = parseInt(document.getElementById(`content_${participantId}`).value);
        const delivery = parseInt(document.getElementById(`delivery_${participantId}`).value);
        const rebuttal = parseInt(document.getElementById(`rebuttal_${participantId}`).value);

        participant.scores = {
            content,
            delivery,
            rebuttal,
            total: content + delivery + rebuttal
        };

        saveParticipants(participants);
        addLog('Score Update', `${participant.name} scored ${participant.scores.total} points`);

        showAlert('Score updated successfully!', 'success');
        loadParticipantsForScoring();
    }
}

function logoutJudge() {
    localStorage.removeItem('judgeLoggedIn');
    addLog('Judge Logout', 'Judge logged out');
    window.location.href = '../index.html';
}

checkExistingLogin();
