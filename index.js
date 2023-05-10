const neo4j = require('neo4j-driver');
const readline = require('readline');
const keys = require('./keys');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const driver = neo4j.driver(
  'neo4j+s://1b34606c.databases.neo4j.io:7687',
  neo4j.auth.basic('neo4j', keys.neoPass)
);

rl.question('Please enter a city: ', (city) => {
  rl.question('Please enter a date (YYYY-MM-DD): ', (date) => {
    rl.close();

    const severity = 50; // assuming severity is a predefined constant or variable

    // Check if user-given date is greater than or equal to today's date and severity risk is greater than 40
    if (new Date(date) >= new Date() && severity > 40) {
      let cypherQuery = '';
      switch (city) {
        case 'Mumbai':
          cypherQuery = `
            MATCH (parent)-[r]->(child)
            WHERE parent.name = "Emergency Preparedness Mumbai"
            OPTIONAL MATCH (child)-[r2]->(related)
            RETURN parent, r, child, r2, related
          `;
          break;
        case 'Montreal':
          cypherQuery = `
            MATCH (parent)-[r]->(child)
            WHERE parent.name = "Emergency Preparedness Montreal"
            OPTIONAL MATCH (child)-[r2]->(related)
            RETURN parent, r, child, r2, related
          `;
          break;
        default:
          console.log('Cannot execute query for this city');
          return;
      }

      const session = driver.session();

      session
        .run(cypherQuery)
        .then(result => {
          result.records.forEach(record => {
            console.log(record.get('parent').properties);
            console.log(record.get('child').properties);
            console.log(record.get('r').properties);
            console.log(record.get('related').properties);
            console.log(record.get('r2').properties);
          });
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          session.close();
          driver.close();
        });
    } else {
      console.log('Cannot execute query due to invalid input');
    }
  });
});
