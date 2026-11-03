const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.resolve(__dirname, '..', 'server', 'data', 'folio.sqlite');
if (!fs.existsSync(dbPath)) {
  console.error(`SQLite file not found at ${dbPath}`);
  process.exit(1);
}

const sqlite = new DatabaseSync(dbPath);
const outSqlPath = path.resolve(__dirname, '..', 'server', 'data', 'migrate_to_postgres.sql');

// Type mapping from SQLite to PostgreSQL
function pgType(type) {
  const t = (type || 'TEXT').toUpperCase();
  if (t.includes('INT')) return 'BIGINT';
  if (t.includes('REAL') || t.includes('FLOAT') || t.includes('DOUBLE')) return 'DOUBLE PRECISION';
  return 'TEXT';
}

function escapeLiteral(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') {
    if (isNaN(val)) return 'NULL';
    return String(val);
  }
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

console.log('1. Analyzing SQLite Schema & Extracting Data...');
const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

let sql = `-- Auto-generated migration from SQLite to PostgreSQL\n`;
sql += `-- Generated at: ${new Date().toISOString()}\n\n`;
sql += `BEGIN;\n`;
sql += `SET session_replication_role = replica;\n\n`;

const counts = {};

for (const t of tables) {
  const tableName = t.name;
  const colInfo = sqlite.prepare(`PRAGMA table_info("${tableName}")`).all();
  
  // Create table statement
  const pks = colInfo.filter(c => c.pk > 0).sort((a, b) => a.pk - b.pk).map(c => `"${c.name}"`);
  const colDefs = colInfo.map(c => {
    let def = `"${c.name}" ${pgType(c.type)}`;
    if (c.notnull && pks.length <= 1 && c.pk === 1) def += ' NOT NULL';
    return def;
  });

  if (pks.length > 0) {
    colDefs.push(`PRIMARY KEY (${pks.join(', ')})`);
  }

  sql += `-- Table: ${tableName}\n`;
  sql += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n  ${colDefs.join(',\n  ')}\n);\n`;
  sql += `TRUNCATE TABLE "${tableName}" CASCADE;\n\n`;

  // Fetch rows
  const rows = sqlite.prepare(`SELECT * FROM "${tableName}"`).all();
  counts[tableName] = rows.length;

  if (rows.length > 0) {
    const colNames = colInfo.map(c => `"${c.name}"`).join(', ');
    sql += `INSERT INTO "${tableName}" (${colNames}) VALUES\n`;
    
    const rowValues = rows.map(r => {
      const vals = colInfo.map(c => escapeLiteral(r[c.name]));
      return `  (${vals.join(', ')})`;
    });

    sql += rowValues.join(',\n') + ';\n\n';
  }
}

sql += `SET session_replication_role = DEFAULT;\n`;
sql += `COMMIT;\n`;

fs.writeFileSync(outSqlPath, sql, 'utf8');
console.log(`2. Exported SQL migration dump (${(fs.statSync(outSqlPath).size / 1024).toFixed(1)} KB) to ${outSqlPath}`);

console.log('3. Applying migration to PostgreSQL container (understory-postgres)...');
try {
  // Use WSL docker exec with stdin
  execSync(`wsl bash -c "docker exec -i understory-postgres psql -U understory_user -d understory_db < /mnt/e/Ebook/server/data/migrate_to_postgres.sql"`, {
    stdio: 'inherit'
  });
  console.log('✓ Successfully executed SQL dump in understory-postgres!');
} catch (err) {
  console.error('Failed to execute migration in PostgreSQL container:', err.message);
  process.exit(1);
}

console.log('\n4. Verifying record counts between SQLite and PostgreSQL:');
console.log('----------------------------------------------------------------------');
console.log('TABLE NAME                     SQLITE COUNT    POSTGRES COUNT   STATUS');
console.log('----------------------------------------------------------------------');

let allPassed = true;
for (const t of tables) {
  const tableName = t.name;
  const expected = counts[tableName];
  try {
    const pgCountRaw = execSync(
      `wsl bash -c "docker exec understory-postgres psql -U understory_user -d understory_db -t -c 'SELECT COUNT(*) FROM \\\"${tableName}\\\";'"`,
      { encoding: 'utf8' }
    ).trim();
    const actual = parseInt(pgCountRaw, 10);
    const match = expected === actual;
    if (!match) allPassed = false;
    console.log(
      tableName.padEnd(30),
      String(expected).padEnd(15),
      String(actual).padEnd(16),
      match ? '✓ MATCH' : '✗ MISMATCH'
    );
  } catch (e) {
    console.log(tableName.padEnd(30), String(expected).padEnd(15), 'ERROR'.padEnd(16), '✗ ERROR');
    allPassed = false;
  }
}

console.log('----------------------------------------------------------------------');
if (allPassed) {
  console.log('✓ ALL TABLES AND RECORDS MIGRATED AND VERIFIED SUCCESSFULLY!');
} else {
  console.error('✗ Some tables failed verification.');
  process.exit(1);
}
