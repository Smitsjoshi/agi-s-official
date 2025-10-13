import { DollarSign, Scale, Users, HardHat, Briefcase, Microscope } from 'lucide-react';
import type { AdversaryPersona } from './types';

export const ADVERSARY_PERSONAS: AdversaryPersona[] = [
    {
        id: 'cfo',
        name: 'The Skeptical CFO',
        description: 'Focuses on budget holes, unsustainable costs, and lack of a clear revenue model.',
        icon: DollarSign,
    },
    {
        id: 'competitor_ceo',
        name: 'The Competitor\'s CEO',
        description: 'Identifies market vulnerabilities, competitive threats, and areas a rival could easily exploit.',
        icon: Briefcase,
    },
    {
        id: 'ethicist',
        name: 'The Devil\'s Advocate Ethicist',
        description: 'Questions the moral, societal, and long-term unintended consequences of the plan.',
        icon: Scale,
    },
    {
        id: 'customer',
        name: 'The Jaded Customer',
        description: 'Points out user experience flaws, friction points, and why they wouldn\'t adopt or pay for it.',
        icon: Users,
    },
    {
        id: 'engineer',
        name: 'The Pragmatic Engineer',
        description: 'Critiques technical feasibility, scalability issues, and hidden implementation complexities.',
        icon: HardHat,
    },
    {
        id: 'legal',
        name: 'The Cautious Legal Counsel',
        description: 'Identifies potential regulatory hurdles, data privacy risks, and intellectual property issues.',
        icon: Microscope,
    },
];
