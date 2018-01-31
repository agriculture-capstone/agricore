import dbConnection, { tableNames, execute } from '../connection';

const R = require('ramda');

const productTransactionsTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTIONS);
const productTransactionsAttributesTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTION_ATTRIBUTES);

/**
 * Represents a product transaction, except for it's typeid
 */
interface ProductTransactionDb {
  producttransactionuuid: string;
  productunits: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amountofproduct: number;
  costperunit: number;
  currency: string;
  lastmodified: string;
}

interface ProductTransactionAttribute {
  producttransactionuuid: string;
  attrname: string;
  attrvalue: string;
}

interface ProductTransaction {
  uuid: string;
  productUnits: string;
  datetime: string;
  toPersonUuid: string;
  fromPersonUuid: string;
  amountOfProduct: number;
  costPerUnit: number;
  currency: string;
  lastModified: string;

  milkQuality?: string
}

const builders = {
  /** Get all product transactions of a certain type */
  getProductTransactions(productname: string) {
    return productTransactionsTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_TRANSACTIONS + '.producttypeid')
    .where({ productname });
  },

  /** get all attributes and their values for a products certain type */
  getProductTransactionsAttributeValues(productname: string) {
    return productTransactionsAttributesTable().select('producttransactionuuid', 'attrname', 'attrvalue')
    .join(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.attrid',
        tableNames.PRODUCT_TRANSACTION_ATTRIBUTES + '.attrid')
    .join(tableNames.PRODUCT_TYPES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.producttypeid',
        tableNames.PRODUCT_TYPES + '.producttypeid')
    .where({ productname });
  },
};

/** Get all product transactions of a certain type */
export async function getProductTransactions(productType: string): Promise<ProductTransaction[]> {
  const transactions = await execute<ProductTransactionDb[]>(builders.getProductTransactions(productType));
  const attrValues = await execute<ProductTransactionAttribute[]>(builders.getProductTransactionsAttributeValues(productType));
  const results : ProductTransaction[] = [];

  transactions.forEach(function (item) {
    const isMatchingUuid = R.propEq('producttransactionuuid', item.producttransactionuuid);

    const isMilkQualityAttr = R.propEq('attrname', 'milkQuality');
    const milkQualityAttr = R.find(R.allPass([isMatchingUuid, isMilkQualityAttr]))(attrValues);

    const transaction : ProductTransaction = {
      uuid: item.producttransactionuuid,
      productUnits: item.productunits,
      datetime: item.datetime,
      toPersonUuid: item.topersonuuid,
      fromPersonUuid: item.frompersonuuid,
      amountOfProduct: item.amountofproduct,
      costPerUnit: item.costperunit,
      currency: item.currency,
      lastModified: item.lastmodified,
    };

    if(milkQualityAttr) {
      transaction.milkQuality = milkQualityAttr.attrvalue;
    }

    results.push(transaction);
  });

  return results;
}
