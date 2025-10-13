'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DeveloperToolsPage from '../developer-tools/page';

// A more robust solution would involve a component mapping
// or dynamic imports based on the extension ID.

export default function ExtensionDetailsPage() {
  const { id } = useParams();

  if (id === 'developer-tools') {
    return <DeveloperToolsPage />;
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Extension Not Found</h1>
      <p>The requested extension details could not be found.</p>
    </div>
  );
}
