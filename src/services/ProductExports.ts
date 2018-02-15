import * as api from '@/routers/productExports';
import * as db from '@/database/ProductExports';
import logger from '@/utilities/modules/logger';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get all product exports
 */
export async function getProdExportsFromDb(): Promise<api.ProdExport[]> {
  const dbProdExports: db.ProdExportDb[] = await db.getProdExports();
  const results: api.ProdExport[] = [];

  logger.info('results', results);

  dbProdExports.forEach(function (item: db.ProdExportDb) {
    const newExport: api.ProdExport = {
      uuid: item.productexportuuid,
      transportId: item.transportid,
      datetime: item.datetime,
      productType: item.productname,
      amountOfProduct: item.amountofproduct,
    };

    results.push(newExport);
  });

  return results;
}

