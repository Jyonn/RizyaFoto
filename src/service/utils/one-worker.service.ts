import {Injectable} from '@angular/core';

export class WorkerBusyError extends Error {}

@Injectable()
export class OneWorkerService {
  static TYPE_SYNC = 'sync';
  static TYPE_PROMISE = 'promise';
  static TYPE_INJECT = 'inject';
  static workers = new Set();

  do({
       identifier,
       worker,
       busyHandler = null,
       workerType = OneWorkerService.TYPE_INJECT
   }: any): any {
    if (OneWorkerService.workers.has(identifier)) {
      if (typeof busyHandler === 'function') {
        busyHandler(identifier);
        return;
      }
      throw new WorkerBusyError();
    }

    OneWorkerService.workers.add(identifier);
    if (workerType === OneWorkerService.TYPE_SYNC) {
      const result = worker();
      OneWorkerService.workers.delete(identifier);
      return result;
    } else if (workerType === OneWorkerService.TYPE_PROMISE) {
      return (worker() as Promise<any>).then((resp) => {
        OneWorkerService.workers.delete(identifier);
        return resp;
      });
    } else  if (workerType === OneWorkerService.TYPE_INJECT) {
      worker(() => {
        OneWorkerService.workers.delete(identifier);
      });
    }
  }

  getPromise(identifier: string, worker: any): Promise<any> {
    if (OneWorkerService.workers.has(identifier)) {
      return new Promise((resolve, reject) => {
        reject(null);
      });
    }
    OneWorkerService.workers.add(identifier);
    return worker().then((resp: any) => {
      OneWorkerService.workers.delete(identifier);
      return resp;
    });
  }
}
