# 🎯 AI Portfolio Assistant - Development Prompts

This document chronicles the iterative development process of the AI Portfolio Assistant, capturing key prompts and feature requests that shaped the application.

---

## 📝 Initial Project Specification

### PROMPT A: Core Application Requirements

**Project Title:** AI-Powered Professional Content Assistant

#### 🎯 Project Overview

Develop an AI-driven web application that helps users generate professional materials such as:
- Personal Bios / About Me
- Project Summaries
- Learning Reflections

The app should use the Gemini Generative AI API to transform short user inputs (skills, achievements, project details, etc.) into well-structured, polished outputs. Users can interact via a chatbot view or a form view, refine outputs, and export their results in multiple formats.

#### 🧩 Core Features Breakdown

**1. Content Generation**
- Use Gemini Generative AI API to generate:
  - Personal Bios
  - Project Summaries
  - Learning Reflections
- Accept short structured inputs (skills, achievements, project details, etc.)
- Allow users to refine or regenerate content using follow-up prompts
- Support tone selection:
  - First-person (for CVs, LinkedIn, personal use)
  - Third-person (for portfolio sites or articles)

**2. Interaction Modes**

a) **Form View**
- Structured input form for user data
- Submit → generate → display formatted output
- Allow follow-up refinements

b) **Chatbot View**
- Conversational interface that:
  - Asks user for missing details interactively
  - Confirms all gathered information before generation
  - Validates input quality and notifies user if input is incomplete or invalid

**3. Output Formatting & Display**
- Ensure generated content:
  - Is readable and complete (no truncation or cutoff)
  - Is rendered in Markdown, not raw text
- Provide word-limit control to avoid output truncation issues
- Allow users to preview and edit/refine the generated content

**4. History & User Management**
- Implement basic email authentication (Sign up / Log in / Log out)
- Each user should have:
  - Saved history of generated outputs
  - Ability to view, edit, delete, or re-use past generations
- Store data in a database table (Firebase Firestore, Supabase, or PostgreSQL)

**5. Exporting**
- Enable export of generated content to multiple formats:
  - PDF
  - Word (.docx)
  - Markdown (.md)
- Each export should maintain proper formatting and styling

**6. UI/UX Enhancements**

*Navigation*
- Add back buttons on every page
- Keep "Create New" button on generated content pages
- Proper navigation flow between all pages

*Loading States*
- Show loading indicators during:
  - Content generation
  - Regeneration/refinement
  - Export operations

**7. Error Handling & Validation**
- Validate input fields (ensure not empty or nonsensical)
- Provide clear feedback if:
  - Input is too vague/incomplete
  - Required fields are missing
- Replace placeholder examples with contextual guidance or validation messages

#### 🏗️ Architecture Overview

| Layer | Description |
|-------|-------------|
| Frontend | React (Lovable + Tailwind + Markdown renderer) |
| Backend | Gemini API integration + simple REST endpoints |
| Database | Store user profiles, generation history |
| Auth | Email-based (Firebase Auth / Supabase Auth) |
| File Export | Server-side formatting with libraries |
| State Management | Context API or Zustand |

---

## 🚀 Feature Enhancement Requests

### PROMPT B: Additional Core Features

**Requested Enhancements:**
1. **Add Chatbot Mode:** Implement conversational interface alongside forms
2. **PDF Export:** Add PDF generation for professional formatting
3. **Content Refinement:** Allow users to regenerate or refine existing content with follow-up prompts

---

## 🎨 UX & Chatbot Improvements

### PROMPT C: Natural Conversation & Regeneration Fix

**Issues Identified:**

1. **Chatbot Rigidity**
   - Chatbot is too rigid and form-like
   - Should show understanding of user input
   - Must confirm information naturally
   - Should feel like a natural conversation instead of an exact copy of form fields

2. **Regeneration Bug**
   - When user regenerates/refines content, raw JSON is displayed
   - JSON doesn't appear to be from LLM response
   - Shows data supplied by user instead of regenerated content

**Expected Behavior:** Natural, conversational flow with proper content regeneration

---

### PROMPT D: Dynamic Flow & Loading States

**Requirements:**

1. **Loading States**
   - Implement loading indicators throughout the application

2. **Dynamic Chatbot Flow**
   - Flow should be dynamic and respond to user's input
   - If user supplies incomplete info, chatbot should recognize this
   - Ask all necessary questions until user has supplied all necessary info
   - Confirm information only at the end
   - Greet user with their name and address them by name throughout chat

---

### PROMPT E: Input Validation & Logical Responses

**Critical Issue:** Chatbot lacks logical reasoning and input validation

**Example of Broken Behavior:**
```
Chatbot: What's the name of your project?
User: Hello my name is Derek G
Chatbot: Thanks for that!

Chatbot: What was the main objective of this project?
Chatbot: is to create a system for biometric verification
Chatbot: Perfect!

Chatbot: What technologies and tools did you use?
User: i sued my hands
Chatbot: Great!
```

**Required Fix:**
- Chatbot must read and understand prompts before responding
- Implement proper input validation
- Respond logically based on what user actually inputs
- Recognize when user provides irrelevant or incomplete information

---

## 🐛 Bug Fixes & Technical Issues

### PROMPT F: Edge Function JSON Error

**Error:**
```
Edge function returned 500: Error
{"error":"Unexpected token '`', \"```json\n{\n\"... is not valid JSON"}
```

**Location:** `supabase/functions/validate-answer/index.ts`

**Required:** Step-by-step resolution of JSON parsing error

---

### PROMPT G: Natural Confirmation & User Refinement

**Improvements Needed:**

1. **Natural Information Confirmation**
   - Instead of regurgitating user's information
   - Chatbot should summarize in its own words
   - Make it more readable and easy to scan

2. **Information Refinement**
   - User should be able to refine inputs if not happy
   - Allow edits if user forgot to mention something
   - That's the whole point of confirming information
   - Don't only have "generate content" option after confirmation

3. **Loading States**
   - "Generate content" button doesn't have loading state

4. **Multi-line Input**
   - In chat mode, Shift+Enter should create new line
   - Should move cursor to new line instead of sending message

**Critical:** Ensure present functionality doesn't break with these updates

---

### PROMPT H: Summary Generation Error

**Error:**
```
Edge function returned 500: Error
{"error":"Failed to generate summary"}
```

**Location:** `supabase/functions/summarize-info/index.ts`

**Required:** Fix summary generation edge function

---

## 🔧 Advanced UX Refinements

### PROMPT I: Edit Flow & Memory Retention

**Critical Issue:** Chatbot doesn't remember previous inputs when editing

**Problem Example:**
```
[User provides full information]
Chatbot: [Confirms all information]
User: [Wants to edit professional experience]
Chatbot: Let's update that. Tell me about your professional experience.
User: [Provides new experience]
Chatbot: What are some of your notable achievements?
User: those remain as i said before
Chatbot: It seems there might have been a misunderstanding...
```

**Required Behavior:**
- When user chooses to edit information, chatbot should remember previous inputs
- User shouldn't have to restart entire conversation
- If editing one aspect, other information should be retained
- Seamless edit flow without losing context

---

### PROMPT J: Preserving User Information During Edits

**Critical Issue:** User information gets overwritten during edits

**Problem Example:**
```
[User provides: React, Angular, AWS certification]
Chatbot: [Confirms]
User: [Edits to add UX design skills]
Chatbot: [New summary only includes UX design, missing React, Angular, AWS]
```

**Issues Identified:**
1. Editing overwrites previous input instead of adding to it
2. Chatbot provides multiple separate summaries instead of consolidating
3. Final generated content missing original information

**Required Behavior:**
- Editing should NOT overwrite previous input unless explicitly instructed
- Should append/update only the specific field being edited
- Consolidate all information in single summary
- All user information should be included in final generated content

**Critical:** Ensure all present functionality is maintained and doesn't break with this fix

---

## 📊 Summary of Development Journey

### Key Milestones

1. ✅ Initial application architecture and core features
2. ✅ Dual interaction modes (Form & Chatbot)
3. ✅ AI content generation for 3 content types
4. ✅ Natural conversation flow improvements
5. ✅ Input validation and logical responses
6. ✅ Loading states and error handling
7. ✅ Information confirmation and editing flow
8. ✅ Memory retention during edits
9. ✅ Multi-line input support

### Lessons Learned

- **Iterative Development:** Each prompt built upon previous functionality
- **User Experience Focus:** Multiple iterations to achieve natural conversation flow
- **Edge Cases Matter:** Special attention to edit flows and information retention
- **Testing is Critical:** Many bugs discovered through actual usage scenarios
- **AI Behavior Tuning:** Significant effort required to make chatbot feel natural

---

## 🎓 Development Insights

**What Worked Well:**
- Agile approach with iterative improvements
- Clear documentation of issues with examples
- Incremental feature additions
- Focus on maintaining existing functionality

**Challenges Overcome:**
- JSON parsing in edge functions
- Natural language understanding in chatbot
- State management during edits
- Information persistence across conversations

**Future Considerations:**
- More sophisticated context management
- Enhanced input validation
- Better error recovery mechanisms
- Advanced personalization features

---

*This document serves as a complete record of our development journey, showcasing the iterative nature of building AI-powered applications and the importance of user-centered design.*