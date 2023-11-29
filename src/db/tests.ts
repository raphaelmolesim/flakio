
import { Database } from 'bun:sqlite'
import { findOrCreateTable } from './data_mapper'

export interface Test {
  id?: number;
  line: string;
  name: string;
  error_messages: string;
  job_id: number;
}

export class TestsDatabase {
  private db: Database;

  constructor() {
    this.db = new Database('flakio.db', { create: true })
  }

  database() {
    return findOrCreateTable(this.db, 'tests').then(() => { return this.db })
  }

  all() {
    return this.database().then((db) => db.query('SELECT * FROM tests').all());
  }

  async find(jobId: number, line: string) {
    return await this.database().then((db) => {
      return db.query('SELECT * FROM tests WHERE job_id = $job_id AND line = $line')
      .all({ $job_id: jobId, $line: line }).map((test) => {
        return {
          id: test.id,
          line: test.line,
          name: test.name,
          error_messages: JSON.parse(test.error_messages_array),
          job_id: test.job_id
        }
      })[0]
    })
  }

  async all(line: string, jobName: string) {
    console.log("[TestsDatabase] #all_by_line PARAMS [", line, '/' ,jobName, ']')
    return await this.database().then((db) => {
      const query = db.query(`
        SELECT tests.*, jobs.pipeline_id FROM tests 
        INNER JOIN jobs 
        ON jobs.job_id == tests.job_id 
        WHERE tests.line == $line
        AND jobs.job_name == $jobName
      `)
      const results = query.all({ $line: line, $jobName: jobName })
      console.log('[TestsDatabase] #all_by_line sql => ', query.toString())
      return results.map((test) => {
        return {
          id: test.id,
          line: test.line,
          name: test.name,
          error_messages: JSON.parse(test.error_messages_array),
          job_id: test.job_id,
          pipeline_id: test.pipeline_id
        }
      })
    })
  }

  async create(test: Test) {
    console.log('🦊 Creating test', test)
    return await this.database().then((db) => db.query(`INSERT INTO tests 
      (
        line,
        name,
        error_messages_array, 
        job_id
      ) VALUES (?, ?, ?, ?) RETURNING id`)
      .get(
        test.line, 
        test.name, 
        JSON.stringify(test.error_messages),
        test.job_id
      ) as Test)
  }

  async queryTestByMR(jobNames) {
    console.log('[TestsDatabase] queryTestByMR for job: ', jobNames)
    const variables = jobNames.map((jobName, idx) => `$job_name${idx}`). join(", ")
    const variablesWithValue = jobNames.map((jobName, idx) => {
      const hash = {}
      hash[`$job_name${idx}`] = jobName
      return hash
    }).reduce((acc, curr) => { return { ...acc, ...curr } }, {})
    return await this.database().then((db) => {
      const query = db.query(`
        SELECT * FROM
        (
          SELECT tests.line, COUNT(jobs.ref) AS MR, 
          (
            SELECT 
              GROUP_CONCAT(
                CASE WHEN T.line IS tests.line
                THEN  '4' -- 4 is the error code
                ELSE  '5' -- 5 is the success code
                END)
              FROM jobs AS J
            LEFT JOIN tests as T
            ON J.job_id == T.job_id
            WHERE J.job_name IN (${variables})
          ) AS Executions FROM tests 
          INNER JOIN jobs 
          ON jobs.job_id == tests.job_id 
          WHERE jobs.job_name IN (${variables})
          GROUP BY tests.line
          ORDER BY MR DESC
        ) WHERE MR > 1
        `)
      const result = query.all(variablesWithValue)
      console.log('[TestsDatabase] queryTestByMR sql', query.toString())
      return result
    })
  }

}