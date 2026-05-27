export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private static formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  static info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  static warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  static error(message: string, error?: unknown): void {
    console.error(this.formatMessage('ERROR', message));
    if (error instanceof Error) {
      console.error(error.stack);
    }
  }

  static debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  static step(stepName: string): void {
    console.log(this.formatMessage('INFO', `▶ STEP: ${stepName}`));
  }
}
