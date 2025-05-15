/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const { Core } = require('@adobe/aio-sdk')
const { errorResponse } = require('../utils')
// const defaultAccounts = require('./accounts.json');
// const filesLib = require('@adobe/aio-lib-files');
const Busboy = require('busboy');
const { neon } = require("@neondatabase/serverless");
const { format } = require("date-fns");

async function parseMultipartFormData(headers, requestBody) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: headers });
    const result = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      let fileData = [];
      file.on('data', (data) => {
        fileData.push(data);
      });
      file.on('end', () => {
        result[fieldname] = {
          filename: filename,
          encoding: encoding,
          mimetype: mimetype,
          data: Buffer.concat(fileData).toString('base64') // or any other encoding you need
        };
      });
    });

    busboy.on('field', (fieldname, val) => {
      result[fieldname] = val;
    });

    busboy.on('finish', () => {
      resolve({ result });
    });
    // Write the request body to busboy
    busboy.end(requestBody);
  });
}

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  console.log(params)
  console.log('BODY: ' + params['__ow_body'])

  if(params['__ow_headers']['content-type'].includes('multipart')) {
    const formData64 = Buffer.from(params['__ow_body'], 'base64')
    const formDataDecoded = formData64.toString('utf-8');
    logger.info(formDataDecoded);
    const { result } = await parseMultipartFormData(params['__ow_headers'], formDataDecoded);

    const data = JSON.parse(result['jcr:data']);
    for (const key in data) {
      params[key] = data[key]
    }
  }


  try {
    const sql = neon(params.DATABASE_URL);
    const [user] = await sql`SELECT * FROM ACCOUNT_HOLDER WHERE identifier = ${params.identifier}`;

    if(user) {
      throw new Error('User already exists');
    } else {
      const result = await sql`INSERT INTO ACCOUNT_HOLDER (firstname, lastname, password, identifier) VALUES (${params.firstName}, ${params.lastName}, ${params.password}, ${params.identifier})`;
      const [user] = await sql`SELECT * FROM ACCOUNT_HOLDER WHERE identifier = ${params.identifier}`;
      await sql`INSERT INTO ACCOUNT (user_id, product_id, date_created, amount_owed, amount_available) VALUES (${user.user_id}, 1, ${format(new Date(), "yyyy-MM-dd")}, 0, 1920.00)`;
      logger.debug(JSON.stringify(result));
    }
    const response = {
      statusCode: 200,
      body: {
       message: `User ${params.identifier} successfully created`
      }
    };

    // const response = {
    //   statusCode: 200,
    //   body: {
    //     message: result.length > 0 ? "true" : "false"
    //   }
    // }
    // log the response status code
    logger.info(`${response.statusCode}: successful request`);
    return response;
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, error.message, logger)
  }
}

exports.main = main
