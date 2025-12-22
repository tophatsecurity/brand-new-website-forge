import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  Package, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  DollarSign,
  ShoppingCart,
  Percent,
  FileText
} from 'lucide-react';
import { useCatalog, CatalogItem } from '@/hooks/useCatalog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type QuoteItem = {
  item: CatalogItem;
  quantity: number;
  seats: number;
  discount: number;
};

const PriceCalculator: React.FC = () => {
  const { catalog, loading } = useCatalog();
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group items by product type
  const groupedCatalog = useMemo(() => {
    const groups: Record<string, CatalogItem[]> = {
      software: [],
      maintenance: [],
      service: [],
      bundle: []
    };
    catalog.forEach(item => {
      if (item.is_active && item.sku) {
        groups[item.product_type]?.push(item);
      }
    });
    return groups;
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    let items = catalog.filter(item => item.is_active && item.sku);
    
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.product_type === selectedCategory);
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.sku?.toLowerCase().includes(lowerSearch) ||
        item.product_name.toLowerCase().includes(lowerSearch) ||
        item.description.toLowerCase().includes(lowerSearch)
      );
    }
    
    return items;
  }, [catalog, searchTerm, selectedCategory]);

  const addToQuote = (item: CatalogItem) => {
    const existing = quoteItems.find(qi => qi.item.id === item.id);
    if (existing) {
      setQuoteItems(prev => prev.map(qi => 
        qi.item.id === item.id 
          ? { ...qi, quantity: qi.quantity + 1 }
          : qi
      ));
    } else {
      setQuoteItems(prev => [...prev, { item, quantity: 1, seats: 1, discount: 0 }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setQuoteItems(prev => prev.map(qi => {
      if (qi.item.id === itemId) {
        const newQty = Math.max(1, qi.quantity + delta);
        return { ...qi, quantity: newQty };
      }
      return qi;
    }));
  };

  const updateSeats = (itemId: string, seats: number) => {
    setQuoteItems(prev => prev.map(qi => 
      qi.item.id === itemId ? { ...qi, seats: Math.max(1, seats) } : qi
    ));
  };

  const updateItemDiscount = (itemId: string, discount: number) => {
    setQuoteItems(prev => prev.map(qi => 
      qi.item.id === itemId ? { ...qi, discount: Math.min(100, Math.max(0, discount)) } : qi
    ));
  };

  const removeFromQuote = (itemId: string) => {
    setQuoteItems(prev => prev.filter(qi => qi.item.id !== itemId));
  };

  const clearQuote = () => {
    setQuoteItems([]);
    setGlobalDiscount(0);
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    let itemDiscounts = 0;

    quoteItems.forEach(qi => {
      const lineTotal = qi.item.base_price * qi.quantity * qi.seats;
      const itemDiscount = lineTotal * (qi.discount / 100);
      subtotal += lineTotal;
      itemDiscounts += itemDiscount;
    });

    const afterItemDiscounts = subtotal - itemDiscounts;
    const globalDiscountAmount = afterItemDiscounts * (globalDiscount / 100);
    const total = afterItemDiscounts - globalDiscountAmount;

    return {
      subtotal,
      itemDiscounts,
      afterItemDiscounts,
      globalDiscountAmount,
      total,
      totalDiscounts: itemDiscounts + globalDiscountAmount
    };
  }, [quoteItems, globalDiscount]);

  const getProductTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      software: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      maintenance: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      service: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      bundle: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return <Badge variant="outline" className={styles[type] || ''}>{type}</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading catalog...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Product Catalog */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Catalog
            </CardTitle>
            <CardDescription>
              Search and add products to your quote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by SKU or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-1">
                {['all', 'software', 'maintenance', 'service', 'bundle'].map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCatalog.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No products found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCatalog.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                            {item.sku}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {item.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getProductTypeBadge(item.product_type)}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.base_price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => addToQuote(item)}
                            disabled={quoteItems.some(qi => qi.item.id === item.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quote Builder */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Quote Builder
              </div>
              {quoteItems.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearQuote}>
                  Clear All
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {quoteItems.length} item{quoteItems.length !== 1 ? 's' : ''} in quote
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quoteItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Add products to build your quote</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-3">
                  {quoteItems.map(qi => (
                    <div key={qi.item.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <code className="text-xs bg-muted px-1 rounded font-mono">
                            {qi.item.sku}
                          </code>
                          <p className="font-medium text-sm mt-1">{qi.item.product_name}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => removeFromQuote(qi.item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground">Qty</Label>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateQuantity(qi.item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center">{qi.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateQuantity(qi.item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Seats</Label>
                          <Input 
                            type="number" 
                            min={1}
                            value={qi.seats}
                            onChange={(e) => updateSeats(qi.item.id, parseInt(e.target.value) || 1)}
                            className="h-6 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Discount %</Label>
                          <Input 
                            type="number" 
                            min={0}
                            max={100}
                            value={qi.discount}
                            onChange={(e) => updateItemDiscount(qi.item.id, parseInt(e.target.value) || 0)}
                            className="h-6 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm pt-1 border-t">
                        <span className="text-muted-foreground">Line Total:</span>
                        <span className="font-medium">
                          ${((qi.item.base_price * qi.quantity * qi.seats) * (1 - qi.discount / 100)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {quoteItems.length > 0 && (
              <>
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm">Global Discount %</Label>
                    <Input 
                      type="number" 
                      min={0}
                      max={100}
                      value={globalDiscount}
                      onChange={(e) => setGlobalDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-20 h-8"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${calculations.subtotal.toLocaleString()}</span>
                  </div>
                  {calculations.itemDiscounts > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Item Discounts:</span>
                      <span>-${calculations.itemDiscounts.toLocaleString()}</span>
                    </div>
                  )}
                  {calculations.globalDiscountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Global Discount ({globalDiscount}%):</span>
                      <span>-${calculations.globalDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${calculations.total.toLocaleString()}</span>
                  </div>
                  {calculations.totalDiscounts > 0 && (
                    <div className="text-xs text-green-600 text-right">
                      You save ${calculations.totalDiscounts.toLocaleString()}
                    </div>
                  )}
                </div>

                <Button className="w-full" size="lg">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Quote
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceCalculator;
