
import { Database } from 'bun:sqlite'
import { ConsoleOutputLogger } from '../console_output_logger' 

export class OverviewQueryDatabase {
  private db: Database;

  constructor(db: Database) {
    this.db = db
    this.logger = new ConsoleOutputLogger("info", "JobsDatabase")
  }

  async getNumberOfTestPerJob() {
    return this.db.query(`
      SELECT  handled_finished_at, job_name, count(line) FROM (
        SELECT handled_finished_at, job_name, line, count(*) FROM (
          SELECT substr(finished_at, 0, instr(finished_at, 'T')) as handled_finished_at, jobs.*, tests.* FROM jobs
          INNER JOIN tests
          ON tests.job_id == jobs.job_id
          WHERE tests.line IN ( 
            SELECT FlakyLines.line FROM (
                SELECT LMR.line, count(LMR.ref) as failuresInUniquesMR FROM (
                SELECT tests.line, jobs.ref FROM tests
                INNER JOIN jobs
                ON tests.job_id == jobs.job_id
                GROUP by tests.line, jobs.ref
              ) as LMR
              GROUP BY LMR.line
              ) as FlakyLines
            WHERE FLakyLines.failuresInUniquesMR > 1 
          )
        )
        GROUP BY handled_finished_at, job_name, line
      )
      GROUP BY handled_finished_at, job_name
    `).all()
  }
}