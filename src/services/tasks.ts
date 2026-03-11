import { feathersClient } from '@/backendAPI'

export interface Task {
  id: number
  club: number
  title: string
  description: string
  due_date: string
  created_at: string
  updated_at: string
  priority: string
  status: string
  daysUntilDue: number
}

export async function getTasks(): Promise<Task[]> {
  const response = await feathersClient.service('Task').find()
  return response.data.map((task: any) => ({
    ...task,
    daysUntilDue: calculateDaysUntilDue(task.due_date)
  }))
}

function calculateDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
