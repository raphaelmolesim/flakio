import { ConsoleOutputLogger } from '../../console_output_logger'

export function useLogger(currentPage = '') {
  return new ConsoleOutputLogger("debug", currentPage)
}