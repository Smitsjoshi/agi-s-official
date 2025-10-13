'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { PanelLeft, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import useLocalStorage from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/lib/types";


export function Header() {
    const pathname = usePathname();
    const { toast } = useToast();
    const [, setMessages] = useLocalStorage<ChatMessage[]>('chat-history', []);

    const isAskPage = pathname.startsWith('/ask');

    const handleNewChat = () => {
        setMessages([]);
        if (isAskPage) {
            toast({ title: 'New chat started' });
        }
    };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger>
                    <PanelLeft />
                </SidebarTrigger>
            </div>
            <div className="hidden md:block">
                <SidebarTrigger>
                    <PanelLeft />
                </SidebarTrigger>
            </div>
        </div>
      
      <div className="flex-1"></div>

      
      <Button variant="outline" onClick={handleNewChat}>
          <PlusCircle className="mr-2" />
          New Chat
      </Button>
      
    </header>
  );
}
