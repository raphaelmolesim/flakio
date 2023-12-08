
import { Database } from 'bun:sqlite'
import { findOrCreateTable } from './data_mapper'
import { ConsoleOutputLogger } from '../console_output_logger' 

const statusEnum = {
  created: 1, 
  pending: 2, 
  running: 3, 
  failed: 4, 
  success: 5, 
  canceled :6, 
  skipped: 7, 
  waiting_for_resource: 8, 
  manual: 9
}

export interface Job {
  id?: number;
  job_id: number;
  job_name: string;
  status: number;
  finished_at: string;
  ref: string;
  author: string;
  autor_avatar_url: string;
  pipeline_id: number;
  pipeline_url: string;
  duration: number;
  queue_duration: number;
  coverage: string;
}

export class JobsDatabase {
  private db: Database;

  constructor() {
    this.db = new Database('flakio.db', { create: true })
    this.logger = new ConsoleOutputLogger("info", "JobsDatabase")
  }

  database() {
    return findOrCreateTable(this.db, 'jobs').then(() => { return this.db })
  }

  all() {
    return this.database().then((db) => db.query('SELECT * FROM jobs').all());
  }

  async find(id) {
    return await this.database().then((db) => {
      return db.query('SELECT * FROM jobs WHERE job_id = $job_id')
      .all({ $job_id: id })[0]
    })
  }

  async create(job: Job) {
    this.logger.debug('Creating job', job)
    const status = statusEnum[job.status]
    if (status == undefined) throw new Error(`Status ${job.status} is not valid`)

    return await this.database().then((db) => db.query(`INSERT INTO jobs 
      (
        job_id, 
        job_name, 
        status, 
        finished_at, 
        ref, 
        author, 
        autor_avatar_url, 
        pipeline_id, 
        pipeline_url, 
        duration,
        queue_duration,
        coverage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
      .get(
        job.job_id, 
        job.job_name, 
        status,
        job.finished_at,
        job.ref,
        job.author,
        job.autor_avatar_url,
        job.pipeline_id,
        job.pipeline_url,
        job.duration,
        job.queue_duration,
        job.coverage
      ) as Job)
  }

  async updateTestRunData(jobId, overallStatus, seed) {
    this.logger.debug('Updating job', jobId, overallStatus, seed)
    return await this.database().then((db) => db.query(`UPDATE jobs SET overall_testrun_status = ?, seed = ? WHERE job_id = ?`)
      .run(overallStatus, seed, jobId))
  }


}