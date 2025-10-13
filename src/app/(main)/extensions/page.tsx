'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ExtensionCard } from '@/components/extensions/extension-card';
import { extensions as initialExtensions } from '@/lib/extensions';

export default function ExtensionsPage() {
  const [extensions, setExtensions] = useState(initialExtensions);

  const handleToggleExtension = (id: string, enabled: boolean) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled } : ext
    ));
  };

  const handleConnect = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, connected: true, enabled: true } : ext
    ));
  };

  const handleDisconnect = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, connected: false, enabled: false } : ext
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <Header title="Extensions" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {extensions.map((extension) => (
            <ExtensionCard 
              key={extension.id} 
              extension={extension} 
              onToggle={handleToggleExtension}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
