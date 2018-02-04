import { hasPermission } from '@/database/permissions';

/**
 * Checks the category permissions for users from the database
 * @param userCategoryName name of user category
 * @param targetCategoryName name of target user category
 * @param actionType type of action to check for
 */
export async function checkCategoryPermissions(userCategoryName: string, targetCategoryName: string, actionType: string) {
  // Check database table for permissions
  return hasPermission(userCategoryName, targetCategoryName, actionType);
}
