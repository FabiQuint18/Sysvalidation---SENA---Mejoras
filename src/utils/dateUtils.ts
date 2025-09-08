
import { ValidationStatus } from '@/types/validation';

export const calculateExpiryDate = (issueDate: string): string => {
  const issue = new Date(issueDate);
  const expiry = new Date(issue);
  expiry.setFullYear(expiry.getFullYear() + 5);
  return expiry.toISOString().split('T')[0];
};

export const getValidationStatus = (expiryDate: string): ValidationStatus => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'vencido';
  } else if (diffDays <= 90) { // 3 meses
    return 'proximo_vencer';
  } else {
    return 'validado';
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
