import { Cog, Calendar, Mail, Compass } from 'lucide-react';
import type { Extension } from './types';

export const extensions: Extension[] = [
  {
    id: 'code-executor',
    name: 'Code Executor',
    version: '1.0.0',
    description: 'Execute code snippets in a sandboxed environment.',
    icon: Cog,
    enabled: true,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    version: '1.0.0',
    description: 'Integrate with your calendar to manage events.',
    icon: Calendar,
    enabled: false,
  },
  {
    id: 'email',
    name: 'Email',
    version: '1.0.0',
    description: 'Connect your email to read and send messages.',
    icon: Mail,
    enabled: false,
  },
  {
    id: 'web-browser',
    name: 'Web Browser',
    version: '1.0.0',
    description: 'Browse the web to find information.',
    icon: Compass,
    enabled: true,
  },
];
