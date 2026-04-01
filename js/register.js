document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        id: Date.now(),
        regNumber: document.getElementById('regNumber').value.trim(),
        name: document.getElementById('name').value.trim(),
        college: document.getElementById('college').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        topic: document.getElementById('topic').value,
        experience: document.getElementById('experience').value,
        side: null,
        schedule: null,
        scores: {
            content: 0,
            delivery: 0,
            rebuttal: 0,
            total: 0
        },
        registeredAt: new Date().toISOString()
    };

    const participants = getParticipants();

    const emailExists = participants.some(p => p.email === formData.email);
    if (emailExists) {
        showAlert('A participant with this email already exists!', 'error');
        return;
    }

    participants.push(formData);
    saveParticipants(participants);

    addLog('Registration', `${formData.name} registered for ${formData.topic}`);

    showAlert('Participant registered successfully!', 'success');

    this.reset();

    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
});
