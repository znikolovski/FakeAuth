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
const filesLib = require('@adobe/aio-lib-files');
const { neon } = require("@neondatabase/serverless");

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  const dataSql = `
    CREATE TABLE USER (
      user_id INTEGER PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      password TEXT NOT NULL,
      identifier TEXT NOT NULL
    );
    CREATE TABLE PRODUCT_TYPE (
      product_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE ACCOUNT (
      account_id INTEGER PRIMARY KEY,
      user_id INTEGER,
      product_id INTEGER,
      date_created TEXT NOT NULL,
      amount_owed REAL NOT NULL,
      amount_available REAL NOT NULL,
      FOREIGN KEY(user_id) REFERENCES USER(user_id),
      FOREIGN KEY(product_id) REFERENCES PRODUCT(product_id)
    );
    CREATE TABLE ACTIVITY (
      activity_id INTEGER PRIMARY KEY,
      account_id INTEGER,
      amount REAL NOT NULL,
      activity_date TEXT NOT NULL,
      FOREIGN KEY(account_id) REFERENCES ACCOUNT(account_id)
    );
    INSERT INTO USER VALUES (0001, 'Zoran', 'Nikolovski', 'Adobe123', 'nikolovs@adobe.com');
    INSERT INTO PRODUCT_TYPE VALUES (0001, 'Savings Account', 'A SecurBank savings account');
    INSERT INTO ACCOUNT VALUES (0001, 0001, 0001, '2024-03-07', 0, 1920.00);
    INSERT INTO ACTIVITY VALUES (0001, 0001, 236.77, '2025-01-23');
  `;

  console.log(params)

  const files = await filesLib.init()

  try {
    // const db = new sqlite3.Database('./securbank.db');
    const dataArr = dataSql.toString().split(');');
    const sql = neon(params.DATABASE_URL);

    // db.serialize(() => {
    //   // db.run runs your SQL query against the DB
    //   db.run('PRAGMA foreign_keys=OFF;');
    //   db.run('BEGIN TRANSACTION;');
    //   // Loop through the `dataArr` and db.run each query
    //   dataArr.forEach((query) => {
    //     if(query) {
    //       // Add the delimiter back to each query before you run them
    //       // In my case the it was `);`
    //       query += ');';
    //       db.run(query, (err) => {
    //         if(err) throw err;
    //       });
    //     }
    //   });
    //   db.run('COMMIT;');
    // });

    // db.close((err) => {
    //   if (err) {
    //     return console.error(err.message);
    //   }
    //   console.log('Closed the database connection.');
    // });

    // const rdStream = fs.createReadStream('securbank.db');
    // await files.write('db/securbank.db', rdStream);
    // fs.unlinkSync('securbank.db');

    const result = await sql`SELECT version()`;
    const { version } = result[0];
    const response = {
      statusCode: 200,
      body: {
       message: `${version}`
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
