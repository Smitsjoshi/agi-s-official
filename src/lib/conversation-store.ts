import { ChatMessage, AiMode } from './types';

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  mode: AiMode;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  folder?: string;
  pinned?: boolean;
}

const STORAGE_KEY = 'agi-s-conversations';
const CURRENT_CONVERSATION_KEY = 'agi-s-current-conversation';

export class ConversationStore {
  static getAllConversations(): Conversation[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getConversation(id: string): Conversation | null {
    const conversations = this.getAllConversations();
    return conversations.find(c => c.id === id) || null;
  }

  static saveConversation(conversation: Conversation): void {
    const conversations = this.getAllConversations();
    const index = conversations.findIndex(c => c.id === conversation.id);
    
    conversation.updatedAt = Date.now();
    
    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }

  static deleteConversation(id: string): void {
    const conversations = this.getAllConversations();
    const filtered = conversations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static getCurrentConversationId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  }

  static setCurrentConversationId(id: string): void {
    localStorage.setItem(CURRENT_CONVERSATION_KEY, id);
  }

  static searchConversations(query: string): Conversation[] {
    const conversations = this.getAllConversations();
    const lowerQuery = query.toLowerCase();
    
    return conversations.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.messages.some(m => m.content.toLowerCase().includes(lowerQuery)) ||
      c.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  static getConversationsByFolder(folder: string): Conversation[] {
    const conversations = this.getAllConversations();
    return conversations.filter(c => c.folder === folder);
  }

  static getPinnedConversations(): Conversation[] {
    const conversations = this.getAllConversations();
    return conversations.filter(c => c.pinned);
  }

  static generateTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Conversation';
    
    const content = firstUserMessage.content.substring(0, 50);
    return content.length < firstUserMessage.content.length 
      ? content + '...' 
      : content;
  }
}
