import dbConnection, { tableNames, execute } from '../connection';

const peopleCategoryPermissionsTable = () => dbConnection()(tableNames.PEOPLE_CATEGORY_PERMISSIONS);
const peopleCategories = () => dbConnection()(tableNames.PEOPLE_CATEGORIES);

const builders = {
  /**
   * Gets the people category ID given the people category name
   * @param name of the people category
   */
  getCategoryId(categoryName: string) {
    return peopleCategories().select('peoplecategoryid')
      .where('peoplecategoryname', categoryName);
  },
  getPermissions(usercategoryid: number, targetcategoryid: number, action: string) {
    return peopleCategoryPermissionsTable()
      .select('*')
      .where({ usercategoryid, targetcategoryid, action });
  },
};  

export async function hasPermission(
  userCategoryName: string, 
  targetCategoryName: string,
  actionType: string): Promise<boolean> {
  const userCategoryId = await execute<any>(builders.getCategoryId(userCategoryName));
  const targetCategoryId = await execute<any>(builders.getCategoryId(targetCategoryName));
  
  const permissions = await execute<any>(
    builders.getPermissions(userCategoryId, targetCategoryId, actionType));

  if (permissions.length === 0) {
    return false;
  }
  return true;
}
