# 🚀 AI Portfolio Assistant

[![Live Demo](https://img.shields.io/badge/demo-live-blue.svg)](https://ai-profile-assistant.lovable.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue.svg)](https://github.com/SinomthaMzamo/ai-bio-bot)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Empowering professionals to tell their story with AI-powered content generation

An intelligent AI-powered assistant that helps users generate professional materials including personal bios, project summaries, and learning reflections. Built as part of Week 1 project for the AI Development program.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Stories](#user-stories)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Development Workflow](#development-workflow)
- [Team](#team)
- [Learning Outcomes](#learning-outcomes)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## 🎯 Overview

The AI Portfolio Assistant solves a common challenge faced by students and early-career professionals: writing about themselves in a polished, consistent, and professional manner. Whether it's a LinkedIn bio, project summary, or learning reflection, our tool uses Generative AI to transform short user inputs into structured, well-written professional content.

### Key Highlights

- **Dual Input Modes**: Chatbot and Form interfaces for different user preferences
- **Multiple Content Types**: Bios, project summaries, and learning reflections
- **AI-Powered**: Leverages Lovable AI API for intelligent content generation
- **Real-time Generation**: Instant professional content creation
- **Agile Development**: Built using Agile methodologies with GitHub Projects

## ✨ Features

### 1. Professional Bio Generation
Generate compelling "About Me" sections that highlight your unique value proposition, skills, and professional identity.

### 2. Project Summaries
Create clear, concise descriptions of your work and achievements that effectively communicate your contributions.

### 3. Learning Reflections
Articulate your growth, insights, and learning journey in a structured, professional format.

### 4. Dual Interface Modes
- **Chatbot Mode**: Guided, conversational approach for users who need help structuring their thoughts
- **Form Mode**: Quick input for professionals with ready information

## 👥 User Stories

### 1️⃣ Graduates / Early-Career Professionals (Chatbot Mode)
*These users need guidance while inputting their information.*

#### Bio Generation
> **As a graduate**, I want to answer guided questions in a chatbot, so that I can generate a professional About Me section without struggling to phrase it myself.

#### Project Summary
> **As an early-career professional**, I want to provide project details step by step through a chatbot, so that I can produce clear, concise summaries of my work.

#### Learning Reflection
> **As a student**, I want to reflect on my learning through prompts in a chatbot, so that I can articulate my growth in a structured and professional way.

### 2️⃣ Professionals with Ready Information (Form Mode)
*These users already have content and want a quicker input method.*

#### Bio Generation
> **As a professional**, I want to fill out a form with my existing information, so that I can quickly generate a polished About Me section.

#### Project Summary
> **As a professional**, I want to submit project details through a structured form, so that I can generate a concise summary efficiently.

#### Learning Reflection
> **As a professional**, I want to enter my insights into a form, so that I can produce a professional reflection without guidance.

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | Frontend framework for building the user interface |
| **TypeScript** | Type-safe development experience |
| **Supabase** | Backend services and data management |
| **Lovable AI API** | AI-powered content generation |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Build tool and development server |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:SinomthaMzamo/ai-bio-bot.git
   cd ai-bio-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Lovable AI API credentials and Supabase configuration to `.env`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ai-bio-bot/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main application component
├── public/             # Static assets
├── .github/            # GitHub workflows and configs
└── README.md          # Project documentation
```

## 💡 Usage

### Generating a Professional Bio

1. **Choose your input mode** (Chatbot or Form)
2. **Provide your information**:
   - Name
   - Skills and expertise
   - Professional background
   - Career goals
3. **Click "Generate Bio"**
4. **Review and copy** your AI-generated professional bio

### Creating a Project Summary

1. **Select "Project Summary"** from the content type menu
2. **Enter project details**:
   - Project name
   - Technologies used
   - Your role and contributions
   - Key outcomes
3. **Generate and refine** as needed

### Writing a Learning Reflection

1. **Choose "Learning Reflection"**
2. **Input your learning experience**:
   - Course or project completed
   - Key learnings
   - Skills acquired
   - Future applications
3. **Get a structured reflection** ready for portfolios or reports

## 🔄 Development Workflow

### Agile Methodology

We followed Agile principles throughout development:

- **Kanban Board**: Task tracking via [GitHub Projects](https://github.com/users/SinomthaMzamo/projects/8)
- **User Stories**: Feature development driven by user needs
- **Iterative Progress**: Continuous delivery and refinement
- **Collaborative Development**: Real-time collaboration using Lovable's shared workspace

### Version Control

- **Feature Branches**: Each feature developed in isolated branches
- **Pull Requests**: Code review process before merging
- **Commit History**: Clear, descriptive commit messages
- **Main Branch**: Production-ready code

### Key Development Tasks

- ✅ Designing effective prompts for AI generation
- ✅ Integrating Lovable AI API
- ✅ Building responsive UI components
- ✅ Testing user experience flows
- ✅ Implementing dual input modes
- ✅ Documentation and deployment

## 👨‍💻 Team: Ctrl Alt Elite

A collaborative effort by passionate developers committed to making professional self-presentation accessible to everyone.

**Project Links:**
- 🌐 [Live Application](https://ai-profile-assistant.lovable.app)
- 📊 [Kanban Board](https://github.com/users/SinomthaMzamo/projects/8)
- 💻 [GitHub Repository](https://github.com/SinomthaMzamo/ai-bio-bot)

## 📚 Learning Outcomes

### Week 1 Project Goals Achieved

✅ **Version Control Mastery**
- Applied Git and GitHub for collaborative development
- Managed feature branches and pull requests
- Maintained clear commit history

✅ **Agile Workflow Implementation**
- Set up and managed Kanban board
- Documented user stories
- Practiced iterative development

✅ **Generative AI Integration**
- Implemented Lovable AI API
- Designed effective prompts for multiple content types
- Optimized AI responses for professional quality

✅ **Prompt Engineering Skills**
- Learned the importance of precise wording
- Balanced tone, length, and perspective
- Refined prompts through iteration

### Key Insights

- **Prompt Design**: Small changes in wording create significant differences in output quality
- **AI-Assisted Development**: Tools like Lovable dramatically accelerate the development process
- **Agile in Low-Code**: Agile principles work effectively even in low-code/AI-assisted environments
- **Team Collaboration**: Real-time shared workspaces enhance productivity and learning

## 🔮 Future Enhancements

### Planned Features

1. **Personalization Settings**
   - Tone customization (formal, casual, technical)
   - Length preferences (brief, standard, detailed)
   - Industry-specific templates

2. **Additional Templates**
   - Resume generation
   - Cover letter writing
   - LinkedIn post suggestions
   - Email templates

3. **Content Management**
   - Save generated content
   - Edit and refine outputs
   - Version history
   - Export to multiple formats

4. **Advanced Features**
   - Multi-language support
   - Industry-specific vocabularies
   - A/B testing for different versions
   - Integration with LinkedIn API

5. **Analytics Dashboard**
   - Usage statistics
   - Popular content types
   - User feedback collection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lovable AI** for providing the AI API
- **Supabase** for backend infrastructure
- **Week 1 Instructors** for guidance and support
- **Open Source Community** for tools and libraries

## 📞 Contact & Support

For questions, feedback, or support:

- 🐛 [Report Issues](https://github.com/SinomthaMzamo/ai-bio-bot/issues)
- 💬 [Discussions](https://github.com/SinomthaMzamo/ai-bio-bot/discussions)
- 📧 Contact the team through GitHub

---

**Built with ❤️ by Ctrl Alt Elite**

*Making professional self-presentation effortless through AI*