const neo4j = require('neo4j-driver')
const keys = require('./keys')


// async function getData() {
    const driver = neo4j.driver(
        'neo4j+s://1b34606c.databases.neo4j.io',
        neo4j.auth.basic('neo4j', keys.neoPass)
    );

    // const verify = await driver.verifyConnectivity()
    // console.log(verify)
    // //
    // const session = driver.session();
    // const result = await session.run(' MATCH (n) RETURN n ');
    // const weatherEvents = result.records.map(record => record.get('n').properties);
    // console.log(result.records)

    // Define the Cypher query to fetch data
const cypherQuery = 'MATCH (n) RETURN n'

// Create a new session and run the query
const session = driver.session()
session
  .run(cypherQuery)
  .then(result => {
    result.records.forEach(record => {
      console.log(record.get('n').properties)
    })
  })
  .catch(error => {
    console.error(error)
  })
  .finally(() => {
    session.close()
    driver.close()
  })








{/* }
getData() */}