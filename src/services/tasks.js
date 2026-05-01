import { feathersClient } from '@/backendAPI';
export async function getTasks() {
    const response = await feathersClient.service('Task').find();
    return response.data.map((task) => ({
        ...task,
        daysUntilDue: calculateDaysUntilDue(task.due_date)
    }));
}
function calculateDaysUntilDue(dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 'overdue' : diffDays;
}
