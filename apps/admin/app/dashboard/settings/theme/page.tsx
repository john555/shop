'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { THEMES } from '@/common/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { updateUser } from '@/common/actions/user';
import { useCurrentUser } from '@/common/hooks/auth';
import { Theme } from '@/types/api';

export default function ThemeSettingsPage() {
  const { user } = useCurrentUser();
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async (value: Theme) => {
    if (!user) return;
    setTheme(value.toLocaleLowerCase());

    await updateUser({ id: user.id, theme: value });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Theme Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Choose Theme</CardTitle>
          <CardDescription>
            Select your preferred color scheme for the application. Changes are
            saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <RadioGroup
            defaultValue={user?.theme}
            onValueChange={handleThemeChange}
            className="flex justify-center gap-8 pt-2"
          >
            {THEMES.map((theme) => (
              <TooltipProvider key={theme.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <RadioGroupItem
                        value={theme.value}
                        id={theme.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={theme.value}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-40"
                      >
                        <theme.icon className="mb-3 h-6 w-6" />
                        {theme.label}
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{theme.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
