export const getNumberOfTestPerJob = async ({ overviewQueryDb }) => {
  return await overviewQueryDb().getNumberOfTestPerJob()
}