
export const findOrCreateTable = (db, tableName) => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
  const data = db.query(sql).all()
  const table = data[0]
  if (table != undefined) {
    console.log(`table ${tableName} exists`)
  } else {
    console.log(`table ${tableName} does not exists`)
    Bun.file(`./src/db/${tableName}.schema`).text().then((schema) => {
      const query = this.db.query(schema);
      query.run();
      console.log(`table ${tableName} created`)
    })
  }
}