export class Parallel {
  tasks: Array<any>
  numTasks: number
  numWorkers: number
  handler: CallableFunction
  currentIndex: number

  constructor(tasks: Array<any>, handler: CallableFunction, numWorkers: number) {
    this.tasks = tasks
    this.numTasks = this.tasks.length
    this.numWorkers = numWorkers
    this.handler = handler
    this.currentIndex = 0
  }

  async worker() {
    let currentIndex = this.currentIndex
    this.currentIndex += 1
    if (currentIndex >= this.numTasks) {
      return
    }

    await this.handler(this.tasks[currentIndex])

    if (this.currentIndex < this.numTasks) {
      await this.worker()
    }
  }

  async start() {
    return new Promise(resolve => {
      let finishWorkers = 0
      for (let iWorker = 0; iWorker < this.numWorkers; iWorker += 1) {
        this.worker().then(() => {
          finishWorkers += 1
          if (finishWorkers === this.numWorkers) {
            resolve(null)
          }
        })
      }
    })
  }
}
