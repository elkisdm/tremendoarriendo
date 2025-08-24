import WeekView from '@/components/calendar/WeekView';
import { getWeekStart } from '@/lib/calendar/week-view';

export default function TestWeekCalendarPage() {
    // Obtener el lunes de la semana actual
    const today = new Date();
    const weekStart = getWeekStart(today);
    const startDate = weekStart.toISOString().slice(0, 10) as any;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                        Calendario Semanal de Visitas
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-300">
                        Vista semanal con visitas agendadas, bloqueos externos e internos
                    </p>
                </div>

                <WeekView
                    startDate={startDate}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6"
                />
            </div>
        </div>
    );
}
