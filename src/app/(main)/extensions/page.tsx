'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { ExtensionCard } from '@/components/extensions/extension-card';
import { extensions } from '@/lib/extensions';

export default function ExtensionsPage() {
  return (
    <div className="h-full flex flex-col">
      <Header title="Extensions" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {extensions.map((extension) => (
            <ExtensionCard key={extension.id} extension={extension} />
          ))}
        </div>
      </div>
    </div>
  );
}
