import createRouter from '@/utilities/functions/createRouter';
import * as ProdExportsService from '@/services/ProductExports';

import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/** Represents a product export in the API */
export interface ProdExport {
  uuid: string;
  recorderUuid: string;
  transportId: string;
  datetime: string;
  productType: string;
  amountOfProduct: number;
  productUnits: string;
  lastModified: string;
}

/**
 * Represents a product export creation request in the API
 */
export interface ProdExportCreationReq {
  uuid: string;
  recorderUuid: string;
  transportId: string;
  datetime: string;
  productType: string;
  amountOfProduct: number;
}

/**
 * Represents a product exoprt udpate request in the API
 */
export interface ProdExportUpdateReq {
  uuid: string;
  transportId?: string;
  amountOfProduct?: number;
}

/**
 * @api {get} /productexports Get all product exports
 * @apiName GetProductExports
 * @apiGroup ProductExports
 * @apiVersion  0.0.1
 * @apiDescription Returns all product exports of all types.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all people from category <category>
 * @apiSuccessExample /productexports Success-Response:
  [
    {
      "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
      "recorderUuid": "a293e3a5-a88d-473b-9d4a-74a2153992f6",
      "transportId": "A3C-X23"
      "datetime": "2018-01-23 04:05:06.000Z",
      "lastModified": "2018-01-23 04:06:06.000Z",
      "productType": "milk",
      "amountOfProduct": 10.23,
      "productUnits": litres
    },
    {
      "uuid": "3321269e-9b8b-432f-a668-b65c206235b0",
      "recorderUuid": "a293e3a5-a88d-473b-9d4a-74a2153992f6",
      "transportId": "A3C-X23",
      "datetime": "2018-01-23 04:05:20",
      "lastModified": "2018-01-23 04:06:21",
      "productType": "corn",
      "amountOfProduct": 5.2,
      "productUnits": litres
    }
  ]
 */
router.get('/', async (req, res) => {
  const result = await ProdExportsService.getProdExportsFromDb();
  res.status(StatusCode.OK).send(result);
}, authorized(UserType.ADMIN, UserType.MONITOR, UserType.TRADER));

/**
 * @api {post} /productexports
 * @apiName CreateProductExport
 * @apiGroup ProductExports
 * @apiVersion 0.0.1
 * @apiDescription Creates a new product export entry.
 *              The new product export UUID is returned on success.
 *
 * @apiParam {String} uuid The UUID of the new product export.
 * @apiParam {String} recorderUuid The UUID of the person who recorded the export.
 * @apiParam {String} transportId Identifier for mode of transport, max 255 characters.
 * @apiParam {String} datetime The time the export occured.
 * @apiParam {String} productType The type of product.
 * @apiParam {Number} amountOfProduct The amount of the product in it's given units.
 *                    The product's units can be checked via /product
 *
 * @apiError (400) BadRequest Missing or invalid fields, ...
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (201) {String} Success Successfully created new product export entry
 * @apiSuccessExample Success-Response:
   {
     "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
   }
 */
router.post('/', async (req, res) => {
  const createReq: ProdExportCreationReq = {
    uuid: req.body.uuid,
    recorderUuid: req.body.recorderUuid,
    transportId: req.body.transportId,
    datetime: req.body.datetime,
    productType: req.body.productType,
    amountOfProduct: req.body.amountOfProduct,
  };

  try {
    const uuid = await ProdExportsService.createProdExportInDb(createReq);
    res.status(StatusCode.CREATED).send({ uuid });
  } catch (e) {
    if (e.message === ProdExportsService.unhandledErrorMsg) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
    } else {
      res.status(StatusCode.BAD_REQUEST).send('BadRequest ' + e.message);
    }
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

/**
 * @api {put} /productexports/:uuid
 * @apiName UpdateProductExport
 * @apiGroup ProductExports
 * @apiVersion 0.0.1
 * @apiDescription Updates a product export entry.
 *              Any fields not given will not be updated.
 *              Extra non existent fields will not be ignored.
 *              Returns the product export's actual data on error or success.
 *
 * @apiParam {String} uuid Specify the UUID of the product export to update.
 * @apiParam [String] transportId Identifier for mode of transport, max 255 characters.
 * @apiParam [Number] amountOfProduct The amount of the product in it's given units.
 *                    The product's units can be checked via /product
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Product export not found
 *
 * @apiSuccess (200) {String} Successfully updated product export entry
  {
    "uuid": "3321269e-9b8b-432f-a668-b65c206235b0",
    "recorderUuid": "a293e3a5-a88d-473b-9d4a-74a2153992f6",
    "transportId": "A3C-X23",
    "datetime": "2018-01-23 04:05:20",
    "lastModified": "2018-01-23 04:06:21",
    "productType": "corn",
    "amountOfProduct": 5.2,
    "productUnits": litres
  }
*/
router.put('/:uuid', async (req, res) => {
  const updateReq: ProdExportUpdateReq = {
    uuid: req.params.uuid,

    transportId: req.body.transportId,
    amountOfProduct: req.body.amountOfProduct,
  };

  try {
    await ProdExportsService.updateProdExportInDb(updateReq);
    const result = await ProdExportsService.getProdExportFromDb(req.params.uuid);
    res.status(StatusCode.OK).send(result);
  } catch (e) {
    const result = await ProdExportsService.getProdExportFromDb(req.params.uuid);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send(result);
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

export default router;
