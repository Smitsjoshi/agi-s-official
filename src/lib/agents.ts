
import type { Agent } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const scholarAvatar = PlaceHolderImages.find(p => p.id === 'scholar-avatar');
const coderAvatar = PlaceHolderImages.find(p => p.id === 'coder-avatar');
const analystAvatar = PlaceHolderImages.find(p => p.id === 'analyst-avatar');

export const agentCategories = {
  "Research & Analysis": [
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'An AI expert in academic research, capable of searching through millions of papers.',
      avatar: scholarAvatar?.imageUrl || `https://picsum.photos/seed/scholar/200/200`,
    },
    {
      id: 'analyst',
      name: 'Analyst',
      description: 'An AI that provides deep data analysis and insights from various sources.',
      avatar: analystAvatar?.imageUrl || `https://picsum.photos/seed/analyst/200/200`,
    },
    {
      id: 'market-researcher',
      name: 'Market Researcher',
      description: 'Provides insights into market trends, customer behavior, and competitive landscapes.',
      avatar: `https://picsum.photos/seed/market-researcher/200/200`,
    },
    {
        id: 'detective',
        name: 'Detective',
        description: 'Gathers and analyzes information to solve complex problems and answer questions.',
        avatar: `https://picsum.photos/seed/detective/200/200`,
    },
  ],
  "Software Development": [
    {
      id: 'coder',
      name: 'Coder',
      description: 'Your personal software engineering assistant for generating components and code.',
      avatar: coderAvatar?.imageUrl || `https://picsum.photos/seed/coder/200/200`,
    },
    {
      id: 'debugger',
      name: 'Debugger',
      description: 'Helps identify and fix bugs in your code.',
      avatar: `https://picsum.photos/seed/debugger/200/200`,
    },
    {
      id: 'architect',
      name: 'Architect',
      description: 'Assists in designing robust and scalable software architecture.',
      avatar: `https://picsum.photos/seed/architect/200/200`,
    },
    {
        id: 'ui-designer',
        name: 'UI Designer',
        description: 'Generates UI/UX suggestions and wireframes based on your descriptions.',
        avatar: `https://picsum.photos/seed/ui-designer/200/200`,
    },
  ],
  "Creative & Design": [
    {
        id: 'writer',
        name: 'Writer',
        description: 'Generates creative text formats, like poems, code, scripts, musical pieces, email, letters, etc.',
        avatar: `https://picsum.photos/seed/writer/200/200`,
    },
    {
        id: 'designer',
        name: 'Designer',
        description: 'Creates beautiful and effective visuals for your projects.',
        avatar: `https://picsum.photos/seed/designer/200/200`,
    },
    {
        id: 'musician',
        name: 'Musician',
        description: 'Composes original music in various styles.',
        avatar: `https://picsum.photos/seed/musician/200/200`,
    },
    {
        id: 'storyteller',
        name: 'Storyteller',
        description: 'Weaves engaging narratives and stories.',
        avatar: `https://picsum.photos/seed/storyteller/200/200`,
    },
  ],
  "Business & Strategy": [
    {
        id: 'strategist',
        name: 'Strategist',
        description: 'Helps you develop and refine your business strategies.',
        avatar: `https://picsum.photos/seed/strategist/200/200`,
    },
    {
        id: 'marketer',
        name: 'Marketer',
        description: 'Creates marketing copy and suggests campaign ideas.',
        avatar: `https://picsum.photos/seed/marketer/200/200`,
    },
    {
        id: 'project-manager',
        name: 'Project Manager',
        description: 'Helps you plan, execute, and track your projects.',
        avatar: `https://picsum.photos/seed/project-manager/200/200`,
    },
    {
        id: 'salesperson',
        name: 'Salesperson',
        description: 'Assists in drafting sales pitches and emails.',
        avatar: `https://picsum.photos/seed/salesperson/200/200`,
    },
  ]
};

export const allAgents: Agent[] = Object.values(agentCategories).flat();
