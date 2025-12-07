'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Download, FolderOpen, Pin, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, ConversationStore } from '@/lib/conversation-store';
import { ExportUtils } from '@/lib/export-utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/ui-animations';

interface ConversationSidebarProps {
    currentConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
}

export function ConversationSidebar({
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: ConversationSidebarProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
    const [folders, setFolders] = useState<string[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
    const [newFolderName, setNewFolderName] = useState('');
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);








    +
        useEffect(() => {
            if (searchQuery) {
                setFilteredConversations(ConversationStore.searchConversations(searchQuery));
            } else {
                setFilteredConversations(conversations);
            }
        }, [searchQuery, conversations]);

    const loadConversations = () => {
        const allConversations = ConversationStore.getAllConversations();
        setConversations(allConversations.sort((a, b) => b.updatedAt - a.updatedAt));
        setFolders(ConversationStore.getFolders());
    };

    const handleDelete = (id: string) => {
        ConversationStore.deleteConversation(id);
        loadConversations();
        if (currentConversationId === id) {
            onNewConversation();
        }
    };

    const handleExport = async (conversation: Conversation, format: 'markdown' | 'html' | 'pdf' | 'json') => {
        await ExportUtils.exportConversation(conversation.messages, conversation.title, format);
    };

    const togglePin = (conversation: Conversation) => {
        conversation.pinned = !conversation.pinned;
        ConversationStore.saveConversation(conversation);
        loadConversations();
    };

    const createFolder = () => {
        if (newFolderName.trim()) {
            setIsNewFolderDialogOpen(false);
            setNewFolderName('');
        }
    };

    const toggleFolder = (folder: string) => {
        setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
    };

    const moveToFolder = (conversation: Conversation, folder: string | undefined) => {
        ConversationStore.moveConversationToFolder(conversation.id, folder);
        loadConversations();
    };

    const pinnedConversations = filteredConversations.filter(c => c.pinned);
    const unpinnedConversations = filteredConversations.filter(c => !c.pinned);
    const rootConversations = unpinnedConversations.filter(c => !c.folder);

    // Group by folder
    const folderConversations: Record<string, Conversation[]> = {};
    folders.forEach(folder => {
        folderConversations[folder] = unpinnedConversations.filter(c => c.folder === folder);
    });

    return (
        <div className="flex flex-col h-full border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="p-4 border-b space-y-3">
                <Button onClick={onNewConversation} className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                </Button>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <motion.div
                    className="p-2 space-y-1"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {pinnedConversations.length > 0 && (
                        <>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Pin className="h-3 w-3" /> Pinned
                            </div>
                            {pinnedConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    isActive={conversation.id === currentConversationId}
                                    onSelect={() => onSelectConversation(conversation.id)}
                                    onDelete={() => handleDelete(conversation.id)}
                                    onExport={(format) => handleExport(conversation, format)}
                                    onTogglePin={() => togglePin(conversation)}
                                    onMoveToFolder={(folder) => moveToFolder(conversation, folder)}
                                    folders={folders}
                                />
                            ))}
                        </>
                    )}

                    {/* Folders */}
                    {folders.map(folder => (
                        <div key={folder} className="space-y-1">
                            <div
                                className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => toggleFolder(folder)}
                            >
                                <FolderOpen className="h-3 w-3" />
                                {folder}
                                <span className="ml-auto text-[10px] opacity-70">{folderConversations[folder]?.length || 0}</span>
                            </div>

                            {(!expandedFolders[folder]) && (
                                (expandedFolders[folder] !== false) && folderConversations[folder]?.map(conversation => (
                                    <ConversationItem
                                        key={conversation.id}
                                        conversation={conversation}
                                        isActive={conversation.id === currentConversationId}
                                        onSelect={() => onSelectConversation(conversation.id)}
                                        onDelete={() => handleDelete(conversation.id)}
                                        onExport={(format) => handleExport(conversation, format)}
                                        onTogglePin={() => togglePin(conversation)}
                                        onMoveToFolder={(f) => moveToFolder(conversation, f)}
                                        folders={folders}
                                        className="ml-2 border-l pl-2"
                                    />
                                ))
                            )}
                        </div>
                    ))}

                    {/* Root Conversations */}
                    {rootConversations.length > 0 && (
                        <>
                            {(pinnedConversations.length > 0 || folders.length > 0) && (
                                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-4">
                                    Recent
                                </div>
                            )}
                            {rootConversations.map((conversation) => (
                                <ConversationItem
                                    key={conversation.id}
                                    conversation={conversation}
                                    isActive={conversation.id === currentConversationId}
                                    onSelect={() => onSelectConversation(conversation.id)}
                                    onDelete={() => handleDelete(conversation.id)}
                                    onExport={(format) => handleExport(conversation, format)}
                                    onTogglePin={() => togglePin(conversation)}
                                    onMoveToFolder={(folder) => moveToFolder(conversation, folder)}
                                    folders={folders}
                                />
                            ))}
                        </>
                    )}

                    {filteredConversations.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            {searchQuery ? 'No conversations found' : 'No conversations yet'}
                        </div>
                    )}
                </motion.div>
            </ScrollArea>
        </div>
    );
}

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onExport: (format: 'markdown' | 'html' | 'pdf' | 'json') => void;
    onTogglePin: () => void;
    onMoveToFolder: (folder: string | undefined) => void;
    folders: string[];
    className?: string;
}

function ConversationItem({
    conversation,
    isActive,
    onSelect,
    onDelete,
    onExport,
    onTogglePin,
    onMoveToFolder,
    folders,
    className
}: ConversationItemProps) {
    const [isEditingFolder, setIsEditingFolder] = useState(false);
    const [newFolderInput, setNewFolderInput] = useState('');

    return (
        <motion.div variants={staggerItem} className={cn("group", className)}>
            <div
                className={cn(
                    'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                    isActive ? 'bg-secondary' : 'hover:bg-muted/50'
                )}
                onClick={onSelect}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {conversation.pinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
                        <p className="text-sm font-medium truncate">{conversation.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTogglePin(); }}>
                            <Pin className="h-4 w-4 mr-2" />
                            {conversation.pinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Folder Management */}
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); /* Logic to show folder input */ }}>
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Move to...
                        </DropdownMenuItem>
                        {folders.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                {folders.map(folder => (
                                    <DropdownMenuItem key={folder} onClick={(e) => { e.stopPropagation(); onMoveToFolder(folder); }}>
                                        <span className="pl-4">{folder}</span>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMoveToFolder(undefined); }}>
                                    <span className="pl-4 text-muted-foreground">Remove from folder</span>
                                </DropdownMenuItem>
                            </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport('markdown'); }}>
                            <Download className="h-4 w-4 mr-2" />
                            Export as Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport('pdf'); }}>
                            <Download className="h-4 w-4 mr-2" />
                            Export as PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    );
}
