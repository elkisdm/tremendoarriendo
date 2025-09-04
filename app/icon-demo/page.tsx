/**
 * 🎨 Página de Demostración - Sistema de Íconos Glass
 * 
 * Página que muestra todas las funcionalidades del sistema de íconos
 * glass minimal con ejemplos interactivos.
 */

import { IconProvider, IconDemo } from '@/components/icons';

export default function IconDemoPage() {
    return (
        <IconProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <IconDemo />
            </div>
        </IconProvider>
    );
}
