
export const findOrCreateTable = async (db, tableName) => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
  const data = db.query(sql).all()
  const table = data[0]
  if (table != undefined) {
    console.log(`[DataMapper]: table ${tableName} exists`)
  } else {
    console.log(`[DataMapper]: table ${tableName} does not exists`)
    let schema = await Bun.file(`./src/db/${tableName}.schema`).text()
    console.log(`[DataMapper]: creating table ${tableName}:\n`, schema)
    const query = db.query(schema)
    const result = query.run()
    console.log(`[DataMapper]: table ${tableName} created`, result)
  }
}