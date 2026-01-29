# Student Dashboard APIs Documentation

## Overview

This document describes all the APIs for the Student Dashboard features of the Campus Meetup platform.

## Prerequisites

1. Add your genAI API key to `.env`:

   ```
   GEMINI_API_KEY=your_GEMINI_API_KEY_here
   ```

2. All protected routes require authentication. Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

---

## 1. Skill Evaluation API

**Upload code snapshots and get AI-powered skill assessment**

### Evaluate Code from Image

- **Endpoint**: `POST /api/v1/skills/evaluate`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `codeImage` (file): Image file containing code (JPEG, PNG, WEBP)
  - `skill` (optional): Programming language/skill context (e.g., "JavaScript", "Python")
  - `level` (optional): Expected level (beginner/intermediate/advanced)

**Example Request**:

```javascript
const formData = new FormData();
formData.append("codeImage", imageFile);
formData.append("skill", "JavaScript");
formData.append("level", "intermediate");

fetch("http://localhost:5000/api/v1/skills/evaluate", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
  },
  body: formData,
});
```

**Response**:

```json
{
  "success": true,
  "message": "Code evaluation completed successfully",
  "data": {
    "score": "75%",
    "scoreValue": 75,
    "evaluation": "Good code quality with room for improvement",
    "strengths": ["Clean syntax", "Good variable naming"],
    "improvements": ["Add error handling", "Improve comments"],
    "skill": "JavaScript",
    "level": "intermediate"
  }
}
```

---

## 2. SkillTwin API

**Predict your skills and align with AI growth modeling**

### Predict Skills

- **Endpoint**: `POST /api/v1/skilltwin/predict`
- **Auth**: Required
- **Body**:

```json
{
  "currentSkills": ["JavaScript", "React", "HTML"],
  "interests": "Web development and AI",
  "careerGoal": "Full Stack Developer",
  "experience": "intermediate"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "predictedSkills": ["Node.js", "TypeScript", "MongoDB"],
    "growthPath": {
      "immediate": ["Node.js", "Express"],
      "shortTerm": ["TypeScript", "Next.js"],
      "longTerm": ["GraphQL", "Docker"]
    },
    "alignment": {
      "score": 70,
      "description": "Good foundation for full stack development"
    },
    "recommendations": ["Build REST APIs", "Learn database design"]
  }
}
```

### Skill Gap Analysis

- **Endpoint**: `POST /api/v1/skilltwin/gap-analysis`
- **Auth**: Required
- **Body**:

```json
{
  "currentSkills": ["HTML", "CSS", "JavaScript"],
  "targetRole": "Senior Frontend Developer"
}
```

---

## 3. Career Roadmap API

**Get personalized learning paths and recommendations**

### Get Career Roadmap

- **Endpoint**: `POST /api/v1/career/roadmap`
- **Auth**: Required
- **Body**:

```json
{
  "currentSkills": ["Python", "Django"],
  "careerGoal": "Backend Developer",
  "experience": "beginner",
  "timeline": "12 months"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "roadmap": {
      "phase1": {
        "title": "Foundation Phase (0-3 months)",
        "skills": ["REST APIs", "Database Design"],
        "resources": ["Course 1", "Book 1"],
        "milestones": ["Build first API", "Learn SQL"]
      },
      "phase2": { ... },
      "phase3": { ... }
    },
    "recommendedProjects": ["Blog API", "E-commerce Backend"],
    "certifications": ["AWS Developer", "Python Certification"],
    "jobReadinessScore": 65
  }
}
```

### Get Learning Recommendations

- **Endpoint**: `POST /api/v1/career/recommendations`
- **Auth**: Required
- **Body**:

```json
{
  "skills": ["React", "JavaScript"],
  "interests": ["Frontend", "UI/UX"],
  "learningStyle": "visual"
}
```

### Get Career Progress

- **Endpoint**: `GET /api/v1/career/progress/:userId`
- **Auth**: Required

---

## 4. Mentor Matching API

**Connect with industry experts mentors to get guidance**

### Get Mentor Recommendations

- **Endpoint**: `POST /api/v1/mentors/recommendations`
- **Auth**: Required
- **Body**:

```json
{
  "skills": ["Python", "Machine Learning"],
  "interests": ["AI", "Data Science"],
  "careerGoal": "ML Engineer",
  "experienceLevel": "intermediate"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "mentorId": "123",
        "matchScore": 92,
        "reasoning": "Expert in ML with 10 years experience",
        "keyBenefits": ["Industry insights", "Career guidance"],
        "mentor": {
          "name": "John Doe",
          "expertise": ["Machine Learning", "Python"],
          "company": "Tech Corp",
          "yearsOfExperience": 10
        }
      }
    ]
  }
}
```

### Send Mentorship Request

- **Endpoint**: `POST /api/v1/mentors/request`
- **Auth**: Required
- **Body**:

```json
{
  "mentorId": "123",
  "message": "I would like to learn about ML career path",
  "goals": ["Learn ML best practices", "Career guidance"]
}
```

### Get My Mentorship Requests

- **Endpoint**: `GET /api/v1/mentors/my-requests`
- **Auth**: Required

### Get All Mentors

- **Endpoint**: `GET /api/v1/mentors/all`
- **Auth**: Required
- **Query Params**: `expertise`, `company`, `minExperience`

---

## 5. Global Webinars API

**AI student content in your preferred language**

### Get Webinar Recommendations

- **Endpoint**: `POST /api/v1/webinars/recommendations`
- **Auth**: Required
- **Body**:

```json
{
  "interests": ["AI", "Web Development"],
  "skillLevel": "intermediate",
  "preferredLanguage": "Spanish",
  "topics": ["Machine Learning", "React"]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "webinars": [
      {
        "title": "Introduction to Machine Learning",
        "description": "Learn ML basics",
        "category": "AI",
        "level": "intermediate",
        "duration": "2 hours",
        "keyTakeaways": ["Understanding algorithms", "Practical examples"],
        "language": "Spanish"
      }
    ],
    "upcomingTopics": ["Deep Learning", "Neural Networks"],
    "suggestedSchedule": "2 webinars per week"
  }
}
```

### Translate Webinar Content

- **Endpoint**: `POST /api/v1/webinars/translate`
- **Auth**: Required
- **Body**:

```json
{
  "content": "This is a webinar about React hooks",
  "targetLanguage": "French"
}
```

### Get Trending Topics

- **Endpoint**: `GET /api/v1/webinars/trending`
- **Auth**: Required
- **Query Params**: `category` (optional)

### Get Personalized Schedule

- **Endpoint**: `POST /api/v1/webinars/schedule`
- **Auth**: Required
- **Body**:

```json
{
  "availableTime": "evenings",
  "goals": ["Learn React", "Improve JavaScript"],
  "currentSkills": ["HTML", "CSS"]
}
```

---

## 6. Wellbeing Agent API

**Monitor burnout and get wellness suggestions**

### Assess Wellbeing

- **Endpoint**: `POST /api/v1/wellbeing/assess`
- **Auth**: Required
- **Body**:

```json
{
  "sleepHours": 6,
  "stressLevel": 7,
  "workloadHours": 10,
  "exerciseFrequency": "2 times per week",
  "socialInteraction": "low",
  "academicPressure": "high",
  "mood": "stressed"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "burnoutRisk": {
      "level": "high",
      "score": 75,
      "indicators": ["High stress", "Low sleep", "Heavy workload"]
    },
    "wellnessScore": 45,
    "recommendations": [
      {
        "category": "sleep",
        "suggestion": "Aim for 7-8 hours of sleep",
        "priority": "high"
      }
    ],
    "alerts": ["Consider taking a break"],
    "positiveAspects": ["Regular exercise"]
  }
}
```

### Get Wellness Suggestions

- **Endpoint**: `POST /api/v1/wellbeing/suggestions`
- **Auth**: Required
- **Body**:

```json
{
  "concerns": ["stress", "anxiety"],
  "lifestyle": "busy student",
  "goals": ["reduce stress", "improve sleep"]
}
```

### Get Mental Health Resources

- **Endpoint**: `GET /api/v1/wellbeing/resources`
- **Auth**: Required

### Track Wellbeing Progress

- **Endpoint**: `POST /api/v1/wellbeing/track`
- **Auth**: Required

### Wellbeing Chat Support

- **Endpoint**: `POST /api/v1/wellbeing/chat`
- **Auth**: Required
- **Body**:

```json
{
  "message": "I'm feeling overwhelmed with coursework",
  "conversationHistory": []
}
```

---

## 7. SkillScanner API

**Offline skill extraction from documents**

### Extract Skills from Document

- **Endpoint**: `POST /api/v1/skillscanner/extract`
- **Auth**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `document` (file): Resume/CV/Portfolio (PDF, TXT, DOC, DOCX, or image)

**Example Request**:

```javascript
const formData = new FormData();
formData.append("document", resumeFile);

fetch("http://localhost:5000/api/v1/skillscanner/extract", {
  method: "POST",
  headers: {
    Authorization: "Bearer <token>",
  },
  body: formData,
});
```

**Response**:

```json
{
  "success": true,
  "data": {
    "technicalSkills": ["JavaScript", "React", "Node.js"],
    "softSkills": ["Communication", "Leadership"],
    "tools": ["Git", "Docker", "VS Code"],
    "languages": ["English", "Spanish"],
    "frameworks": ["Express", "Next.js"],
    "certifications": ["AWS Certified"],
    "experience": {
      "level": "mid",
      "yearsEstimate": "3 years"
    },
    "summary": "Experienced full-stack developer"
  }
}
```

### Analyze Skills

- **Endpoint**: `POST /api/v1/skillscanner/analyze`
- **Auth**: Required
- **Body**:

```json
{
  "skills": ["React", "Node.js", "MongoDB", "AWS"]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "categories": {
      "technical": ["React", "Node.js", "MongoDB"],
      "soft": [],
      "domain": ["AWS"]
    },
    "proficiencyEstimate": {
      "beginner": [],
      "intermediate": ["React", "Node.js"],
      "advanced": ["MongoDB"]
    },
    "marketDemand": {
      "high": ["React", "AWS"],
      "medium": ["Node.js"],
      "emerging": []
    },
    "recommendations": {
      "complementarySkills": ["TypeScript", "Docker"],
      "growthAreas": ["DevOps", "Cloud Architecture"]
    },
    "overallScore": 78
  }
}
```

### Compare Skills with Job

- **Endpoint**: `POST /api/v1/skillscanner/compare`
- **Auth**: Required
- **Body**:

```json
{
  "userSkills": ["React", "JavaScript", "CSS"],
  "jobDescription": "Looking for Frontend Developer with React, TypeScript, and Redux experience..."
}
```

### Generate Skill Report

- **Endpoint**: `POST /api/v1/skillscanner/report`
- **Auth**: Required
- **Body**:

```json
{
  "skills": ["Python", "Django", "PostgreSQL"],
  "experience": "2 years",
  "goals": "Backend Developer"
}
```

---

## Error Handling

All APIs follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development mode)"
}
```

Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting & Best Practices

1. **File Uploads**: Maximum 10MB file size
2. **Supported Image Formats**: JPEG, JPG, PNG, WEBP
3. **Supported Document Formats**: PDF, TXT, DOC, DOCX, Images
4. **API Key**: Ensure your genAI API key is properly configured in `.env`
5. **Authentication**: Always include JWT token for protected routes

---

## Testing the APIs

### Using Postman or Thunder Client:

1. **Get Auth Token**:
   - Use the auth endpoints to get a JWT token
2. **Test File Upload Endpoints**:

   - Set Content-Type to `multipart/form-data`
   - Add file in the body under the correct field name
   - Include Authorization header

3. **Test JSON Endpoints**:
   - Set Content-Type to `application/json`
   - Include JSON body
   - Include Authorization header

### Example with cURL:

```bash
# Skill Evaluation
curl -X POST http://localhost:5000/api/v1/skills/evaluate \
  -H "Authorization: Bearer <token>" \
  -F "codeImage=@path/to/code.png" \
  -F "skill=JavaScript" \
  -F "level=intermediate"

# SkillTwin Prediction
curl -X POST http://localhost:5000/api/v1/skilltwin/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentSkills": ["JavaScript", "React"],
    "careerGoal": "Full Stack Developer"
  }'
```

---

## Starting the Server

```bash
cd Backend
npm install
npm start
```

The API will be available at `http://localhost:5000`

Visit `http://localhost:5000/` to see all available endpoints.
