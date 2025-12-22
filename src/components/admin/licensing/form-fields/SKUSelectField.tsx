import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState, useMemo } from "react";

type CatalogItem = {
  id: string;
  product_name: string;
  sku: string | null;
  product_type: string;
  base_price: number;
};

interface SKUSelectFieldProps {
  form: UseFormReturn<any>;
  catalogItems: CatalogItem[];
}

const SKUSelectField: React.FC<SKUSelectFieldProps> = ({ form, catalogItems }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm) return catalogItems.filter(item => item.sku);
    const lowerSearch = searchTerm.toLowerCase();
    return catalogItems.filter(item => 
      item.sku && (
        item.sku.toLowerCase().includes(lowerSearch) ||
        item.product_name.toLowerCase().includes(lowerSearch)
      )
    );
  }, [catalogItems, searchTerm]);

  const selectedSku = form.watch('catalogSku');
  const selectedItem = catalogItems.find(item => item.sku === selectedSku);

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="catalogSku"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Catalog SKU (Optional)
            </FormLabel>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search SKU or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 mb-2"
              />
            </div>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a catalog SKU" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="">No SKU (Manual Entry)</SelectItem>
                {filteredItems.map((item) => (
                  <SelectItem key={item.id} value={item.sku || ''}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {item.sku}
                      </span>
                      <span>{item.product_name}</span>
                      {item.base_price > 0 && (
                        <span className="text-muted-foreground text-xs">
                          ${item.base_price}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Link this license to a catalog product via SKU
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedItem && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Selected Product:</span>
            <span className="font-medium">{selectedItem.product_name}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-muted-foreground">Type:</span>
            <span className="capitalize">{selectedItem.product_type}</span>
          </div>
          {selectedItem.base_price > 0 && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-muted-foreground">Base Price:</span>
              <span className="font-medium text-green-600">${selectedItem.base_price}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SKUSelectField;
