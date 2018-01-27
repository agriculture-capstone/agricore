import dbConnection, { tableNames, execute } from '../connection';
import logger from '@/utilities/modules/logger';

const productTypesTable = () => dbConnection()(tableNames.PRODUCT_TYPES);
const productTypesAttributesTable = () => dbConnection()(tableNames.PRODUCT_ATTRIBUTE_TYPES);

interface ProductTypeDb {
  producttypeid: number;
  productname: string;
  productunits: string;
}

interface ProductAttributeDb {
  producttypeid: number;
  attrid: number;
  attrname: string;
}

interface ProductType {
  name: string;
  unit: string;
  attributes: ProductAttribute[];
}

type ProductAttribute = string;


const builders = {
  getProductTypes() {
    return productTypesTable()
      .select('*');
  },
  getProductAttributes() {
    return productTypesAttributesTable().select('*');
  },
};

function formatProductTypes(types: ProductTypeDb[], attributes: ProductAttributeDb[]): ProductType[] {
  return types.map((type) => {
    const relatedAttributes = attributes
      .filter((attribute) => {
        return type.producttypeid === attribute.producttypeid;
      })
      .map((attribute) => {
        return attribute.attrname;
      });

    return {
      name: type.productname,
      unit: type.productunits,
      attributes: relatedAttributes,
    };
  });
}
export async function getProductTypes() {
  const types = await execute<ProductTypeDb[]>(builders.getProductTypes());
  const attributes = await execute<ProductAttributeDb[]>(builders.getProductAttributes());
  const response = formatProductTypes(types, attributes);
  return response;
}
