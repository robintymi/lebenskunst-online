interface TrainingAccessEntry {
  training: string | { id: string }
  startDate: string
  endDate: string
}

interface TrainingModule {
  title: string
  description?: string
  weekNumber?: number
}

export function getTrainingId(entry: TrainingAccessEntry): string {
  return typeof entry.training === 'string' ? entry.training : entry.training.id
}

export function isTrainingActive(entry: TrainingAccessEntry): boolean {
  const now = new Date()
  return now >= new Date(entry.startDate) && now <= new Date(entry.endDate)
}

export function isTrainingCompleted(entry: TrainingAccessEntry): boolean {
  return new Date() > new Date(entry.endDate)
}

export function getWeeksElapsed(entry: TrainingAccessEntry): number {
  const now = new Date()
  const start = new Date(entry.startDate)
  const diffMs = now.getTime() - start.getTime()
  return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)))
}

export function isModuleUnlocked(
  entry: TrainingAccessEntry,
  module: TrainingModule,
): boolean {
  if (!module.weekNumber) return true // No week restriction = always available
  const weeksElapsed = getWeeksElapsed(entry)
  return module.weekNumber <= weeksElapsed + 1 // Week 1 is immediately available
}

export function getUnlockedModules(
  entry: TrainingAccessEntry,
  modules: TrainingModule[],
): TrainingModule[] {
  return modules.filter((m) => isModuleUnlocked(entry, m))
}

export function getTrainingProgress(
  entry: TrainingAccessEntry,
  totalWeeks: number,
): number {
  if (totalWeeks <= 0) return 100
  const weeksElapsed = getWeeksElapsed(entry)
  return Math.min(100, Math.round((weeksElapsed / totalWeeks) * 100))
}
