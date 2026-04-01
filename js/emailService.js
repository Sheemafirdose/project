// Email Service for Schedule Notifications
// Using EmailJS for sending emails

// Initialize EmailJS with your credentials
// Get your credentials from: https://www.emailjs.com/
// Replace with your actual Public Key
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'service_debate_system';
const EMAILJS_TEMPLATE_ID = 'template_schedule_confirm';

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

function generateScheduleEmail(participant) {
    if (!participant || !participant.schedule) {
        return null;
    }

    const { name, email, schedule } = participant;
    const { date, time, venue } = schedule;

    // Format date and time in readable format
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const timeObj = new Date(`2000-01-01T${time}`);
    const formattedTime = timeObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const subject = `Your Debate Schedule Confirmation - ${participant.topic}`;

    const emailContent = `
<html>
<head>
    <style>
        * { margin: 0; padding: 0; }
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.8; 
            color: #000 !important; 
            background-color: #ffffff;
        }
        .container { 
            max-width: 500px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #ffffff;
        }
        .header { 
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: #ffffff !important; 
            padding: 20px; 
            border-radius: 6px; 
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            color: #ffffff !important;
        }
        .greeting {
            font-size: 16px;
            color: #000 !important;
            margin-bottom: 15px;
            font-weight: 500;
        }
        .message {
            font-size: 15px;
            color: #000 !important;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .slot-details { 
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 20px; 
            border-left: 5px solid #f59e0b; 
            margin: 20px 0; 
            border-radius: 6px;
        }
        .slot-details h3 {
            margin: 0 0 15px 0; 
            color: #000 !important;
            font-size: 16px;
            font-weight: 700;
        }
        .detail-row {
            margin: 12px 0;
            font-size: 15px;
            color: #000 !important;
        }
        .label {
            font-weight: 700;
            color: #000 !important;
            display: inline-block;
            width: 70px;
        }
        .value { 
            color: #000 !important;
            font-weight: 700;
        }
        .closing {
            margin-top: 20px;
            color: #000 !important;
            font-size: 14px;
        }
        .footer { 
            text-align: center; 
            color: #666; 
            font-size: 11px; 
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 Debate Schedule Confirmed</h1>
        </div>
        
        <p class="greeting">Dear ${name},</p>
        
        <p class="message">Your debate slot has been scheduled. Here are your details:</p>
        
        <div class="slot-details">
            <h3>Your Slot Details:</h3>
            <div class="detail-row">
                <span class="label">📍 Venue:</span>
                <span class="value">${venue}</span>
            </div>
            <div class="detail-row">
                <span class="label">📆 Date:</span>
                <span class="value">${formattedDate}</span>
            </div>
            <div class="detail-row">
                <span class="label">🕐 Time:</span>
                <span class="value">${formattedTime}</span>
            </div>
        </div>

        <p class="closing">Please arrive 15 minutes before the scheduled time.</p>
        
        <p class="closing">Best regards,<br/><strong>Debate Administration</strong></p>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply directly.</p>
        </div>
    </div>
</body>
</html>
    `;

    return {
        to_email: email,
        to_name: name,
        subject: subject,
        html_content: emailContent,
        participant_name: name,
        debate_date: formattedDate,
        debate_time: formattedTime,
        venue: venue,
        topic: participant.topic
    };
}

function sendEmail(emailData) {
    if (!emailData.to_email) {
        showAlert('Email address not found for participant', 'error');
        return false;
    }

    // Create simple text version of email content
    const emailBody = `Dear ${emailData.to_name},

Your debate slot has been scheduled. Here are your details:

VENUE: ${emailData.venue}
DATE: ${emailData.debate_date}
TIME: ${emailData.debate_time}

Please arrive 15 minutes before the scheduled time.

Best regards,
Debate Administration Team`;

    // Create mailto link
    const mailtoLink = `mailto:${emailData.to_email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Log the email
    addLog('Email Opened', `Email client opened for ${emailData.to_name} (${emailData.to_email})`);
    
    return true;
}

function sendConfirmedEmail(email, name) {
    // Not used anymore - email opens directly in client
}
