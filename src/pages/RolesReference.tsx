import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Key, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getAllRoles, getRoleLabel, AppRole, RolePermissions } from '@/hooks/useRolePermissions';

const rolePermissionsMap: Record<AppRole, RolePermissions> = {
  admin: {
    canAccessAdmin: true,
    canManageUsers: true,
    canManageLicenses: true,
    canManageCredits: true,
    canManageDownloads: true,
    canManageCatalog: true,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: true,
    canViewReports: true,
    canViewMarketing: true,
    canManageFeatureRequests: true,
  },
  program_manager: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageLicenses: false,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: false,
    canViewReports: true,
    canViewMarketing: false,
    canManageFeatureRequests: true,
  },
  account_rep: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageLicenses: true,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: true,
    canViewReports: true,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
  marketing: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageLicenses: false,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: false,
    canViewCredits: false,
    canManageCustomers: true,
    canViewReports: true,
    canViewMarketing: true,
    canManageFeatureRequests: false,
  },
  var: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageLicenses: true,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: true,
    canViewReports: true,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
  customer_rep: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageLicenses: true,
    canManageCredits: true,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: true,
    canViewReports: false,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
  customer: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageLicenses: false,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: false,
    canViewReports: false,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
  user: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageLicenses: false,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: false,
    canViewReports: false,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
  moderator: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageLicenses: false,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: true,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: true,
    canManageCustomers: false,
    canViewReports: false,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
  free: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageLicenses: false,
    canManageCredits: false,
    canManageDownloads: false,
    canManageCatalog: false,
    canViewSupport: false,
    canViewDownloads: true,
    canViewLicensing: true,
    canViewCredits: false,
    canManageCustomers: false,
    canViewReports: false,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
};

const permissionLabels: Record<keyof RolePermissions, string> = {
  canAccessAdmin: 'Access Admin Panel',
  canManageUsers: 'Manage Users',
  canManageLicenses: 'Manage Licenses',
  canManageCredits: 'Manage Credits',
  canManageDownloads: 'Manage Downloads',
  canManageCatalog: 'Manage Catalog',
  canViewSupport: 'View Support',
  canViewDownloads: 'View Downloads',
  canViewLicensing: 'View Licensing',
  canViewCredits: 'View Credits',
  canManageCustomers: 'Manage Customers',
  canViewReports: 'View Reports',
  canViewMarketing: 'View Marketing',
  canManageFeatureRequests: 'Manage Feature Requests',
};

const roleDescriptions: Record<AppRole, string> = {
  admin: 'Full system access with all permissions. Can manage users, settings, and all features.',
  program_manager: 'Oversees programs and feature requests. Has access to reports and admin panel.',
  account_rep: 'Manages customer accounts and licenses. Can view reports and manage CRM.',
  marketing: 'Access to marketing tools, CRM, and reports. Cannot manage licenses or credits.',
  var: 'Value Added Reseller with license and customer management capabilities.',
  customer_rep: 'Customer support role with license and credit management access.',
  customer: 'Standard customer with access to their own licenses, downloads, and support.',
  user: 'Basic authenticated user with limited access to downloads and support.',
  moderator: 'Content moderation role with admin panel access but limited management.',
  free: 'Free tier user with access only to downloads and licensing information.',
};

const helperFunctions = [
  {
    name: 'useRolePermissions',
    description: 'Hook that returns merged permissions for an array of roles',
    usage: 'const permissions = useRolePermissions(userRoles);',
    file: 'src/hooks/useRolePermissions.ts',
  },
  {
    name: 'getRoleLabel',
    description: 'Returns a human-readable label for a role',
    usage: 'getRoleLabel("program_manager") // "Program Manager"',
    file: 'src/hooks/useRolePermissions.ts',
  },
  {
    name: 'getAllRoles',
    description: 'Returns an array of all available roles',
    usage: 'const roles = getAllRoles();',
    file: 'src/hooks/useRolePermissions.ts',
  },
  {
    name: 'has_role',
    description: 'Database function to check if a user has a specific role',
    usage: 'SELECT has_role(user_id, \'admin\')',
    file: 'Supabase Function',
  },
  {
    name: 'is_admin',
    description: 'Database function to check if current user is admin',
    usage: 'SELECT is_admin()',
    file: 'Supabase Function',
  },
  {
    name: 'get_my_roles',
    description: 'Database function to get all roles for current user',
    usage: 'SELECT get_my_roles()',
    file: 'Supabase Function',
  },
];

const RolesReference: React.FC = () => {
  const allRoles = getAllRoles();
  const permissionKeys = Object.keys(permissionLabels) as (keyof RolePermissions)[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png"
              alt="TopHat Security Logo"
              className="h-10 mr-2"
            />
            <span className="text-xl font-bold whitespace-nowrap">
              <span className="text-foreground">TOPHAT</span>
              <span className="text-[#cc0c1a]">|SECURITY</span>
            </span>
          </Link>
        </div>
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Website
          </Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Roles & Permissions Reference
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete reference for all system roles, permissions, and helper functions.
          </p>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="helpers">Helpers</TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {allRoles.map((role) => (
                <Card key={role}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      {getRoleLabel(role)}
                      <Badge variant="outline" className="ml-auto">
                        {role}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{roleDescriptions[role]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {permissionKeys.map((perm) => (
                        rolePermissionsMap[role][perm] && (
                          <Badge key={perm} variant="secondary" className="text-xs">
                            {permissionLabels[perm]}
                          </Badge>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permission Matrix Tab */}
          <TabsContent value="matrix">
            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
                <CardDescription>
                  Overview of which roles have which permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-card">Permission</TableHead>
                      {allRoles.map((role) => (
                        <TableHead key={role} className="text-center min-w-[100px]">
                          {getRoleLabel(role)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionKeys.map((perm) => (
                      <TableRow key={perm}>
                        <TableCell className="font-medium sticky left-0 bg-card">
                          {permissionLabels[perm]}
                        </TableCell>
                        {allRoles.map((role) => (
                          <TableCell key={role} className="text-center">
                            {rolePermissionsMap[role][perm] ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Functions Tab */}
          <TabsContent value="functions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Database Functions
                </CardTitle>
                <CardDescription>
                  Supabase database functions for role-based access control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">has_role(user_id, role)</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Security definer function that checks if a user has a specific role.
                      Used in RLS policies to prevent recursive queries.
                    </p>
                    <pre className="bg-muted p-3 rounded mt-3 text-sm overflow-x-auto">
{`CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;`}
                    </pre>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">is_admin()</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Convenience function to check if current authenticated user is an admin.
                    </p>
                    <pre className="bg-muted p-3 rounded mt-3 text-sm overflow-x-auto">
{`CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT has_role(auth.uid(), 'admin')
$$ LANGUAGE sql STABLE;`}
                    </pre>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">get_my_roles()</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      Returns all roles assigned to the current authenticated user.
                    </p>
                    <pre className="bg-muted p-3 rounded mt-3 text-sm overflow-x-auto">
{`CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS app_role[] AS $$
  SELECT ARRAY_AGG(role) FROM public.user_roles
  WHERE user_id = auth.uid()
$$ LANGUAGE sql STABLE;`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Helper Functions Tab */}
          <TabsContent value="helpers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>TypeScript Helper Functions</CardTitle>
                <CardDescription>
                  Frontend utilities for working with roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Function</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {helperFunctions.map((fn) => (
                      <TableRow key={fn.name}>
                        <TableCell className="font-mono font-semibold">
                          {fn.name}
                        </TableCell>
                        <TableCell>{fn.description}</TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {fn.usage}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {fn.file}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Guards</CardTitle>
                <CardDescription>
                  Components for protecting routes based on authentication and roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">ProtectedRoute</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Requires user to be authenticated and approved.
                  </p>
                  <code className="block bg-muted p-2 rounded mt-2 text-sm">
                    src/components/auth/ProtectedRoute.tsx
                  </code>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">AdminRoute</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Requires user to have the 'admin' role.
                  </p>
                  <code className="block bg-muted p-2 rounded mt-2 text-sm">
                    src/components/auth/AdminRoute.tsx
                  </code>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold">ProgramManagerRoute</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Requires user to have 'admin' or 'program_manager' role.
                  </p>
                  <code className="block bg-muted p-2 rounded mt-2 text-sm">
                    src/components/auth/ProgramManagerRoute.tsx
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RolesReference;
