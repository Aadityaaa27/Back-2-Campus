# Student Dashboard APIs - Quick Start

## ✅ All APIs Created

I've successfully created all the APIs for your student dashboard:

### 1. **Skill Evaluation** ✅

- Upload code images for AI evaluation
- Get percentage scores (e.g., 50%, 75%)
- Receive detailed feedback on strengths and improvements

### 2. **SkillTwin** ✅

- Predict future skills based on current profile
- AI-powered growth modeling
- Skill gap analysis for target roles

### 3. **Career Roadmap** ✅

- Personalized learning paths
- Phase-by-phase roadmaps (Foundation → Development → Advanced)
- Learning resource recommendations

### 4. **Mentor Matching** ✅

- AI-powered mentor recommendations
- Send mentorship requests
- Track mentorship status

### 5. **Global Webinars** ✅

- AI-curated webinar recommendations
- Multi-language content translation
- Personalized webinar schedules

### 6. **Wellbeing Agent** ✅

- Burnout risk assessment
- Wellness suggestions
- Mental health resources
- AI chat support for wellness concerns

### 7. **SkillScanner** ✅

- Extract skills from resumes/documents
- Offline skill extraction from images
- Compare skills with job requirements
- Generate comprehensive skill reports

---

## 🚀 Quick Setup

### 1. Add genAI API Key

Edit `Backend/.env` and replace:

```
GEMINI_API_KEY=your_GEMINI_API_KEY_here
```

with your actual genAI API key.

### 2. Start the Server

```bash
cd Backend
npm start
```

### 3. Test the APIs

Visit: `http://localhost:5000/`

You'll see all available endpoints listed.

---

## 📁 Files Created

### Controllers:

- `controllers/skillEvaluationController.js`
- `controllers/skillTwinController.js`
- `controllers/careerRoadmapController.js`
- `controllers/mentorMatchingController.js`
- `controllers/webinarsController.js`
- `controllers/wellbeingController.js`
- `controllers/skillScannerController.js`

### Routes:

- `routers/skillEvaluationRoutes.js`
- `routers/skillTwinRoutes.js`
- `routers/careerRoadmapRoutes.js`
- `routers/mentorMatchingRoutes.js`
- `routers/webinarsRoutes.js`
- `routers/wellbeingRoutes.js`
- `routers/skillScannerRoutes.js`

### Documentation:

- `API_DOCUMENTATION.md` - Complete API documentation

---

## 🔑 Authentication

All APIs (except auth endpoints) require JWT authentication.

Include the token in your requests:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📦 Dependencies Installed

- ✅ `multer` - File uploads
- ✅ `openai` - genAI API integration

---

## 📝 Example Usage

### Upload Code for Evaluation:

```javascript
const formData = new FormData();
formData.append("codeImage", imageFile);
formData.append("skill", "JavaScript");
formData.append("level", "intermediate");

fetch("http://localhost:5000/api/v1/skills/evaluate", {
  method: "POST",
  headers: { Authorization: "Bearer <token>" },
  body: formData,
});
```

### Get Career Roadmap:

```javascript
fetch("http://localhost:5000/api/v1/career/roadmap", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    currentSkills: ["Python", "Django"],
    careerGoal: "Backend Developer",
    experience: "beginner",
  }),
});
```

### Assess Wellbeing:

```javascript
fetch("http://localhost:5000/api/v1/wellbeing/assess", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    sleepHours: 6,
    stressLevel: 7,
    workloadHours: 10,
    mood: "stressed",
  }),
});
```

---

## 🎯 All Endpoints

Visit the root URL after starting the server to see the complete list:
`http://localhost:5000/`

Or check the detailed documentation in `API_DOCUMENTATION.md`

---

## ⚠️ Important Notes

1. ** genAI API Key Required**: Make sure to add your genAI API key to `.env`
2. **File Size Limits**: Maximum 10MB for uploads
3. **Supported Formats**:
   - Images: JPEG, PNG, WEBP
   - Documents: PDF, TXT, DOC, DOCX
4. **Authentication**: All dashboard APIs require valid JWT token

---

## 🎉 You're All Set!

All 7 dashboard features are now ready to use. Just add your genAI API key and start the server!

For detailed API documentation, see `API_DOCUMENTATION.md`
