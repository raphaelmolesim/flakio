import { ConsoleOutputLogger } from "../console_output_logger"
const logger = new ConsoleOutputLogger("info", "DataMapper")

export const findOrCreateTable = async (db, tableName) => {
  const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
  const data = db.query(sql).all()
  const table = data[0]
  if (table != undefined) {
    logger.debug(`table ${tableName} exists`)
  } else {
    logger.debug(`table ${tableName} does not exists`)
    let schema = await Bun.file(`./src/db/${tableName}.schema`).text()    
    logger.debug(`creating table ${tableName}:\n`, schema)
    const query = db.query(schema)
    const result = query.run()
    logger.debug(`table ${tableName} created`, result)
  }
}

export const insertInto = (db, tableName, params) => {
  const now = new Date().toISOString()
  let insert = null
  try {
    const columns = [ ...Object.keys(params), 'created_at', 'updated_at' ]
    const values = [ ...Object.values(params), now, now ]
    const parsedValues = values.map((value) => {
      if (typeof(value) === "string")
        return value
      else if (typeof(value) === "object") 
        return JSON.stringify(value)
      else 
        throw new Error(`Unknown type ${typeof(value)} for value ${value}`)
    })
    console.log("parsedValues", parsedValues, parsedValues.map((value) => typeof(value)))
    const valuePlaceholder = "?, ".repeat(values.length - 1) + "?"
    logger.debug("Inserting with ", columns, values)
    let sql = `INSERT INTO ${tableName} 
      (${columns.join(", ")}) 
      VALUES (${valuePlaceholder}) 
      RETURNING id`
    insert = db.query(sql)
    return insert.get(...parsedValues)
  } catch (error) {
    logger.error("%O", error)
    logger.error(insert)
    throw error
  }
}

export const initializeDatabase = (db) => {  
  db.database().then((database) => { database.exec("PRAGMA journal_mode = WAL;"); })
  logger.debug("Initialized database", db)
  return db
}