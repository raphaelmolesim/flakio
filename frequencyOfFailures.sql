-- Frequency of numberOfFailures per job
SELECT 
  job_name,
  CAST(
    substr(
      overall_testrun_status,
      instr(overall_testrun_status, ',') + 1,
      instr(substr(overall_testrun_status, instr(overall_testrun_status, ',') + 1), 'failure') -2
    ) AS INTEGER) AS numberOfFailures,
    count(*) as frequency
FROM jobs
WHERE overall_testrun_status IS NOT NULL
GROUP BY job_name, numberOfFailures