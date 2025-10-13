'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DeveloperToolsPage() {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <Header title="API & Developer Access" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6">
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle>Public API</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage your API keys to integrate with your own tools and services.</p>
              <Button>Generate New Key</Button>
            </CardContent>
          </Card>
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Use webhooks to receive notifications about events in your application.</p>
              <Button>Create New Webhook</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
