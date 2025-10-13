'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { Extension } from '@/lib/types';

interface ExtensionCardProps {
  extension: Extension;
}

export function ExtensionCard({ extension }: ExtensionCardProps) {
  const [isEnabled, setIsEnabled] = React.useState(extension.enabled);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    // Here you would typically also make an API call to persist the change
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-lg">
            <extension.icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{extension.name}</CardTitle>
            <CardDescription>{extension.version}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {extension.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch id={`enable-${extension.id}`} checked={isEnabled} onCheckedChange={handleToggle} />
          <label htmlFor={`enable-${extension.id}`} className="text-sm font-medium">
            {isEnabled ? 'Enabled' : 'Disabled'}
          </label>
        </div>
        <Button variant="ghost" size="sm">Details</Button>
      </CardFooter>
    </Card>
  );
}
