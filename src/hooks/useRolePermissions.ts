import { useMemo } from 'react';

export type AppRole = 'admin' | 'user' | 'moderator' | 'var' | 'customer_rep' | 'customer' | 'account_rep' | 'marketing' | 'free' | 'program_manager' | 'support';

export interface RolePermissions {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageLicenses: boolean;
  canManageCredits: boolean;
  canManageDownloads: boolean;
  canManageCatalog: boolean;
  canViewSupport: boolean;
  canViewDownloads: boolean;
  canViewLicensing: boolean;
  canViewCredits: boolean;
  canManageCustomers: boolean;
  canViewReports: boolean;
  canViewMarketing: boolean;
  canManageFeatureRequests: boolean;
}

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
  support: {
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
    canManageCustomers: true,
    canViewReports: false,
    canViewMarketing: false,
    canManageFeatureRequests: false,
  },
};

export const useRolePermissions = (roles: AppRole[]): RolePermissions => {
  return useMemo(() => {
    // Merge permissions from all roles (highest privilege wins)
    const basePermissions: RolePermissions = {
      canAccessAdmin: false,
      canManageUsers: false,
      canManageLicenses: false,
      canManageCredits: false,
      canManageDownloads: false,
      canManageCatalog: false,
      canViewSupport: false,
      canViewDownloads: false,
      canViewLicensing: false,
      canViewCredits: false,
      canManageCustomers: false,
      canViewReports: false,
      canViewMarketing: false,
      canManageFeatureRequests: false,
    };

    roles.forEach((role) => {
      const rolePerms = rolePermissionsMap[role];
      if (rolePerms) {
        Object.keys(rolePerms).forEach((key) => {
          const permKey = key as keyof RolePermissions;
          if (rolePerms[permKey]) {
            basePermissions[permKey] = true;
          }
        });
      }
    });

    return basePermissions;
  }, [roles]);
};

export const getRoleLabel = (role: AppRole): string => {
  const labels: Record<AppRole, string> = {
    admin: 'Admin',
    program_manager: 'Program Manager',
    support: 'Support',
    account_rep: 'Account Rep',
    marketing: 'Marketing',
    var: 'VAR',
    customer_rep: 'Customer Rep',
    customer: 'Customer',
    user: 'User',
    moderator: 'Moderator',
    free: 'Free',
  };
  return labels[role] || role;
};

export const getAllRoles = (): AppRole[] => {
  return ['admin', 'program_manager', 'support', 'account_rep', 'marketing', 'var', 'customer_rep', 'customer', 'user', 'moderator', 'free'];
};
