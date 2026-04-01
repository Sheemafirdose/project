# Email Configuration Guide

## How to Enable Real Email Sending

The debate system is now configured to send professional schedule emails to participants. Follow these steps:

### Option 1: Using EmailJS (Recommended)

1. **Sign up at EmailJS**
   - Go to https://www.emailjs.com/
   - Create a free account

2. **Get Your Credentials**
   - Copy your **Public Key** from the dashboard
   - Create a Service (e.g., Gmail)
   - Create a Template with the following variables:
     - `to_email`
     - `to_name`
     - `subject`

3. **Update Configuration**
   - Open `js/emailService.js`
   - Replace `'YOUR_PUBLIC_KEY'` with your actual Public Key:
     ```javascript
     const EMAILJS_PUBLIC_KEY = 'your_actual_public_key_here';
     const EMAILJS_SERVICE_ID = 'service_your_service_id';
     const EMAILJS_TEMPLATE_ID = 'template_your_template_id';
     ```

4. **Test It**
   - Go to Schedule page
   - Schedule a debate slot
   - Click "📧 Email Slot"
   - Click "✓ Send Email" button
   - Participant will receive the email!

### Option 2: Demo Mode (Current)

Currently, the system is in **Demo Mode**:
- Emails are stored locally in browser storage
- Shows success message confirming email is ready
- To see sent emails, check browser console logs
- Perfect for testing before enabling real emails

## Email Features

✅ **Professional HTML Email Template**
- Participant name and topic highlighted
- Date in full format (e.g., "Monday, April 15, 2025")
- Time in readable format (e.g., "2:30 PM")
- Venue clearly highlighted
- Important instructions for participants
- Professional footer

✅ **Email Buttons**
- Green "📧 Email" button in schedule table (for scheduled participants)
- "📧 Email Slot" button in modal (after saving schedule)
- Click to send professional confirmation email

✅ **Email Storage**
All sent emails are logged with:
- Participant email
- Participant name
- Timestamp
- Subject line

## Troubleshooting

**If emails are not being sent:**
1. Check browser console (F12) for errors
2. Verify EmailJS credentials are correct
3. Ensure your email service is properly configured in EmailJS dashboard
4. Check spam folder for emails

**To view sent emails log:**
1. Open browser Developer Tools (F12)
2. Go to Console
3. Type: `JSON.parse(localStorage.getItem('sentEmails'))`
4. See all emails sent during this session

## Need Help?

- EmailJS Support: https://www.emailjs.com/docs/
- Check browser console for detailed error messages
- Verify participant email addresses are correct
- Ensure proper internet connection

---

**Status:** Email system is ready to use!
- ✅ Template configured
- ✅ Professional styling applied
- ✅ Ready for EmailJS integration
- ✅ Demo mode working
