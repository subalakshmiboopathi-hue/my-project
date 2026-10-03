import pg from 'pg';
const { Client } = pg;

const passwords = [
  'postgres', 'admin', 'root', 'password', '1234', '123456', '12345678', '123456789', '12345',
  'bathi', 'Bathina', 'bathina', 'Bathi', 'Bathi@123', 'Bathina@123', 'admin123', 'admin@123',
  'root123', 'root@123', 'postgres123', 'postgres@123', 'Password123', 'Password@123',
  'Pass@123', 'P@ssword123', 'P@ssw0rd', '1111', '0000', 'system', 'manager', 'test',
  'dos', 'dosclub', 'dos123', 'dosclub123', 'smartloss', 'canteen', 'workshop', ''
];

const users = ['postgres', 'bathi', 'Bathina'];

async function testAll() {
  for (const user of users) {
    for (const pwd of passwords) {
      const client = new Client({
        host: 'localhost',
        port: 5432,
        user: user,
        password: pwd,
        database: 'postgres',
        connectionTimeoutMillis: 1000
      });

      try {
        await client.connect();
        console.log(`FOUND_CREDENTIALS: USER=${user} PASSWORD=${pwd}`);
        await client.end();
        return { user, pwd };
      } catch (err) {
        // next
      }
    }
  }
  console.log('NO_MATCH_FOUND');
}

testAll();
