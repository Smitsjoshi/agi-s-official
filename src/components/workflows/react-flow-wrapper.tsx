'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    Mail, Filter, GitMerge, Bot, MessageSquare, Database, LucideIcon, Play, Code, Clock, Webhook, Terminal,
    FileText, Image, PenSquare, Share2, Shuffle, Combine, Milestone, ToggleLeft, Repeat, Variable,
    ArrowRightLeft, FileJson, Link2, MousePointer, Type, Eye, Camera, Download, Slack, AtSign, Send,
    Table, BookUser, Search, GitBranch, Asterisk, BookCopy, Zap, Cpu, ShieldHalf, Star, BookOpen, BookCheck,
    // New Icons for the massive update
    BrainCircuit, GitCommit, Server, Cloud, ShoppingCart, Briefcase, BarChart, Mic, Video, Users,
    File, Folder, Trash, Upload, DownloadCloud, FileUp, FileDown, Layers, Package, GitPullRequest,
    Code2, Braces, Settings, ToggleRight, AlertCircle, Bug, TestTube, Rocket, Anchor, Globe,
    Network, Key, Shield, User, UserPlus, UserMinus, Calendar, MapPin, Phone, Mailbox,
    MessageCircle, Share, ThumbsUp, ThumbsDown, Award, Trophy, Gift, Sun, Moon, Sunset,
    Sunrise, Wind, CloudSun, CloudMoon, CloudRain, CloudSnow, CloudLightning, Gauge, Speedometer,
    Bitcoin, DollarSign, Euro, PoundSterling, CreditCard, Banknote, Wallet, Landmark, Building,
    Home, Warehouse, Factory, Car, Train, Ship, Plane, Bike, Tractor, Ambulance,
    Truck, Brush, Paintbrush, Palette, Layout, Grid, Rows, Columns, AppWindow, SquareCode,
    CircleDot, Triangle, Octagon, Square, Spline, Waypoints, Workflow, Timer, Watch, Laptop,
    Smartphone, Tablet, HardDrive, Mouse, Keyboard, Speaker, Disc, Save, Printer, Radio,
    Rss, Wifi, Battery, BatteryCharging, Plug, Component, ToyBrick, Puzzle, Glasses, Sticker, Book, Bookmark, Clipboard, ClipboardList, 
    ClipboardCheck, Copy, Scissors, Paperclip, Unlink, ExternalLink, Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3

} from 'lucide-react';

import CustomNode, { CustomNodeData } from './custom-node';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: '1',
    type: 'custom',
    data: { icon: Mail, title: 'Email Trigger', description: 'Starts when an email is received.', isTrigger: true },
    position: { x: 250, y: 150 },
  },
  {
    id: '2',
    type: 'custom',
    data: { icon: Filter, title: 'Filter by Subject', description: 'Only continue if subject contains "Invoice".' },
    position: { x: 550, y: 50 },
  },
   {
    id: '3',
    type: 'custom',
    data: { icon: Bot, title: 'Summarize with AI', description: 'Uses AI to summarize the email content.' },
    position: { x: 550, y: 250 },
  },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep' },
    { id: 'e1-3', source: '1', target: '3', animated: true, type: 'smoothstep' }
];

const nodeTypes = {
    custom: CustomNode,
};

type NodePaletteItem = {
    icon: LucideIcon;
    title: string;
    description: string;
    isTrigger?: boolean;
};

const paletteNodes: Record<string, NodePaletteItem[]> = {
    "Triggers": [
        { icon: Play, title: "Manual Trigger", description: "Start workflow manually.", isTrigger: true },
        { icon: Clock, title: "Schedule", description: "Trigger workflow at a specific time.", isTrigger: true },
        { icon: Webhook, title: "Webhook", description: "Start workflow when a webhook is called.", isTrigger: true },
        { icon: Mail, title: "Email Trigger", description: "Start workflow on new email.", isTrigger: true },
        { icon: GitCommit, title: "New Git Commit", description: "Trigger on new commit to a repository.", isTrigger: true },
        { icon: Database, title: "New DB Row", description: "Trigger when a new row is added to a table.", isTrigger: true },
        { icon: ShoppingCart, title: "New Purchase", description: "Trigger on a new e-commerce purchase.", isTrigger: true },
        { icon: UserPlus, title: "New User", description: "Trigger when a new user signs up.", isTrigger: true },
        { icon: FileUp, title: "File Uploaded", description: "Trigger when a file is uploaded to storage.", isTrigger: true },
    ],
    "AGI-S Core": [
        { icon: Bot, title: "AI Knowledge", description: "Use the main AI chat function." },
        { icon: Code, title: "Generate with CodeX", description: "Create a UI component with AI." },
        { icon: Cpu, title: "Analyze with Canvas", description: "Run a goal-oriented web agent." },
        { icon: BookCopy, title: "Deep Dive Analysis", description: "Get in-depth analysis on a topic." },
        { icon: BookCheck, title: "Analyze with Synthesis", description: "Analyze a dataset with AI." },
        { icon: ShieldHalf, title: "Critique with Crucible", description: "Red Team a strategy with AI personas." },
        { icon: Star, title: "Generate with Cosmos", description: "Create a fictional world." },
        { icon: BookOpen, title: "Generate with Catalyst", description: "Create a personalized learning path." },
    ],
    "Advanced AI & Machine Learning": [
        { icon: BrainCircuit, title: "Train Model", description: "Train a custom machine learning model."}, 
        { icon: Bot, title: "Sentiment Analysis", description: "Analyze the sentiment of a text."}, 
        { icon: Eye, title: "Image Recognition", description: "Identify objects and text in images."}, 
        { icon: Mic, title: "Speech-to-Text", description: "Transcribe audio to text."}, 
        { icon: MessageSquare, title: "Text Summarization", description: "Summarize a long piece of text."}, 
        { icon: Share2, title: "Topic Modeling", description: "Identify topics in a corpus of text."}, 
        { icon: Users, title: "Customer Churn Prediction", description: "Predict if a customer will churn."}, 
        { icon: Filter, title: "Spam Detection", description: "Detect spam in emails or messages."}, 
        { icon: ArrowRightLeft, title: "Language Translation", description: "Translate text from one language to another."}, 
    ],
    "Development & DevOps": [
        { icon: GitCommit, title: "Git Commit", description: "Commit changes to a Git repository."}, 
        { icon: GitMerge, title: "Git Merge", description: "Merge a branch into another."}, 
        { icon: GitPullRequest, title: "Create Pull Request", description: "Create a pull request on GitHub/GitLab."}, 
        { icon: Server, title: "Deploy to Server", description: "Deploy an application to a server."}, 
        { icon: Rocket, title: "Run CI/CD Pipeline", description: "Trigger a CI/CD pipeline."}, 
        { icon: Bug, title: "Create Issue", description: "Create an issue in a bug tracker."}, 
        { icon: TestTube, title: "Run Tests", description: "Run unit tests or integration tests."}, 
        { icon: Terminal, title: "Run Shell Command", description: "Execute a shell command on a server."}, 
    ],
    "Cloud Services (AWS, GCP, Azure)": [
        { icon: Cloud, title: "AWS Lambda", description: "Invoke an AWS Lambda function."}, 
        { icon: Upload, title: "AWS S3 Upload", description: "Upload a file to an AWS S3 bucket."}, 
        { icon: Cloud, title: "GCP Cloud Function", description: "Invoke a Google Cloud Function."}, 
        { icon: Upload, title: "GCP Cloud Storage Upload", description: "Upload a file to GCS."}, 
        { icon: Cloud, title: "Azure Function", description: "Invoke an Azure Function."}, 
        { icon: Upload, title: "Azure Blob Storage Upload", description: "Upload a file to Azure Blob Storage."}, 
        { icon: Database, title: "AWS RDS Query", description: "Run a query on an AWS RDS database."}, 
        { icon: Database, title: "GCP Cloud SQL Query", description: "Run a query on a GCP Cloud SQL database."}, 
    ],
    "E-commerce (Shopify, Stripe, etc.)": [
        { icon: ShoppingCart, title: "Get Shopify Products", description: "Get a list of products from Shopify."}, 
        { icon: Users, title: "Get Shopify Customers", description: "Get a list of customers from Shopify."}, 
        { icon: DollarSign, title: "Create Stripe Charge", description: "Create a charge in Stripe."}, 
        { icon: CreditCard, title: "Get Stripe Customer", description: "Get a customer from Stripe."}, 
        { icon: Package, title: "Fulfill Shopify Order", description: "Fulfill an order in Shopify."}, 
        { icon: Milestone, title: "Create Shopify Discount", description: "Create a discount code in Shopify."}, 
    ],
    "Marketing & Sales (Salesforce, HubSpot, etc.)": [
        { icon: UserPlus, title: "Create Salesforce Lead", description: "Create a new lead in Salesforce."}, 
        { icon: BookUser, title: "Get HubSpot Contact", description: "Get a contact from HubSpot."}, 
        { icon: Mail, title: "Send Mailchimp Campaign", description: "Send a campaign from Mailchimp."}, 
        { icon: BarChart, title: "Get Google Analytics Report", description: "Get a report from Google Analytics."}, 
        { icon: Users, title: "Add Contact to HubSpot List", description: "Add a contact to a list in HubSpot."}, 
        { icon: Landmark, title: "Update Salesforce Opportunity", description: "Update an opportunity in Salesforce."}, 
    ],
    "Web Agent": [
        { icon: Link2, title: "Go to URL", description: "Navigate to a specific web page." },
        { icon: MousePointer, title: "Click Element", description: "Click on a link, button, or element." },
        { icon: Type, title: "Type Text", description: "Input text into a form field." },
        { icon: Eye, title: "Extract Data", description: "Extract text or data from an element." },
        { icon: Search, title: "Web Search", description: "Perform a web search." },
        { icon: Camera, title: "Take Screenshot", description: "Capture a screenshot of the current page." },
        { icon: FileJson, title: "Scrape Website", description: "Scrape data from a website."}, 
        { icon: Code, title: "Execute Javascript", description: "Execute Javascript on the current page."}, 
    ],
    "Logic & Control": [
        { icon: GitBranch, title: "If/Else", description: "Branch workflow based on a condition." },
        { icon: Shuffle, title: "Switch", description: "Route to different branches based on value." },
        { icon: Filter, title: "Filter Data", description: "Continue only if data meets criteria." },
        { icon: Repeat, title: "Loop Over Items", description: "Execute steps for each item in a list." },
        { icon: Combine, title: "Merge", description: "Merge multiple branches into one." },
        { icon: Clock, title: "Wait", description: "Pause the workflow for a set time." },
        { icon: Terminal, title: "Execute Code", description: "Run a JavaScript or Python snippet." },
        { icon: Zap, title: "End Workflow", description: "Stop the workflow execution." },
        { icon: AlertCircle, title: "Error Handling", description: "Catch and handle errors in the workflow."}, 
        { icon: ToggleLeft, title: "Boolean Logic", description: "Perform AND/OR/NOT operations."}, 
    ],
    "Data Handling": [
        { icon: Variable, title: "Set Variable", description: "Create or update a variable." },
        { icon: PenSquare, title: "Edit Fields", description: "Add, edit, or remove fields from data." },
        { icon: ArrowRightLeft, title: "Convert Data", description: "Change data format (e.g., JSON to CSV)." },
        { icon: FileJson, title: "Parse JSON", description: "Extract data from a JSON object." },
        { icon: Table, title: "Create Table", description: "Construct a table from data." },
        { icon: FileText, title: "Create Text", description: "Compose or format a block of text." },
        { icon: Code2, title: "Format Code", description: "Format code in a specific language."}, 
        { icon: Braces, title: "Create JSON", description: "Create a JSON object from scratch."}, 
    ],
    "Integrations": [
        { icon: Slack, title: "Send Slack Message", description: "Post a message to a Slack channel." },
        { icon: Send, title: "Send Discord Message", description: "Post a message to a Discord channel." },
        { icon: AtSign, title: "Send Email", description: "Send an email via SMTP or a service." },
        { icon: BookUser, title: "Google Sheets", description: "Read or write to a Google Sheet." },
        { icon: Database, title: "Airtable", description: "Read or write to an Airtable base." },
        { icon: Milestone, title: "Notion", description: "Create or update a Notion page/database." },
        { icon: Download, title: "HTTP Request", description: "Make an API call to any service." },
        { icon: GitCommit, title: "GitHub", description: "Interact with the GitHub API."}, 
        { icon: MessageCircle, title: "Twilio", description: "Send SMS messages via Twilio."}, 
    ],
};

const WorkflowSidePanel = ({ onAddNode }: { onAddNode: (nodeType: CustomNodeData) => void }) => (
    <Card className="h-full rounded-none border-l-0">
        <CardHeader>
            <CardTitle>Nodes</CardTitle>
            <CardDescription>Click a node to add it to the canvas.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-14rem)]">
                 <Accordion type="multiple" defaultValue={Object.keys(paletteNodes)} className="w-full">
                    {Object.entries(paletteNodes).map(([category, nodes]) => (
                        <AccordionItem value={category} key={category} className="px-3">
                            <AccordionTrigger className="font-semibold text-primary hover:no-underline">{category}</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-1">
                                {nodes.map(node => (
                                    <button key={node.title} className="w-full text-left" onClick={() => onAddNode({ ...node })}>
                                        <div className="p-2 rounded-lg hover:bg-muted flex items-start gap-3">
                                            <node.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold text-sm">{node.title}</p>
                                                <p className="text-xs text-muted-foreground">{node.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            </ScrollArea>
        </CardContent>
    </Card>
);

export function ReactFlowWrapper() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
    [setEdges]
  );
  
  const onAddNode = (nodeData: Omit<CustomNodeData, 'description'>) => {
    const newNode: Node<CustomNodeData> = {
        id: `node-${+new Date()}`,
        type: 'custom',
        data: { ...nodeData, description: nodeData.description || '' },
        position: { x: Math.random() * 200 + 200, y: Math.random() * 200 },
    };
    setNodes((nds) => nds.concat(newNode));
  }


  return (
    <div className="h-[calc(100vh-5rem)] w-full flex">
        <div className="flex-grow h-full" style={{ width: 'calc(100% - 350px)'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
            >
                <div className="absolute top-4 right-4 z-10">
                     <Button asChild>
                       <Link href="/pro">Save & Activate</Link>
                     </Button>
                </div>
                <Controls />
                <MiniMap nodeColor={(node) => {
                    if (node.type === 'custom' && (node.data as CustomNodeData).isTrigger) return '#22c55e';
                    return '#0ea5e9';
                }} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
        <div className="w-[350px] h-full border-l">
            <WorkflowSidePanel onAddNode={onAddNode} />
        </div>
    </div>
  );
}
