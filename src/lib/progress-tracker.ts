import { EventEmitter } from 'events';
import { ProgressUpdate } from './types';

export class ProgressTracker extends EventEmitter {
  private updates: ProgressUpdate[] = [];
  private currentProgress: number = 0;

  start(message: string): void {
    this.addUpdate({
      status: 'started',
      message,
      progress: 0,
      timestamp: new Date()
    });
  }

  update(message: string, progress?: number): void {
    if (progress !== undefined) {
      this.currentProgress = progress;
    }
    this.addUpdate({
      status: 'in_progress',
      message,
      progress: this.currentProgress,
      timestamp: new Date()
    });
  }

  complete(message: string): void {
    this.currentProgress = 100;
    this.addUpdate({
      status: 'completed',
      message,
      progress: 100,
      timestamp: new Date()
    });
  }

  error(message: string, details?: any): void {
    this.addUpdate({
      status: 'error',
      message,
      progress: this.currentProgress,
      timestamp: new Date(),
      details
    });
  }

  private addUpdate(update: ProgressUpdate): void {
    this.updates.push(update);
    this.emit('progress', update);
  }

  getUpdates(): ProgressUpdate[] {
    return [...this.updates];
  }

  getLatest(): ProgressUpdate | undefined {
    return this.updates[this.updates.length - 1];
  }

  getProgress(): number {
    return this.currentProgress;
  }

  reset(): void {
    this.updates = [];
    this.currentProgress = 0;
  }
}
