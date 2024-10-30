"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";

function SearchBarContent({
  isOpen,
  isMobile,
}: {
  isOpen: boolean;
  isMobile?: boolean;
}) {
  return (
    <>
      <CommandInput placeholder="Search" />
      {isOpen ? (
        <CommandList
          className={cn(
            !isMobile &&
              "absolute left-[-1px] right-[-1px] top-[40px] bg-white rounded-b-md border shadow-md"
          )}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              Password Reset <CommandShortcut>⌘R</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      ) : null}
    </>
  );
}
export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  return (
    <>
      <Command className="md:hidden">
        <CommandInput placeholder="Search" onFocus={() => setIsOpen(true)} />
      </Command>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <SearchBarContent isOpen={isOpen} isMobile />
      </CommandDialog>
      <Command
        className={cn(
          "hidden md:flex relative rounded-md border max-w-lg overflow-visible box-border",
          hasContent ? "border-b-0 rounded-b-none shadow-md" : ""
        )}
        onFocus={() => setHasContent(true)}
        onBlur={() => setHasContent(false)}
      >
        <SearchBarContent isOpen={hasContent} />
      </Command>
    </>
  );
}
