import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Clock, Code, Database, Rocket, Sliders, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type FeatureStatus = 'available' | 'in_progress' | 'planned';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: FeatureStatus;
  route?: string;
}

const features: Feature[] = [
  {
    id: 'db-expansion',
    title: 'Expanded Database Support',
    description:
      'Support for Oracle, SQLite, and MongoDB (NoSQL) will be added to enable broader database compatibility.',
    icon: Database,
    status: 'in_progress',
  },
  {
    id: 'language-expansion',
    title: 'Multi-Language Code Generation',
    description:
      'TypeGen will support code generation for Python, Kotlin, Rust, and Go, enabling use across diverse backend stacks.',
    icon: Code,
    status: 'planned',
  },
  {
    id: 'advanced-dto-options',
    title: 'Advanced DTO Configuration',
    description:
      'More customization options will be introduced when creating DTOs/Types, giving users greater control over generated models.',
    icon: Sliders,
    status: 'in_progress',
  },
  {
    id: 'ai-suggestions',
    title: 'AI-Powered Suggestions',
    description: 'Get intelligent naming and type suggestions using AI.',
    icon: Sparkles,
    status: 'planned',
  },
  {
    id: 'custom-request',
    title: 'Feature Updates on Request',
    description: 'This feature will be updated dynamically based on user requests.',
    icon: Sparkles,
    status: 'in_progress',
  },
];

const statusLabels: Record<FeatureStatus, string> = {
  available: 'Available',
  in_progress: 'In Progress',
  planned: 'Planned',
};

const statusColors: Record<FeatureStatus, string> = {
  available: 'bg-success/10 text-success border-success/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  planned: 'bg-muted text-muted-foreground border-border',
};

export function ComingSoon() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const handleFeatureClick = (feature: Feature) => {
    if (feature.status !== 'available') {
      setSelectedFeature(feature);
    } else if (feature.route) {
      /* empty */
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Rocket size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Coming Soon</h1>
          <p className="text-muted-foreground">Features under development for future updates</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isAvailable = feature.status === 'available';

          const card = (
            <div
              key={feature.id}
              onClick={() => handleFeatureClick(feature)}
              className={cn(
                'relative group rounded-xl border bg-card p-5 transition-all duration-200',
                isAvailable
                  ? 'cursor-pointer hover:shadow-lg hover:border-primary/30'
                  : 'cursor-not-allowed opacity-75 hover:opacity-85',
              )}
            >
              {/* Coming Soon Badge */}
              {!isAvailable && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-accent text-accent-foreground border-border">
                    <Clock size={12} />
                    Coming Soon
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg mb-4 transition-colors',
                  isAvailable
                    ? 'bg-primary/10 text-primary group-hover:bg-primary/20'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon size={22} />
              </div>

              {/* Content */}
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

              {/* Status Badge */}
              <div
                className={cn(
                  'inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium',
                  statusColors[feature.status],
                )}
              >
                {statusLabels[feature.status]}
              </div>
            </div>
          );

          if (!isAvailable) {
            return (
              <Tooltip key={feature.id} delayDuration={300}>
                <TooltipTrigger asChild>{card}</TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px] text-center">
                  This feature is under development and will be available in a future update.
                </TooltipContent>
              </Tooltip>
            );
          }

          return card;
        })}
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedFeature && (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <selectedFeature.icon size={20} className="text-muted-foreground" />
                </div>
              )}
              <DialogTitle>{selectedFeature?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              This feature is currently under development. I am working on stability and performance
              before releasing it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground mb-3">{selectedFeature?.description}</p>
              <div
                className={cn(
                  'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium',
                  selectedFeature && statusColors[selectedFeature.status],
                )}
              >
                Status: {selectedFeature && statusLabels[selectedFeature.status]}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setSelectedFeature(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ComingSoon;
