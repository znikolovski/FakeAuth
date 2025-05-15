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
const jwt = require('jsonwebtoken');
// const accounts = require('./accounts.json');
// const roles = ['admin'];
const secret = 'super-duper-secret';
// const filesLib = require('@adobe/aio-lib-files');
const { neon } = require("@neondatabase/serverless");

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // const files = await filesLib.init()
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  // const buffer = await files.read('db/accounts.json');
  // const accountsStr = buffer.toString();
  // const accounts = JSON.parse(accountsStr);
  const sql = neon(params.DATABASE_URL);

  try {
    const [user] = await sql`SELECT * FROM ACCOUNT_HOLDER WHERE identifier = ${params.identifier}`;
    if(params.password == user.password) {
      let payload = {};
      payload.user = params.identifier;
      const token = jwt.sign(payload, secret);
      const response = {
        statusCode: 200,
        body: {
          token: token,
          firstName: user.firstname,
          lastName: user.lastname
        }
      };
  
      // log the response status code
      logger.info(`${response.statusCode}: successful request`);
      return response;
    }
    // for (let i = 0; i < accounts.length; i++) {
    //   const account = accounts[i];
    //   if (account.identifier == params.identifier) {
    //     if (account.password == params.password) {
    //       let payload = {};
    //       payload.user = params.identifier;
    //       for (let j = 0; j < roles.length; j++) {
    //         const role = roles[j];
    //         payload[role] = account.roles.includes(role);
    //       }
    //       const token = jwt.sign(payload, secret);
    //       const response = {
    //         statusCode: 200,
    //         body: {
    //           token: token,
    //           firstName: account.firstName,
    //           lastName: account.lastName
    //         }
    //       };
      
    //       // log the response status code
    //       logger.info(`${response.statusCode}: successful request`);
    //       return response;
    //     } else {
    //       throw new Error('Authentication failed.');
    //     }
    //   }
    // }
    throw new Error('Authentication failed.');
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(401, 'Authentication failed', logger)
  }
}

exports.main = main
