
"use client";

import * as React from "react";
import { Globe, Lock, Search, Plus, ArrowLeft, ArrowRight, RefreshCw, Home, MoreVertical } from "lucide-react";

export const BrowserFrame = ({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-black border border-zinc-700/50 rounded-lg shadow-2xl overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-zinc-950 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-blue-500/20 to-transparent to-70% blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-purple-500/20 to-transparent to-70% blur-3xl animate-pulse [animation-delay:3s]"></div>
      </div>

      {/* Browser Chrome */}
      <div className="flex-shrink-0 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-700/50 flex items-center px-4 py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-4 ml-4">
            <ArrowLeft className="text-zinc-400" size={20} />
            <ArrowRight className="text-zinc-500" size={20} />
            <RefreshCw className="text-zinc-400" size={16} />
            <Home className="text-zinc-400" size={16} />
        </div>
        {/* Address Bar */}
        <div className="flex-grow mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="text-green-400/80" size={14} />
            </div>
            <input
              type="text"
              value={url}
              readOnly
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-full py-1 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Plus className="text-zinc-400" size={20} />
            <MoreVertical className="text-zinc-400" size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto relative z-0">
        {children}
      </div>
    </div>
  );
};
