import { hasPermission } from '@/database/permissions';

export async function checkCategoryPermissions(userCategoryName: string, targetCategoryName: string, actionType: string) {
  // Check database table 
  return hasPermission(userCategoryName, targetCategoryName, actionType);
}
