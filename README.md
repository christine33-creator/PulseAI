# PulseAI - AI-Powered Productivity App

PulseAI is a modern productivity application built with React Native and Expo, featuring an AI-powered task prioritization system and an intuitive Pomodoro timer to help users stay focused and productive.

## Features

- **Smart Task Management**
  - AI-powered task prioritization
  - Dynamic task scoring based on due dates, complexity, and context
  - Intuitive task creation and organization

- **Focus Timer**
  - Customizable Pomodoro technique implementation
  - Flexible work/break intervals
  - Session tracking and statistics

- **User Experience**
  - Clean, modern Material Design interface
  - Dark/Light theme support with smooth transitions
  - Responsive and native feel across platforms

## Tech Stack

- **Frontend**
  - React Native / Expo
  - React Native Paper (UI components)
  - TypeScript
  - Expo Router (Navigation)

- **Backend**
  - Supabase (Authentication & Database)
  - PostgreSQL (Data storage)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pulseai.git
cd pulseai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npx expo start
```

### Database Setup

The application requires the following Supabase tables:

- `users`
  - Custom user settings and preferences
  - Theme preferences and notification settings

- `tasks`
  - Task management and organization
  - Priority scoring and status tracking

- `focus_sessions`
  - Pomodoro session tracking
  - Productivity statistics

## Project Structure

```
src/
├── components/     # Reusable UI components
│   └── themed/    # Theme-aware components
├── contexts/      # React Context providers
├── services/      # API and business logic
├── types/         # TypeScript type definitions
└── utils/         # Helper functions and utilities

app/
├── (auth)/        # Authentication screens
└── (main)/        # Main app screens
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material Design for the UI/UX inspiration
- Supabase for the backend infrastructure
- The React Native and Expo communities for their excellent tools and documentation
