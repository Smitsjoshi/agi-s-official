'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Bot } from 'lucide-react';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg animate-pulse"
        >
          <Bot size={32} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[440px] h-[600px] p-0 mr-4 mb-2">
        <ChatInterface />
      </PopoverContent>
    </Popover>
  );
}
