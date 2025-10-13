'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';

export type CustomNodeData = {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
  isTrigger?: boolean;
};

const CustomNode = ({ data, selected }: NodeProps<CustomNodeData>) => {
  const Icon = data.icon;

  return (
    <div className={cn("w-64", selected && 'shadow-lg shadow-primary/50')}>
        <Card className={cn(
            "bg-background/80 backdrop-blur-sm border-2 transition-all",
            selected ? "border-primary" : "border-border/20",
            data.isTrigger && "border-green-500/80"
        )}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-3">
                <div className={cn(
                    "p-2 bg-primary/10 rounded-lg",
                    data.isTrigger && "bg-green-500/10"
                )}>
                    <Icon className={cn("h-6 w-6 text-primary", data.isTrigger && "text-green-500")} />
                </div>
                <div>
                    <CardTitle className="text-base">{data.title}</CardTitle>
                </div>
            </CardHeader>
        </Card>
      <Handle type="target" position={Position.Left} className="!bg-primary !w-3 !h-3" isConnectable={true} />
      <Handle type="source" position={Position.Right} className="!bg-primary !w-3 !h-3" isConnectable={true} />
    </div>
  );
};

export default memo(CustomNode);
