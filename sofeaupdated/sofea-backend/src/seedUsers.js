require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const db = require('./db');

const users = [
  { name: 'Ahmad Faris',  email: 'ahmad.faris@sofea.edu.my',  password: 'password123', role: 'sa_advisor' },
  { name: 'Nurul Ain',    email: 'nurul.ain@sofea.edu.my',    password: 'password123', role: 'sa_advisor' },
  { name: 'Hafiz Rahim',  email: 'hafiz.rahim@sofea.edu.my',  password: 'password123', role: 'high_committee' },
  { name: 'Siti Nabilah', email: 'siti.nabilah@sofea.edu.my', password: 'password123', role: 'high_committee' },
  { name: 'Amirul Hakim', email: 'amirul.hakim@sofea.edu.my', password: 'password123', role: 'high_committee' },
];

async function seed() {
  console.log('Seeding users...\n');

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    try {
      await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [user.name, user.email, hash, user.role]
      );
      console.log(`  INSERTED  [${user.role}]  ${user.email}`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        await db.query(
          'UPDATE users SET password_hash = ?, name = ?, role = ? WHERE email = ?',
          [hash, user.name, user.role, user.email]
        );
        console.log(`  UPDATED   [${user.role}]  ${user.email}`);
      } else {
        throw err;
      }
    }
  }

  console.log('\nDone. Login with password: password123');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
