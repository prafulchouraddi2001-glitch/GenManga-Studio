# GenManga Studio 🎨📖

An AI-powered manga and story generation platform built with React, TypeScript, and Google's Gemini AI.

## 🌟 Features

- **AI-Powered Story Generation**: Create compelling narratives using Google's Gemini AI
- **Character Management**: Design and manage manga characters with detailed attributes
- **Chapter Organization**: Structure your manga into organized chapters
- **World Building**: Create rich story settings and environments
- **Power Systems**: Define unique ability systems for your manga universe
- **Story Arcs**: Plan and organize narrative arcs
- **Real-time Collaboration**: Built on Supabase for seamless data synchronization

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **AI Integration**: Google Gemini AI (gemini-2.0-flash-exp)
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Google AI Studio
- **Styling**: Modern CSS with responsive design

## 📁 Project Structure

```
GenManga-Studio/
├── components/          # React components
├── hooks/              # Custom React hooks
│   ├── useMangaProjects.ts
│   └── ...
├── services/           # Service layer
│   ├── supabaseClient.ts
│   ├── geminiService.ts
│   └── autonomousService.ts
├── types.ts            # TypeScript type definitions
├── index.tsx           # Main application entry
├── index.html          # HTML template
└── README.md           # Project documentation
```

## 🚀 Key Components

### Database Operations (CRUD)
- **Create**: Generate new chapters, characters, and story elements
- **Read**: Fetch and display manga projects and related data
- **Update**: Modify existing chapters and character information
- **Delete**: Remove chapters and manage project data

### AI Services
- **Story Generation**: Autonomous story arc creation
- **Character Development**: AI-assisted character creation
- **World Building**: Generate detailed manga universes
- **Power System Design**: Create unique ability frameworks

## 💾 Database Schema

### Tables:
- `chapters` - Story chapters with content
- `characters` - Character profiles and attributes
- `story_arcs` - Narrative arc organization
- `power_systems` - Ability system definitions
- And more...

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- Supabase account
- Google AI Studio API key

### Environment Variables
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/prafulchouraddi2001-glitch/GenManga-Studio.git

# Navigate to project directory
cd GenManga-Studio

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Usage

1. **Create a New Project**: Start by creating a new manga project
2. **Design Characters**: Add characters with detailed attributes
3. **Generate Story**: Use AI to generate story arcs and chapters
4. **Build World**: Create the manga universe setting
5. **Define Powers**: Establish unique ability systems
6. **Organize Chapters**: Structure your narrative flow

## 🎯 Features in Development

- [ ] Image generation for manga panels
- [ ] Advanced character relationship mapping
- [ ] Export to PDF/ePub formats
- [ ] Collaborative editing features
- [ ] Version control for story iterations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Praful Chouraddi**
- GitHub: [@prafulchouraddi2001-glitch](https://github.com/prafulchouraddi2001-glitch)

## 🙏 Acknowledgments

- Google Gemini AI for powerful story generation
- Supabase for robust backend infrastructure
- React community for excellent tools and libraries

---

**Note**: This project is built using Google AI Studio. The complete source code will be uploaded progressively.

## 📸 Screenshots

_Coming soon_

## 🔗 Links

- [Live Demo](#) - Coming soon
- [Documentation](#) - In progress
- [API Reference](#) - In progress

---

Made with ❤️ and AI
