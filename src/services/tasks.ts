import { feathersClient } from '@/backendAPI'

export interface Task {
  id: number
  club: number | string
  clubName?: string
  title: string
  description: string
  due_date: string
  created_at: string
  updated_at: string
  priority: string
  status: string
  daysUntilDue: number
}

export async function getTasks(clubIds?: Array<number | string>): Promise<Task[]> {
  if (clubIds && clubIds.length === 0) return []

  const allowedClubIds = clubIds ? new Set(clubIds.map((id) => String(id))) : null
  const clubQueryIds = clubIds
    ? [...new Set(clubIds.flatMap((id) => [id, String(id)]))]
    : undefined

  const response = await feathersClient.service('Task').find({
    query: clubQueryIds ? { club: { $in: clubQueryIds } } : {},
  })

  return response.data
    .filter((task: any) => !allowedClubIds || allowedClubIds.has(String(task.club)))
    .map((task: any) => ({
      ...task,
      daysUntilDue: calculateDaysUntilDue(task.due_date),
    }))
}

function calculateDaysUntilDue(dueDate: string): number | string {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 0 ? 'overdue' : diffDays
}
