# Advanced Debate Management System

A comprehensive web-based platform for managing debate competitions, featuring participant registration, judge scoring, schedule management, results analysis, and automated certificate generation with email functionality.

**Developed by CSE AIML**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Pages & Features](#pages--features)
3. [How to Use](#how-to-use)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Data Persistence](#data-persistence)
7. [Features in Detail](#features-in-detail)
8. [Technologies Used](#technologies-used)

---

## 🚀 Quick Start

### First Time Setup
```bash
cd project
npm install
npm run dev
```

Open your browser: `http://localhost:5173`

### Password for Judge Access
- **Username**: Any text (e.g., "judge1", "judge")
- **Password**: `RGM`

---

## 📄 Pages & Features

### 1. **Dashboard (index.html)**
**Purpose**: Main entry point with navigation to all features

**What you see**:
- 6 main navigation cards
- Links to About and Help pages
- College logo and branding

**Features**:
- Register Participant
- Judge Login
- Participant Manager (Judge Only)
- Schedule Slots (Judge Only)
- View Results
- Event Logs

---

### 2. **Register Participant (pages/register.html)**
**Purpose**: Add new students/participants to the system

**What you do**:
1. Fill in participant form with:
   - Full Name
   - College
   - Email
   - Phone
   - Debate Topic
   - Experience Level
2. Click **"Register"**
3. Success message appears
4. Automatically redirected to Dashboard

**Features**:
- ✅ Duplicate email prevention
- ✅ Data saved to browser storage
- ✅ Activity logged automatically
- ✅ Form validation

**Data stored**:
- Name, College, Email, Phone
- Topic, Experience
- Registration timestamp
- Empty scores (filled by judges later)

---

### 3. **Judge Login (pages/judge.html)**
**Purpose**: Authenticate judges and access restricted features

**How to Login**:
1. Enter any username (e.g., "judge1")
2. Enter password: **`RGM`**
3. Click **"Login"**
4. Access Judge-only pages:
   - Participant Manager
   - Schedule Slots

**Features**:
- ✅ Password protection
- ✅ Session-based access
- ✅ Back to Dashboard button
- ✅ Login status saved

---

### 4. **Participant Manager (pages/participants.html)**
**Purpose**: View and manage all registered participants | Judge Only

**What you do**:
1. View all participants in table
2. **Assign Side**: Select "For" or "Against" from dropdown
3. **Schedule Status**: See if participant has date/time assigned
4. **Scores**: View participant's total score (0 until judges assign)
5. **Delete**: Remove participant if needed

**Filters**:
- Filter by College
- Filter by Side (For/Against/Unassigned)

**Features**:
- ✅ Real-time updates
- ✅ Easy side assignment
- ✅ Delete functionality
- ✅ Activity logging

---

### 5. **Schedule Slots (pages/schedule.html)**
**Purpose**: Assign date, time, and venue for each debate | Judge Only

**How to Schedule**:
1. Select participant from dropdown
2. Click **"Pick Date"** → Select date from calendar
3. Enter **Time**
4. Enter **Venue** (optional)
5. Click **"Schedule"**

**Features**:
- ✅ Calendar date picker
- ✅ Custom time entry
- ✅ Venue assignment
- ✅ Edit schedules
- ✅ View complete schedule

---

### 6. **Judge Scoring (pages/judge.html - After Login)**
**Purpose**: Give scores to participants

**How to Score**:
1. Login as judge (password: `RGM`)
2. Select participant
3. Enter scores:
   - **Content**: 0-30 points
   - **Delivery**: 0-30 points
   - **Rebuttal**: 0-40 points
   - **Total**: Auto-calculated (max 100)
4. Click **"Submit Score"**

**Features**:
- ✅ Real-time score calculation
- ✅ Input validation
- ✅ Activity logging
- ✅ Prevent invalid scores

---

### 7. **Results (pages/results.html)**
**Purpose**: View rankings and generate certificates

**What you see**:
- 🥇 **Top 3 Performers** with medals
- **Winning Side Analysis** (For vs Against)
- **Complete Rankings** table

**Button: "Generate All Certificates"**
- Downloads ZIP file with all certificates as PDFs

**For Individual Participants**:
1. Click **"Generate Certificate"** in table
2. Certificate preview appears in modal
3. Choose template:
   - Default template
   - Upload custom template
4. **Three button options**:
   - **Close**: Close modal
   - **Email Certificate**: Opens email draft for that participant
   - **Download PDF**: Save certificate as PDF

**Certificate Details Include**:
- Participant name
- College
- Debate topic
- Side (For/Against)
- Total score
- Date
- Branding: "Developed by CSE AIML"

---

### 8. **Event Logs (pages/logs.html)**
**Purpose**: Track all system activities

**What you see**:
- All actions with timestamps:
  - Participant registrations
  - Judge logins
  - Score submissions
  - Side assignments
  - Schedule assignments
  - Certificate generations
  - Email actions

**Features**:
- ✅ Automatic logging
- ✅ Timestamps
- ✅ Action details
- ✅ Export as CSV

---

### 9. **About (pages/about.html)**
**Purpose**: Learn about the system

**Contents**:
- Project overview
- Key objectives
- Module descriptions
- Workflow explanation

---

### 10. **Help (pages/help.html)**
**Purpose**: Get help and guidance

**Contents**:
- Step-by-step guides
- Common issues
- Best practices
- FAQs

---

## 🎯 How to Use

### Complete Workflow Example

#### **Step 1: Register Participants**
```
1. Go to Dashboard
2. Click "Register Participant"
3. Fill form: Name, College, Email, Phone, Topic, Experience
4. Click "Register"
5. Repeat for all students
```

#### **Step 2: Judge Login & Assign Sides**
```
1. Go to Dashboard
2. Click "Judge Login"
3. Username: any text
   Password: RGM
4. Click "Participant Manager"
5. Assign "For" or "Against" to each participant
```

#### **Step 3: Schedule Debates**
```
1. In Judge Portal
2. Click "Schedule Slots"
3. Select participant
4. Pick date from calendar
5. Enter time and venue
6. Click "Schedule"
```

#### **Step 4: Give Scores**
```
1. In Judge Portal
2. Select participant
3. Enter scores (Content, Delivery, Rebuttal)
4. Click "Submit Score"
5. Scores auto-calculate and display in Results
```

#### **Step 5: Generate & Email Certificates**
```
1. Go to Results page
2. Click "Generate Certificate" for participant
3. Certificate preview appears
4. Click "Email Certificate"
5. Browser opens email draft
6. Download PDF separately and attach
7. Send email
```

---

## 💾 Data Persistence

### How Data is Saved
- **Local Storage**: All data saved to your browser's local storage
- **Automatic**: Data saves automatically when you enter it
- **Persistent**: Data stays even if you close tab/browser (unless cache is cleared)

### Important Notes
- 🔒 Data is stored on YOUR computer/browser only
- 📱 Data won't sync to other devices
- 🧹 Clearing browser cache will DELETE all data
- 💾 Always backup important data before clearing cache

### Data Stored
- Participants (name, email, college, scores, side, schedule)
- Logs (all activities)
- Judge login status
- Certificate templates

---

## 🔧 Installation

### Requirements
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
cd project
npm install
```

### Step 2: Check Installation
```bash
npm list
```

You should see: `html2canvas`, `jspdf`, `jszip` installed

---

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

Then open: `http://localhost:5173`

### Production Build
```bash
npm run build
```

Output files in `dist/` folder ready for web hosting

### Stop the Server
Press `Ctrl + C` in terminal

---

## 🌟 Features in Detail

### ✨ Certificate Generation
- **Template Options**: Default professional template or upload custom
- **PDF Export**: High-quality PDF download
- **Email Integration**: Opens email draft with participant's email pre-filled
- **Batch Processing**: Generate all certificates at once as ZIP
- **Preview**: See certificate before downloading

### 🔐 Judge Protection
- All management pages require login
- Password: `RGM`
- Simple authentication system
- Auto-logout when browser closed

### 📊 Real-time Analytics
- Top 3 performers with medals
- Winning side comparison
- Complete rankings by score
- Average score calculation

### 📧 Email Functionality
- Click "Email Certificate" opens your email client
- Pre-filled with:
  - Participant's email address
  - Subject line
  - Certificate details in body
  - Instructions to attach PDF
- Download PDF separately and attach manually

### 🎨 Professional Design
- Dark glass-morphism theme
- Gradient backgrounds
- Responsive mobile design
- Smooth hover animations
- Campus image branding
- College logo integration

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Page structure |
| **CSS3** | Styling, animations, responsive design |
| **JavaScript** | Core logic, interactivity |
| **localStorage** | Data persistence |
| **html2canvas** | Certificate rendering |
| **jsPDF** | PDF generation |
| **jszip** | ZIP file creation |
| **Vite** | Development server |
| **IndexedDB ready** | Future database support |

---

## 📁 Project Structure

```
project/
├── index.html              # Dashboard
├── pages/
│   ├── register.html       # Registration form
│   ├── judge.html          # Judge login & scoring
│   ├── participants.html   # Participant manager
│   ├── schedule.html       # Schedule management
│   ├── results.html        # Results & certificates
│   ├── logs.html           # Event logs
│   ├── about.html          # About page
│   └── help.html           # Help guide
├── js/
│   ├── script.js           # Shared utilities
│   ├── register.js         # Registration logic
│   ├── judge.js            # Judge login & scoring
│   ├── participants.js     # Participant management
│   ├── schedule.js         # Schedule logic
│   ├── results.js          # Results & certificates
│   └── logs.js             # Logging system
├── styles/
│   └── main.css            # All styling
├── assets/
│   └── logo2.jpg           # College logo
└── package.json            # Dependencies
```

---

## ⚙️ Configuration

### Custom Logo
Replace `assets/logo2.jpg` with your college logo
- Supported formats: JPG, PNG
- Recommended size: 100x100px

### Password Change
Edit `judge.js` line:
```javascript
if (password !== 'RGM') {
    // Change 'RGM' to your desired password
}
```

### Certificate Template
Edit `results.js` function `createDefaultCertificateTemplate()` to customize certificate design

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Data lost after refresh | Check if browser cache was cleared. localStorage data only persists if cache isn't cleared. |
| Judge login not working | Password must be exactly `RGM`. Username can be anything. |
| Certificate won't download | Make sure you allow popups in browser. Check browser console for errors. |
| Email draft won't open | Check browser email client settings. Mailto links might be disabled. |
| Participants not showing | Make sure you registered participants first and logged in as judge. |

---

## 📝 Notes

- This system uses client-side storage (localStorage)
- For production deployment to Netlify, consider adding Firebase or backend database
- All data is stored locally on the browser
- No data is sent to external servers (except email client)
- Perfect for small to medium-sized debate competitions

---

**Version**: 2.0 (Enhanced with Email & UI Refinements)  
**Last Updated**: March 2026  
**Developed by**: CSE AIML Department
2. No build process required - pure HTML/CSS/JS
3. Open `index.html` in a web browser
4. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```

## Usage Guide

### For Participants

1. **Register**: Click "Register Participant" from dashboard
2. Fill in all required information
3. Submit the form
4. Wait for schedule and side assignment from judges

### For Judges

1. **Login**:
   - Username: `judge`
   - Password: `admin123`

2. **Assign Sides**:
   - Go to Participant Manager
   - Use dropdown to assign For/Against
   - Filter participants as needed
   - Export lineup if required

3. **Schedule Debates**:
   - Go to Schedule Slots
   - Click Schedule for each participant
   - Enter date, time, and venue

4. **Score Participants**:
   - Login redirects to scoring interface
   - Enter scores for Content, Delivery, Rebuttal
   - Total calculated automatically
   - Can update scores anytime

5. **Generate Certificates**:
   - Go to Results page
   - Click "Generate Certificate" for any participant
   - Preview certificate
   - Click "Download PDF" to save

### Viewing Results

- Results page is public (no login required)
- Shows top 3 performers
- Displays winning side analysis
- Complete rankings table
- Certificate generation option

## File Structure

```
project/
â”œâ”€â”€ index.html              # Main dashboard
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ register.html       # Participant registration
â”‚   â”œâ”€â”€ judge.html          # Judge login & scoring
â”‚   â”œâ”€â”€ participants.html   # Participant manager
â”‚   â”œâ”€â”€ schedule.html       # Schedule manager
â”‚   â”œâ”€â”€ results.html        # Results & certificates
â”‚   â”œâ”€â”€ logs.html           # Event logs
â”‚   â”œâ”€â”€ about.html          # About page
â”‚   â””â”€â”€ help.html           # Help & user guide
â”œâ”€â”€ styles/
â”‚   â””â”€â”€ main.css            # Global styles
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ script.js           # Core utilities
â”‚   â”œâ”€â”€ register.js         # Registration logic
â”‚   â”œâ”€â”€ judge.js            # Judge & scoring logic
â”‚   â”œâ”€â”€ participants.js     # Manager logic
â”‚   â”œâ”€â”€ schedule.js         # Scheduling logic
â”‚   â”œâ”€â”€ results.js          # Results & certificates
â”‚   â””â”€â”€ logs.js             # Logs logic
â””â”€â”€ assets/
    â””â”€â”€ college-logo.png    # College logo (optional)
```

## Data Structure

### Participant Object
```javascript
{
  id: timestamp,
  name: string,
  college: string,
  email: string,
  phone: string,
  topic: string,
  experience: string,
  side: "For" | "Against" | null,
  schedule: {
    date: string,
    time: string,
    venue: string
  } | null,
  scores: {
    content: number (0-30),
    delivery: number (0-30),
    rebuttal: number (0-40),
    total: number (0-100)
  },
  registeredAt: ISO timestamp
}
```

### Log Object
```javascript
{
  id: timestamp,
  timestamp: ISO string,
  action: string,
  details: string
}
```

## localStorage Keys

- `debateParticipants`: Array of participant objects
- `debateLogs`: Array of log entries
- `judgeLoggedIn`: Boolean string ('true' or not set)

## sessionStorage Keys

- `judgeAccessNotice`: Warning message for unauthorized access
- `judgeNextPage`: Redirect URL after judge login

## Customization

### Certificate Templates

The certificate generation system is designed to support multiple templates in the future. To add a new template:

1. Open `js/results.js`
2. Create a new function `createCertificateTemplate2(participant)`
3. Return different HTML structure
4. Add template selection UI

### Judge Credentials

To change judge login credentials, edit `js/judge.js`:

```javascript
const JUDGE_CREDENTIALS = {
    username: 'your_username',
    password: 'your_password'
};
```

### Debate Topics

To modify available topics, edit `pages/register.html`:

```html
<select id="topic" name="topic" required>
    <option value="">Select a topic</option>
    <option value="Your Topic">Your Topic</option>
    <!-- Add more topics -->
</select>
```

### College Logo

Replace `assets/college-logo.png` with your own logo. The system will automatically use it. If no logo is provided, a placeholder image from Pexels is used.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires localStorage support
- PDF download requires modern browser with Blob support

## Known Limitations

- Data stored in browser localStorage (not synchronized across devices)
- Single judge account (all judges share same credentials)
- No server-side validation or storage
- No email notifications
- Certificate template is fixed (future versions will support multiple templates)

## Future Enhancements

- Multiple certificate templates
- Email notifications to participants
- Export results to multiple formats
- Cloud storage integration
- Multi-user judge system
- Real-time collaboration
- Mobile app version

## Troubleshooting

### Data Loss
- Don't clear browser data/cache
- Export important data regularly
- Use the export functions for backups

### Certificate Download Issues
- Ensure browser allows downloads
- Check popup blocker settings
- Try a different browser if issues persist

### Judge Access Issues
- Make sure you're logged in
- Check credentials (default: judge/admin123)
- Clear browser cache if problems persist

## Credits

**Designed by Dept of AIML**

This project demonstrates modern web development practices using vanilla JavaScript, localStorage for data persistence, and third-party libraries for PDF generation.

## License

This project is provided as-is for educational and organizational use.

## Support

For questions or issues:
1. Check the Help page in the application
2. Review the About page for system details
3. Consult the Event Logs for troubleshooting

---

**Version**: 2.0 (Enhanced with Certificate Generation)
**Last Updated**: 2024

