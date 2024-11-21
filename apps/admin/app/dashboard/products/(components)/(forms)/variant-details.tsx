import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductFormValues } from "./product-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VariantDetailsProps {
  form: UseFormReturn<ProductFormValues>;
  variantFields: Record<"id", string>[];
}

export function VariantDetails({ form, variantFields }: VariantDetailsProps) {
  const [groupBy, setGroupBy] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);
  const sanitizedOptions = form.getValues("options").filter(option => !!option.name);

  useEffect(() => {
    const options = form.getValues("options");
    if (options.length > 0 && !groupBy) {
      setGroupBy(options[0].name);
    }
  }, [form, groupBy]);

  const groupedVariants = variantFields.reduce((acc, field, index) => {
    const optionCombination = form.getValues(`variants.${index}.optionCombination`);
    const groupIndex = form.getValues("options").findIndex(option => option.name === groupBy);
    const groupValue = optionCombination[groupIndex] || "Ungrouped";
    if (!acc[groupValue]) acc[groupValue] = [];
    acc[groupValue].push({ field, index });
    return acc;
  }, {} as Record<string, { field: Record<"id", string>, index: number }[]>);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleAllGroups = (event: React.MouseEvent) => {
    event.preventDefault();
    if (allExpanded) {
      setExpandedGroups({});
    } else {
      const allExpanded = Object.keys(groupedVariants).reduce((acc, group) => {
        acc[group] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedGroups(allExpanded);
    }
    setAllExpanded(!allExpanded);
  };

  const getVariantLabel = (optionCombination: string[], groupIndex: number) => {
    return optionCombination.filter((_, index) => index !== groupIndex).join(" / ");
  };

  const updateGroupValues = (group: string, field: "price" | "available", value: number) => {
    groupedVariants[group].forEach(({ index }) => {
      form.setValue(`variants.${index}.${field}`, value);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Group by</span>
          <Select onValueChange={setGroupBy} value={groupBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {sanitizedOptions.map((option, index) => (
                <SelectItem key={index} value={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">
                  <div className="flex items-center gap-2">
                    <span>Variant</span>
                    <span className="text-muted-foreground text-xs">•</span>
                    <button
                      className="text-sm hover:underline focus:outline-none"
                      onClick={toggleAllGroups}
                      type="button"
                    >
                      {allExpanded ? "Collapse all" : "Expand all"}
                    </button>
                  </div>
                </TableHead>
                <TableHead className="w-[25%]">Price</TableHead>
                <TableHead className="w-[25%]">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedVariants).map(([group, variants]) => (
                <React.Fragment key={group}>
                  <TableRow className="group hover:bg-muted/50">
                    <TableCell className="py-2">
                      <div 
                        className="flex items-center gap-2 cursor-pointer" 
                        onClick={() => toggleGroup(group)}
                      >
                        <div>
                          <h4 className="font-medium">{group}</h4>
                          <p className="text-sm text-muted-foreground">{variants.length} variants</p>
                        </div>
                        {expandedGroups[group] ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <FormField
                        control={form.control}
                        name={`variants.${variants[0].index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="$0.00"
                                {...field}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  field.onChange(value);
                                  updateGroupValues(group, "price", value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <FormField
                        control={form.control}
                        name={`variants.${variants[0].index}.available`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(value);
                                  updateGroupValues(group, "available", value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  {expandedGroups[group] && variants.map(({ field, index }) => {
                    const optionCombination = form.getValues(`variants.${index}.optionCombination`);
                    const groupIndex = form.getValues("options").findIndex(option => option.name === groupBy);
                    const variantLabel = getVariantLabel(optionCombination, groupIndex);
                    return (
                      <TableRow key={field.id} className="bg-muted/30">
                        <TableCell className="py-2 pl-6">
                          <div>{variantLabel}</div>
                        </TableCell>
                        <TableCell className="py-2">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="$0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="py-2">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.available`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

