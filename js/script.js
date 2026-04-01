function navigateTo(page) {
    window.location.href = page;
}

function toAbsolutePath(path) {
    if (!path) return '/';
    if (/^https?:\/\//i.test(path)) return path;
    return `/${path.replace(/^\/+/, '')}`;
}

function checkJudgeAccess() {
    const judgeLoggedIn = localStorage.getItem('judgeLoggedIn');
    if (!judgeLoggedIn || judgeLoggedIn !== 'true') {
        sessionStorage.setItem('judgeAccessNotice', 'This page is restricted to judges only. Please login first.');
        sessionStorage.setItem('judgeNextPage', window.location.href);
        window.location.href = '../pages/judge.html';
        return false;
    }
    return true;
}

function initJudgeProtection() {
    const judgeOnlyCards = document.querySelectorAll('[data-judge-only="true"]');
    judgeOnlyCards.forEach(card => {
        const href = card.getAttribute('onclick');
        if (href) {
            const match = href.match(/navigateTo\('(.+?)'\)/);
            if (match) {
                card.dataset.targetPage = match[1];
            }
        }

        // Disable inline onclick to avoid conflicting double navigation.
        card.removeAttribute('onclick');

        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetPage = this.dataset.targetPage;
            if (!targetPage) {
                return;
            }

            const judgeLoggedIn = localStorage.getItem('judgeLoggedIn') === 'true';
            if (judgeLoggedIn) {
                window.location.href = targetPage;
                return;
            }

            sessionStorage.setItem('judgeNextPage', toAbsolutePath(targetPage));
            window.location.href = 'pages/judge.html';
        });
    });
}

function getParticipants() {
    const data = localStorage.getItem('debateParticipants');
    return data ? JSON.parse(data) : [];
}

function saveParticipants(participants) {
    localStorage.setItem('debateParticipants', JSON.stringify(participants));
}

function addLog(action, details) {
    const logs = getLogs();
    logs.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action: action,
        details: details
    });
    localStorage.setItem('debateLogs', JSON.stringify(logs));
}

function getLogs() {
    const data = localStorage.getItem('debateLogs');
    return data ? JSON.parse(data) : [];
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJudgeProtection);
    } else {
        initJudgeProtection();
    }
}
