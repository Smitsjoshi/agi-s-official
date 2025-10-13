'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Extension } from '@/lib/types';

interface ExtensionCardProps {
  extension: Extension;
  onToggle: (id: string, enabled: boolean) => void;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function ExtensionCard({ extension, onToggle, onConnect, onDisconnect }: ExtensionCardProps) {
  const { id, name, version, description, icon: Icon, enabled, connected } = extension;

  return (
    <Card className="flex flex-col h-full bg-gray-800 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <Icon className="w-8 h-8 text-gray-400" />
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(isChecked) => onToggle(id, isChecked)}
          aria-label={`Enable ${name}`}
          disabled={!connected}
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-400 mb-2">v{version}</p>
        <p className="text-sm text-gray-300">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4">
        {connected ? (
          <div className="flex items-center space-x-2">
            <Badge variant="success">Connected</Badge>
            <Button variant="outline" size="sm" onClick={() => onDisconnect(id)}>Disconnect</Button>
          </div>
        ) : (
          <Button variant="default" size="sm" onClick={() => onConnect(id)}>Connect</Button>
        )}
        {id === 'developer-tools' && connected && (
          <Link href={`/extensions/${id}`} passHref>
            <Button variant="ghost" size="sm">Details</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
