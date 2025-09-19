#!/usr/bin/env node

/**
 * Microtask Manager - Sistema de gestión de microtareas
 * Gestiona el ciclo de vida de microtareas del proyecto
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();
const TASKS_FILE = join(PROJECT_ROOT, 'TASKS.md');

/**
 * Estados de microtareas
 */
const TASK_STATES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  DONE: 'done',
  CANCELLED: 'cancelled'
};

/**
 * Lee el archivo TASKS.md
 */
function readTasksFile() {
  if (!existsSync(TASKS_FILE)) {
    console.error('❌ TASKS.md no encontrado');
    return null;
  }
  
  try {
    return readFileSync(TASKS_FILE, 'utf8');
  } catch (error) {
    console.error('❌ Error leyendo TASKS.md:', error.message);
    return null;
  }
}

/**
 * Parsea las microtareas del archivo TASKS.md
 */
function parseTasks(content) {
  const tasks = [];
  const lines = content.split('\n');
  
  let currentTask = null;
  let inTaskSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectar inicio de tarea
    if (line.startsWith('### **TAREA-')) {
      inTaskSection = true;
      currentTask = {
        id: line.match(/TAREA-(\d+)/)?.[1],
        line: i,
        content: []
      };
    }
    
    // Detectar fin de tarea (siguiente tarea o sección)
    else if (inTaskSection && (line.startsWith('### **TAREA-') || line.startsWith('## ') || line.startsWith('#'))) {
      if (currentTask) {
        tasks.push(currentTask);
        currentTask = null;
      }
      
      if (line.startsWith('### **TAREA-')) {
        currentTask = {
          id: line.match(/TAREA-(\d+)/)?.[1],
          line: i,
          content: []
        };
      } else {
        inTaskSection = false;
      }
    }
    
    // Agregar contenido a la tarea actual
    else if (inTaskSection && currentTask) {
      currentTask.content.push(line);
    }
  }
  
  // Agregar la última tarea si existe
  if (currentTask) {
    tasks.push(currentTask);
  }
  
  return tasks;
}

/**
 * Obtiene el estado de una tarea
 */
function getTaskState(taskContent) {
  const stateLine = taskContent.find(line => line.includes('**Estado**:'));
  if (!stateLine) return TASK_STATES.PENDING;
  
  const stateMatch = stateLine.match(/\*\*Estado\*\*: `(\w+)`/);
  return stateMatch ? stateMatch[1] : TASK_STATES.PENDING;
}

/**
 * Obtiene las dependencias de una tarea
 */
function getTaskDependencies(taskContent) {
  const depsLine = taskContent.find(line => line.includes('**Dependencias**:'));
  if (!depsLine) return [];
  
  const depsMatch = depsLine.match(/\*\*Dependencias\*\*: (.+)/);
  if (!depsMatch) return [];
  
  const deps = depsMatch[1].trim();
  if (deps === 'Ninguna' || deps === '') return [];
  
  return deps.split(',').map(dep => dep.trim());
}

/**
 * Verifica si una tarea puede ser iniciada
 */
function canStartTask(taskId, allTasks) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return false;
  
  const state = getTaskState(task.content);
  if (state !== TASK_STATES.PENDING) return false;
  
  const dependencies = getTaskDependencies(task.content);
  if (dependencies.length === 0) return true;
  
  // Verificar que todas las dependencias estén completadas
  for (const depId of dependencies) {
    const depTask = allTasks.find(t => t.id === depId);
    if (!depTask) return false;
    
    const depState = getTaskState(depTask.content);
    if (depState !== TASK_STATES.DONE) return false;
  }
  
  return true;
}

/**
 * Obtiene las tareas disponibles para iniciar
 */
function getAvailableTasks(allTasks) {
  return allTasks.filter(task => {
    const state = getTaskState(task.content);
    return state === TASK_STATES.PENDING && canStartTask(task.id, allTasks);
  });
}

/**
 * Obtiene las tareas en progreso
 */
function getInProgressTasks(allTasks) {
  return allTasks.filter(task => {
    const state = getTaskState(task.content);
    return state === TASK_STATES.IN_PROGRESS;
  });
}

/**
 * Obtiene las tareas bloqueadas
 */
function getBlockedTasks(allTasks) {
  return allTasks.filter(task => {
    const state = getTaskState(task.content);
    return state === TASK_STATES.BLOCKED;
  });
}

/**
 * Obtiene las tareas completadas
 */
function getCompletedTasks(allTasks) {
  return allTasks.filter(task => {
    const state = getTaskState(task.content);
    return state === TASK_STATES.DONE;
  });
}

/**
 * Actualiza el estado de una tarea
 */
function updateTaskState(taskId, newState, allTasks) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) {
    console.error(`❌ Tarea ${taskId} no encontrada`);
    return false;
  }
  
  const currentState = getTaskState(task.content);
  console.log(`🔄 Actualizando TAREA-${taskId}: ${currentState} → ${newState}`);
  
  // Actualizar el contenido
  const updatedContent = task.content.map(line => {
    if (line.includes('**Estado**:')) {
      return line.replace(/`\w+`/, `\`${newState}\``);
    }
    return line;
  });
  
  task.content = updatedContent;
  return true;
}

/**
 * Genera un reporte de estado
 */
function generateStatusReport(allTasks) {
  const available = getAvailableTasks(allTasks);
  const inProgress = getInProgressTasks(allTasks);
  const blocked = getBlockedTasks(allTasks);
  const completed = getCompletedTasks(allTasks);
  
  const total = allTasks.length;
  const completedCount = completed.length;
  const progress = ((completedCount / total) * 100).toFixed(1);
  
  console.log('📊 REPORTE DE ESTADO DE MICROTAREAS');
  console.log('==================================');
  console.log(`📋 Total: ${total}`);
  console.log(`✅ Completadas: ${completedCount} (${progress}%)`);
  console.log(`🔄 En progreso: ${inProgress.length}`);
  console.log(`⏳ Disponibles: ${available.length}`);
  console.log(`🚫 Bloqueadas: ${blocked.length}`);
  
  if (inProgress.length > 0) {
    console.log('\n🔄 TAREAS EN PROGRESO:');
    inProgress.forEach(task => {
      const title = task.content.find(line => line.includes('**Descripción**:'));
      const titleText = title ? title.replace('**Descripción**:', '').trim() : 'Sin descripción';
      console.log(`  - TAREA-${task.id}: ${titleText}`);
    });
  }
  
  if (available.length > 0) {
    console.log('\n⏳ TAREAS DISPONIBLES:');
    available.forEach(task => {
      const title = task.content.find(line => line.includes('**Descripción**:'));
      const titleText = title ? title.replace('**Descripción**:', '').trim() : 'Sin descripción';
      console.log(`  - TAREA-${task.id}: ${titleText}`);
    });
  }
  
  if (blocked.length > 0) {
    console.log('\n🚫 TAREAS BLOQUEADAS:');
    blocked.forEach(task => {
      const title = task.content.find(line => line.includes('**Descripción**:'));
      const titleText = title ? title.replace('**Descripción**:', '').trim() : 'Sin descripción';
      console.log(`  - TAREA-${task.id}: ${titleText}`);
    });
  }
  
  return {
    total,
    completed: completedCount,
    inProgress: inProgress.length,
    available: available.length,
    blocked: blocked.length,
    progress: parseFloat(progress)
  };
}

/**
 * Inicia una tarea
 */
function startTask(taskId) {
  const content = readTasksFile();
  if (!content) return false;
  
  const allTasks = parseTasks(content);
  const task = allTasks.find(t => t.id === taskId);
  
  if (!task) {
    console.error(`❌ Tarea ${taskId} no encontrada`);
    return false;
  }
  
  if (!canStartTask(taskId, allTasks)) {
    console.error(`❌ Tarea ${taskId} no puede ser iniciada`);
    return false;
  }
  
  updateTaskState(taskId, TASK_STATES.IN_PROGRESS, allTasks);
  console.log(`✅ Tarea ${taskId} iniciada`);
  return true;
}

/**
 * Completa una tarea
 */
function completeTask(taskId) {
  const content = readTasksFile();
  if (!content) return false;
  
  const allTasks = parseTasks(content);
  const task = allTasks.find(t => t.id === taskId);
  
  if (!task) {
    console.error(`❌ Tarea ${taskId} no encontrada`);
    return false;
  }
  
  const currentState = getTaskState(task.content);
  if (currentState !== TASK_STATES.IN_PROGRESS) {
    console.error(`❌ Tarea ${taskId} no está en progreso`);
    return false;
  }
  
  updateTaskState(taskId, TASK_STATES.DONE, allTasks);
  console.log(`✅ Tarea ${taskId} completada`);
  return true;
}

/**
 * Bloquea una tarea
 */
function blockTask(taskId, reason) {
  const content = readTasksFile();
  if (!content) return false;
  
  const allTasks = parseTasks(content);
  const task = allTasks.find(t => t.id === taskId);
  
  if (!task) {
    console.error(`❌ Tarea ${taskId} no encontrada`);
    return false;
  }
  
  updateTaskState(taskId, TASK_STATES.BLOCKED, allTasks);
  console.log(`🚫 Tarea ${taskId} bloqueada: ${reason || 'Sin razón especificada'}`);
  return true;
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('📋 Microtask Manager - Comandos disponibles:');
    console.log('  status                    - Mostrar estado de tareas');
    console.log('  start <taskId>           - Iniciar una tarea');
    console.log('  complete <taskId>         - Completar una tarea');
    console.log('  block <taskId> [reason]   - Bloquear una tarea');
    console.log('  available                - Mostrar tareas disponibles');
    console.log('  in-progress              - Mostrar tareas en progreso');
    return;
  }
  
  const content = readTasksFile();
  if (!content) return;
  
  const allTasks = parseTasks(content);
  
  switch (command) {
    case 'status':
      generateStatusReport(allTasks);
      break;
      
    case 'start':
      if (args[1]) {
        startTask(args[1]);
      } else {
        console.error('❌ ID de tarea requerido');
      }
      break;
      
    case 'complete':
      if (args[1]) {
        completeTask(args[1]);
      } else {
        console.error('❌ ID de tarea requerido');
      }
      break;
      
    case 'block':
      if (args[1]) {
        blockTask(args[1], args[2]);
      } else {
        console.error('❌ ID de tarea requerido');
      }
      break;
      
    case 'available':
      const available = getAvailableTasks(allTasks);
      console.log('⏳ TAREAS DISPONIBLES:');
      available.forEach(task => {
        console.log(`  - TAREA-${task.id}`);
      });
      break;
      
    case 'in-progress':
      const inProgress = getInProgressTasks(allTasks);
      console.log('🔄 TAREAS EN PROGRESO:');
      inProgress.forEach(task => {
        console.log(`  - TAREA-${task.id}`);
      });
      break;
      
    default:
      console.error(`❌ Comando desconocido: ${command}`);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { 
  parseTasks,
  getTaskState,
  getTaskDependencies,
  canStartTask,
  getAvailableTasks,
  getInProgressTasks,
  getBlockedTasks,
  getCompletedTasks,
  updateTaskState,
  generateStatusReport,
  startTask,
  completeTask,
  blockTask
};
