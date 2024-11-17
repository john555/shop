import * as React from 'react';

import { cn } from '@/lib/utils';

const EmptyPlaceholder = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50',
      className
    )}
    {...props}
  />
));
EmptyPlaceholder.displayName = 'EmptyPlaceholder';

const EmptyPlaceholderIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-20 w-20 items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
));
EmptyPlaceholderIcon.displayName = 'EmptyPlaceholderIcon';

const EmptyPlaceholderTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('mt-6 text-xl font-semibold', className)}
    {...props}
  />
));
EmptyPlaceholderTitle.displayName = 'EmptyPlaceholderTitle';

const EmptyPlaceholderDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'mt-3 mb-8 text-center text-sm font-normal leading-6 text-muted-foreground',
      className
    )}
    {...props}
  />
));
EmptyPlaceholderDescription.displayName = 'EmptyPlaceholderDescription';

export {
  EmptyPlaceholder,
  EmptyPlaceholderIcon,
  EmptyPlaceholderTitle,
  EmptyPlaceholderDescription,
};
