# Automated Assignment Grading System - Prototype

This is a prototype of an Automated Assignment Grading System that demonstrates the core functionality without requiring a database or authentication setup.

## Features

- **Class Management**: Create and manage classes with unique class codes
- **Assignment Creation**: Create assignments for specific classes
- **Submission Viewing**: View student submissions for assignments
- **AI Grading**: Simulate AI-powered grading of student submissions
- **Manual Grading**: Provide manual grades and feedback
- **Student Progress Tracking**: View student progress across all classes

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd automated-assignment-grading-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Prototype Notes

This is a simplified prototype that uses mock data instead of a real database. In a production environment, you would need to:

1. Set up a MongoDB database
2. Configure NextAuth.js for authentication
3. Set up an OpenAI API key for real AI grading

## Mock Data

The prototype includes mock data for:
- A teacher account
- Several student accounts
- Sample classes
- Sample assignments
- Sample submissions

## Simulated AI Grading

The AI grading functionality is simulated in this prototype. It generates random scores and predefined feedback. In a production environment, this would use the OpenAI API to analyze submissions and provide real AI-generated grades and feedback.

## Next Steps for Production

To convert this prototype to a production-ready application:

1. Uncomment and configure the MongoDB connection in `lib/db.ts`
2. Set up NextAuth.js for authentication in `lib/auth.ts`
3. Add your OpenAI API key to `.env.local`
4. Replace the mock data functions with real database queries

## License

[MIT](LICENSE)
