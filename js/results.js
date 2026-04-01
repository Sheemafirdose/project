let currentCertificateParticipant = null;
let uploadedCertificateTemplate = localStorage.getItem('certificateTemplateImage') || null;
let lastBulkGeneratedFiles = [];

function loadResults() {
    const participants = getParticipants();

    if (participants.length === 0) {
        document.getElementById('topPerformers').innerHTML = '<p class="alert alert-warning">No participants to display.</p>';
        document.getElementById('winningSide').innerHTML = '<p class="alert alert-warning">No data available.</p>';
        document.getElementById('resultsTable').innerHTML = '<tr><td colspan="7" style="text-align: center;">No results available.</td></tr>';
        return;
    }

    const sorted = [...participants].sort((a, b) => b.scores.total - a.scores.total);

    displayTopPerformers(sorted);
    displayWinningSide(participants);
    displayRankings(sorted);
}

function displayTopPerformers(sorted) {
    const top3 = sorted.slice(0, 3);
    const container = document.getElementById('topPerformers');

    const medals = ['&#129351;', '&#129352;', '&#129353;'];

    container.innerHTML = top3.map((participant, index) => `
        <div style="background: rgba(15, 23, 42, 0.58); backdrop-filter: blur(14px); border: 1px solid ${index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : '#d97706'}; box-shadow: 0 10px 24px rgba(2, 6, 23, 0.3); padding: 1.5rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${medals[index]}</div>
            <h3 style="margin-bottom: 0.5rem; color: #f1f5f9;">${participant.name}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">${participant.college}</p>
            <p style="font-size: 1.5rem; font-weight: bold; color: #93c5fd;">${participant.scores.total} points</p>
        </div>
    `).join('');
}

function displayWinningSide(participants) {
    const forSide = participants.filter(p => p.side === 'For');
    const againstSide = participants.filter(p => p.side === 'Against');

    const forAvg = forSide.length > 0 ? forSide.reduce((sum, p) => sum + p.scores.total, 0) / forSide.length : 0;
    const againstAvg = againstSide.length > 0 ? againstSide.reduce((sum, p) => sum + p.scores.total, 0) / againstSide.length : 0;

    const container = document.getElementById('winningSide');

    container.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); padding: 1.5rem; border-radius: 12px; text-align: center; border: 1px solid ${forAvg >= againstAvg ? '#10b981' : '#334155'}; box-shadow: 0 8px 18px rgba(2, 6, 23, 0.25);">
            <h3 style="margin-bottom: 0.5rem; color: #ecfdf5;">For</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--success-color);">${forAvg.toFixed(1)}</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Average Score</p>
            <p style="margin-top: 0.5rem;">${forSide.length} participants</p>
        </div>

        <div style="background: rgba(239, 68, 68, 0.16); padding: 1.5rem; border-radius: 12px; text-align: center; border: 1px solid ${againstAvg > forAvg ? '#ef4444' : '#334155'}; box-shadow: 0 8px 18px rgba(2, 6, 23, 0.25);">
            <h3 style="margin-bottom: 0.5rem; color: #fef2f2;">Against</h3>
            <p style="font-size: 2rem; font-weight: bold; color: var(--error-color);">${againstAvg.toFixed(1)}</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Average Score</p>
            <p style="margin-top: 0.5rem;">${againstSide.length} participants</p>
        </div>

        <div style="background: rgba(30, 58, 138, 0.2); padding: 1.5rem; border-radius: 12px; text-align: center; border: 1px solid #60a5fa; box-shadow: 0 8px 18px rgba(2, 6, 23, 0.25);">
            <h3 style="margin-bottom: 0.5rem; color: #dbeafe;">Winner</h3>
            <p style="font-size: 1.5rem; font-weight: bold; color: #93c5fd;">
                ${forAvg > againstAvg ? 'For' : againstAvg > forAvg ? 'Against' : 'Tie'}
            </p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">
                ${forAvg === againstAvg ? 'Equal performance' : `By ${Math.abs(forAvg - againstAvg).toFixed(1)} points`}
            </p>
        </div>
    `;
}

function displayRankings(sorted) {
    const tbody = document.getElementById('resultsTable');

    tbody.innerHTML = sorted.map((participant, index) => `
        <tr>
            <td style="font-weight: bold;">${index + 1}</td>
            <td>${participant.name}</td>
            <td>${participant.college}</td>
            <td>${participant.topic}</td>
            <td>${participant.side || 'Not Assigned'}</td>
            <td style="font-weight: bold; color: #93c5fd;">${participant.scores.total}</td>
            <td>
                <button onclick="generateCertificate(${participant.id})" class="btn btn-success" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                    Generate Certificate
                </button>
            </td>
        </tr>
    `).join('');
}

function getSortedParticipantsByScore() {
    const participants = getParticipants();
    return [...participants].sort((a, b) => (b.scores?.total || 0) - (a.scores?.total || 0));
}

function getParticipantRank(participantId) {
    const sorted = getSortedParticipantsByScore();
    const index = sorted.findIndex(p => p.id === participantId);
    return index >= 0 ? index + 1 : null;
}

function getTopRankBadge(rank) {
    if (!rank || rank > 3) {
        return '';
    }

    const rankMeta = {
        1: { label: 'Top Performer - Rank 1', medal: '&#129351;', color: '#b45309', bg: '#fef3c7', border: '#f59e0b' },
        2: { label: 'Top Performer - Rank 2', medal: '&#129352;', color: '#374151', bg: '#f3f4f6', border: '#9ca3af' },
        3: { label: 'Top Performer - Rank 3', medal: '&#129353;', color: '#92400e', bg: '#ffedd5', border: '#fb923c' }
    };

    const meta = rankMeta[rank];
    return `
        <div style="display: inline-flex; align-items: center; gap: 0.55rem; margin-top: 0.7rem; padding: 0.4rem 0.9rem; border-radius: 999px; border: 2px solid ${meta.border}; background: ${meta.bg}; color: ${meta.color}; font-weight: 700; font-size: 0.92rem;">
            <span style="font-size: 1.15rem; line-height: 1;">${meta.medal}</span>
            <span>${meta.label}</span>
        </div>
    `;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getCurrentTemplateMode() {
    const select = document.getElementById('certificateTemplateMode');
    if (!select) {
        return 'default';
    }
    return select.value;
}

function getTemplateStatusText() {
    const mode = getCurrentTemplateMode();
    if (mode === 'uploaded') {
        return uploadedCertificateTemplate
            ? 'Uploaded template is active.'
            : 'No template uploaded yet. Please upload an image or switch to Default Template.';
    }

    return 'Default certificate template is active.';
}

function refreshTemplateStatus() {
    const statusElement = document.getElementById('templateStatusText');
    const uploadGroup = document.getElementById('uploadTemplateGroup');
    const mode = getCurrentTemplateMode();

    if (uploadGroup) {
        uploadGroup.style.opacity = mode === 'uploaded' ? '1' : '0.55';
    }

    if (statusElement) {
        statusElement.textContent = getTemplateStatusText();
    }
}

function createDefaultCertificateTemplate(participant, rank = null) {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });

    return `
        <div class="certificate-template" id="certificateContent">
            <div class="certificate-inner" style="border: 3px solid #d97706; background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);">
                <div style="width: 100%; text-align: center;">
                    <div class="certificate-title" style="color: #1f2937;">Certificate of Participation</div>
                    <div class="certificate-subtitle">Advanced Debate Management System</div>
                    <div style="height: 2px; width: 220px; margin: 0 auto; background: linear-gradient(to right, #f59e0b, #d97706);"></div>
                    ${getTopRankBadge(rank)}
                </div>

                <div class="certificate-body">
                    <p style="font-size: 1rem; color: #4b5563; margin-bottom: 0.2rem;">This certifies that</p>
                    <div class="certificate-name" style="color: #1d4ed8; border-bottom: 3px solid #1d4ed8;">${escapeHtml(participant.name)}</div>
                    <div class="certificate-details" style="width: 100%; margin-top: 0.3rem; color: #334155;">
                        <p>from <strong>${escapeHtml(participant.college)}</strong></p>
                        <p>Department of <strong>CSE (AI & ML)</strong></p>
                        <p>participated in the debate on <strong>${escapeHtml(participant.topic)}</strong></p>
                        <p>representing the <strong>${escapeHtml(participant.side || 'Unassigned')}</strong> side</p>
                        ${participant.scores.total > 0 ? `<p>with a total score of <strong>${participant.scores.total} points</strong></p>` : ''}
                    </div>
                </div>

                <div class="certificate-footer" style="border-top: 2px solid #e2e8f0;">
                    <div class="signature-section">
                        <div class="signature-line" style="border-top: 2px solid #334155;"></div>
                        <p style="font-size: 0.9rem; color: #475569;">Coordinator</p>
                    </div>
                    <div class="signature-section">
                        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 0.35rem;">Date</p>
                        <p style="font-size: 1rem; color: #1f2937;">${date}</p>
                    </div>
                    <div class="signature-section">
                        <div class="signature-line" style="border-top: 2px solid #334155;"></div>
                        <p style="font-size: 0.9rem; color: #475569;">Director</p>
                    </div>
                </div>

                <div class="certificate-credit">
                    Developed by <strong>Prathap</strong>
                </div>
            </div>
        </div>
    `;
}

function createUploadedCertificateTemplate(participant, rank = null) {
    if (!uploadedCertificateTemplate) {
        return createDefaultCertificateTemplate(participant, rank);
    }

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `
        <div class="uploaded-certificate" id="certificateContent">
            <img class="uploaded-certificate-bg" src="${uploadedCertificateTemplate}" alt="Certificate Template">
            <div class="uploaded-certificate-overlay">
                <h2>Certificate of Participation</h2>
                ${rank && rank <= 3 ? `<p style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.8rem; border-radius: 999px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.65); font-weight: 700;"><span>${rank === 1 ? '&#129351;' : rank === 2 ? '&#129352;' : '&#129353;'}</span><span>Top Performer - Rank ${rank}</span></p>` : ''}
                <p><strong>${escapeHtml(participant.name)}</strong></p>
                <p>${escapeHtml(participant.college)}</p>
                <p>Debate Topic: <strong>${escapeHtml(participant.topic)}</strong></p>
                <p>Side: <strong>${escapeHtml(participant.side || 'Unassigned')}</strong></p>
                ${participant.scores.total > 0 ? `<p>Score: <strong>${participant.scores.total}</strong></p>` : ''}
                <p style="margin-top: 1.5rem; font-size: 1rem;">Date: ${date}</p>
            </div>
        </div>
    `;
}

function generateCertificate(participantId) {
    const participants = getParticipants();
    const participant = participants.find(p => p.id === participantId);

    if (!participant) return;

    currentCertificateParticipant = participant;

    const rank = getParticipantRank(participantId);
    const mode = getCurrentTemplateMode();
    const certificateHTML = mode === 'uploaded'
        ? createUploadedCertificateTemplate(participant, rank)
        : createDefaultCertificateTemplate(participant, rank);

    document.getElementById('certificatePreview').innerHTML = certificateHTML;
    document.getElementById('certificateModal').style.display = 'block';
    refreshTemplateStatus();
}

function renderCurrentCertificate() {
    if (!currentCertificateParticipant) {
        return;
    }

    const mode = getCurrentTemplateMode();
    if (mode === 'uploaded' && !uploadedCertificateTemplate) {
        showAlert('No uploaded template found. Showing default template.', 'warning');
        document.getElementById('certificateTemplateMode').value = 'default';
    }

    const rank = getParticipantRank(currentCertificateParticipant.id);
    const activeMode = getCurrentTemplateMode();
    const html = activeMode === 'uploaded'
        ? createUploadedCertificateTemplate(currentCertificateParticipant, rank)
        : createDefaultCertificateTemplate(currentCertificateParticipant, rank);

    document.getElementById('certificatePreview').innerHTML = html;
    refreshTemplateStatus();
}

function closeCertificateModal() {
    document.getElementById('certificateModal').style.display = 'none';
    currentCertificateParticipant = null;
}

function sanitizeFileName(name) {
    return String(name || 'participant')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '') || 'participant';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

async function createPdfBlobFromCertificateHtml(certificateHTML) {
    const renderRoot = document.createElement('div');
    renderRoot.style.position = 'fixed';
    renderRoot.style.left = '-99999px';
    renderRoot.style.top = '0';
    renderRoot.style.zIndex = '-1';
    renderRoot.innerHTML = certificateHTML;
    document.body.appendChild(renderRoot);

    try {
        const certificateElement = renderRoot.querySelector('#certificateContent');
        if (!certificateElement) {
            throw new Error('Certificate layout not found');
        }

        await waitForImagesLoaded(certificateElement);

        const canvas = await html2canvas(certificateElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        return pdf.output('blob');
    } finally {
        renderRoot.remove();
    }
}

async function generateParticipantCertificatePdf(participant) {
    const rank = getParticipantRank(participant.id);
    const mode = getCurrentTemplateMode();
    const html = mode === 'uploaded'
        ? createUploadedCertificateTemplate(participant, rank)
        : createDefaultCertificateTemplate(participant, rank);

    return createPdfBlobFromCertificateHtml(html);
}

async function generateAllCertificatesZip() {
    const participants = getParticipants();
    if (participants.length === 0) {
        showAlert('No participants found to generate certificates.', 'warning');
        return;
    }

    if (!window.JSZip) {
        showAlert('ZIP generator not available. Please refresh and try again.', 'error');
        return;
    }

    showAlert('Generating certificates for all participants. Please wait...', 'warning');

    const zip = new window.JSZip();
    const generatedFiles = [];

    for (const participant of participants) {
        const pdfBlob = await generateParticipantCertificatePdf(participant);
        const fileName = `certificate_${sanitizeFileName(participant.name)}_${participant.id}.pdf`;
        zip.file(fileName, pdfBlob);
        generatedFiles.push({
            id: participant.id,
            name: participant.name,
            email: participant.email || '',
            fileName
        });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = window.URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = `debate_certificates_${new Date().toISOString().slice(0, 10)}.zip`;
    a.click();
    window.URL.revokeObjectURL(zipUrl);

    lastBulkGeneratedFiles = generatedFiles;
    addLog('Certificates Generated', `${generatedFiles.length} certificates generated as ZIP`);
    showAlert('All certificates generated successfully as ZIP.', 'success');
}

function buildProfessionalEmailBody(participant, fileName) {
    const side = participant.side || 'Unassigned';
    const scoreText = participant.scores?.total ? `${participant.scores.total}` : 'N/A';

    return [
        `Dear ${participant.name},`,
        '',
        'Greetings from the Advanced Debate Management System.',
        'Please find your participation certificate details below:',
        '',
        `Certificate File: ${fileName}`,
        `Debate Topic: ${participant.topic}`,
        `Side: ${side}`,
        `Total Score: ${scoreText}`,
        '',
        'Kindly attach the corresponding PDF certificate from the downloaded ZIP and share/send as required.',
        '',
        'Regards,',
        'Department of CSE (AI & ML)',
        'Advanced Debate Management System'
    ].join('\n');
}

function openMailDraft(participant, fileName) {
    const to = participant.email;
    const subject = `Debate Participation Certificate - ${participant.name}`;
    const body = buildProfessionalEmailBody(participant, fileName);
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
}

async function generateAndPrepareEmailDrafts() {
    const participants = getParticipants();
    if (participants.length === 0) {
        showAlert('No participants found.', 'warning');
        return;
    }

    const emailParticipants = participants.filter(p => isValidEmail(p.email));
    if (emailParticipants.length === 0) {
        showAlert('No valid participant email addresses found.', 'warning');
        return;
    }

    if (lastBulkGeneratedFiles.length !== participants.length) {
        await generateAllCertificatesZip();
    }

    const fileMap = new Map(lastBulkGeneratedFiles.map(item => [item.id, item.fileName]));

    emailParticipants.forEach((participant, index) => {
        const fileName = fileMap.get(participant.id) || `certificate_${sanitizeFileName(participant.name)}_${participant.id}.pdf`;
        setTimeout(() => openMailDraft(participant, fileName), index * 500);
    });

    addLog('Email Drafts Prepared', `${emailParticipants.length} certificate email drafts opened`);
    showAlert('Email drafts opened. Attach the matching PDF files from ZIP and send.', 'success');
}

function clearUploadedTemplate() {
    uploadedCertificateTemplate = null;
    localStorage.removeItem('certificateTemplateImage');

    const uploadInput = document.getElementById('certificateTemplateUpload');
    if (uploadInput) {
        uploadInput.value = '';
    }

    const modeSelect = document.getElementById('certificateTemplateMode');
    if (modeSelect) {
        modeSelect.value = 'default';
    }

    renderCurrentCertificate();
    refreshTemplateStatus();
    showAlert('Uploaded certificate template removed.', 'success');
}

async function waitForImagesLoaded(container) {
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length === 0) {
        return;
    }

    await Promise.all(images.map(img => {
        if (img.complete) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    }));
}

function emailCurrentCertificate() {
    if (!currentCertificateParticipant) {
        showAlert('Please generate a certificate first.', 'warning');
        return;
    }

    const participant = currentCertificateParticipant;
    if (!isValidEmail(participant.email)) {
        showAlert('Participant email address is not valid. Please update their email first.', 'warning');
        return;
    }

    const fileName = `certificate_${sanitizeFileName(participant.name)}_${participant.id}.pdf`;
    const to = participant.email;
    const subject = `Debate Participation Certificate - ${participant.name}`;
    const body = buildProfessionalEmailBody(participant, fileName);
    const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');

    addLog('Certificate Emailed', `Email draft opened for ${participant.name} (${participant.email})`);
    showAlert(`Email draft opened for ${participant.name}. Please download and attach the PDF.`, 'success');
}

async function downloadCertificate() {
    const certificateElement = document.getElementById('certificateContent');

    if (!certificateElement || !currentCertificateParticipant) {
        showAlert('Please generate a certificate first.', 'warning');
        return;
    }

    try {
        await waitForImagesLoaded(certificateElement);

        const canvas = await html2canvas(certificateElement, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

        const fileName = `certificate_${currentCertificateParticipant.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        pdf.save(fileName);

        addLog('Certificate Generated', `Certificate generated for ${currentCertificateParticipant.name}`);
        showAlert('Certificate downloaded successfully!', 'success');

    } catch (error) {
        showAlert('Error generating certificate. Please try again.', 'error');
        console.error('Certificate generation error:', error);
    }
}

document.getElementById('certificateModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCertificateModal();
    }
});

document.getElementById('certificateTemplateMode').addEventListener('change', function() {
    renderCurrentCertificate();
});

document.getElementById('certificateTemplateUpload').addEventListener('change', function(e) {
    const file = e.target.files?.[0];
    if (!file) {
        return;
    }

    if (!file.type.startsWith('image/')) {
        showAlert('Please upload a valid image file.', 'error');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(loadEvent) {
        uploadedCertificateTemplate = loadEvent.target?.result || null;

        if (uploadedCertificateTemplate) {
            localStorage.setItem('certificateTemplateImage', uploadedCertificateTemplate);
            document.getElementById('certificateTemplateMode').value = 'uploaded';
            renderCurrentCertificate();
            showAlert('Template uploaded successfully.', 'success');
        }
    };
    reader.readAsDataURL(file);
});

refreshTemplateStatus();

loadResults();

