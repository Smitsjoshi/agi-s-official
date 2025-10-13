# **App Name**: AGI-S

## Core Features:

- User Authentication: Implement user sign-in with Supabase magic links, with redirection to the /ask page upon successful authentication.
- AI Mode Selection & Orchestration: Provide a dropdown menu on the /ask page to select from AI modes (AI Knowledge, Coding, Academic Research, Deep Dive). Route user's query to the correct AI flow using a Genkit orchestrator based on the selected mode, utilizing the webSearchTool for web searches, and handling uploaded images with Gemini.
- Chat History Persistence: Maintain the /ask page chat history within the browser's local storage, enabling users to resume conversations.
- Code Generation: Implement a 'Coding' AI mode that searches for code examples online and synthesizes complete, runnable HTML/Tailwind components using a Gemini model.
- AI Academic Research: Build an 'Academic Research' AI mode that searches Wikipedia, ArXiv, and PubMed and generates hardcoded safety disclaimers. Reasoning: Determine which pieces of info should or shouldn't be present.
- Mini AGI-S Agents: Allow users to create custom agents by defining a persona, name, and knowledge base URLs.
- Video generation: Generate short videos from text prompts with Veo model.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent intelligence and technology.
- Background color: Light gray (#F5F5F5), nearly desaturated blue, to provide a clean and neutral backdrop.
- Accent color: An analogous, slightly darker shade of blue with increased saturation (#1E90FF) for interactive elements.
- Headline font: 'Space Grotesk' sans-serif for headlines; body font: 'Inter' sans-serif.
- Use clean and modern icons from a library like FontAwesome or Material Icons for navigation and actions.
- Implement a collapsible sidebar layout for main navigation.  Main content area should have a clean and structured design.
- Subtle transitions and animations for UI elements and data loading to enhance the user experience.