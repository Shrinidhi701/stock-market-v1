import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '103.250.152.43',
  user: 'Hankersnest',
  password: 'Complex99##@@',
  database: 'mynewteamsdb',
});

export default db;