import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins, Package, Clock, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { useUserCredits, CreditPackageOption } from "@/hooks/useUserCredits";
import { useCatalog } from "@/hooks/useCatalog";
import { format } from "date-fns";

const Credits = () => {
  const { purchases, loading, totalCredits, requestPurchase } = useUserCredits();
  const { catalog } = useCatalog();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackageOption | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Get credit-based products from catalog
  const creditProducts = catalog.filter(
    item => item.is_active && (item.credits_included > 0 || (item.credit_packages && item.credit_packages.length > 0))
  );

  // Flatten all credit packages from all products
  const allPackages: CreditPackageOption[] = creditProducts.flatMap(product =>
    (product.credit_packages || []).map(pkg => ({
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      catalogId: product.id,
      productName: product.product_name
    }))
  );

  const handlePurchaseClick = (pkg: CreditPackageOption) => {
    setSelectedPackage(pkg);
    setConfirmOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    
    setSubmitting(true);
    await requestPurchase(
      selectedPackage.catalogId,
      `${selectedPackage.productName} - ${selectedPackage.name}`,
      selectedPackage.credits,
      selectedPackage.price
    );
    setSubmitting(false);
    setConfirmOpen(false);
    setSelectedPackage(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Processing Credits</h1>
          <p className="text-muted-foreground">Purchase and manage your processing unit credits</p>
        </div>

        {/* Credits Summary Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Credits</p>
                  <p className="text-4xl font-bold">{totalCredits.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-semibold">{purchases.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Credit Packages
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Purchase History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            {allPackages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Credit Packages Available</h3>
                  <p className="text-muted-foreground">Contact your administrator to set up credit packages.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {allPackages.map((pkg, index) => (
                  <Card key={`${pkg.catalogId}-${index}`} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{pkg.productName}</Badge>
                        {index === 1 && <Badge className="bg-primary">Popular</Badge>}
                      </div>
                      <CardTitle className="text-xl mt-2">{pkg.name}</CardTitle>
                      <CardDescription>
                        {pkg.credits.toLocaleString()} processing units
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">${pkg.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">/ package</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        ${(pkg.price / pkg.credits).toFixed(4)} per credit
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handlePurchaseClick(pkg)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>View all your credit purchase requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : purchases.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No purchases yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map(purchase => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.package_name || 'N/A'}</TableCell>
                          <TableCell>{purchase.credits_purchased.toLocaleString()}</TableCell>
                          <TableCell>${purchase.price_paid.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                          <TableCell>
                            {purchase.status === 'approved' || purchase.status === 'completed' 
                              ? purchase.credits_remaining.toLocaleString() 
                              : '-'}
                          </TableCell>
                          <TableCell>{format(new Date(purchase.created_at), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase Request</DialogTitle>
              <DialogDescription>
                Submit a request to purchase credits. An administrator will review and approve your request.
              </DialogDescription>
            </DialogHeader>
            {selectedPackage && (
              <div className="py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{selectedPackage.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits</span>
                  <span className="font-medium">{selectedPackage.credits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Total Price</span>
                  <span className="text-lg font-bold">${selectedPackage.price.toFixed(2)}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmPurchase} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Credits;
