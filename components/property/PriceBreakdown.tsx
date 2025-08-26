"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, CheckCircle, Info } from "lucide-react";

interface PriceBreakdownProps {
  rent: number;
  commonExpenses: number;
  deposit?: number;
  fee?: number;
  currency?: 'CLP' | 'USD';
  className?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  rent,
  commonExpenses,
  deposit,
  fee = 0,
  currency = 'CLP',
  className = ""
}) => {
  const totalMonthly = rent + commonExpenses;
  const hasNoFee = fee === 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg ${className}`}
    >
      {/* Header con badge de 0% comisión */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Desglose de costos
        </h3>
        {hasNoFee && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            <span>0% comisión</span>
          </motion.div>
        )}
      </div>

      {/* Tabla de costos */}
      <div className="space-y-4">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Arriendo mensual
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Valor base del contrato
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(rent)}
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Gastos comunes
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Servicios y mantención
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(commonExpenses)}
          </span>
        </motion.div>

        {deposit && (
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Depósito de garantía
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Se devuelve al finalizar
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(deposit)}
            </span>
          </motion.div>
        )}

        {!hasNoFee && (
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Comisión
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cargo único
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(fee)}
            </span>
          </motion.div>
        )}

        {/* Separador */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-200 dark:border-gray-700 pt-4"
        />

        {/* Total mensual */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                Total mensual
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Arriendo + Gastos comunes
              </p>
            </div>
          </div>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalMonthly)}
          </span>
        </motion.div>
      </div>

      {/* Información adicional */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-1">¿Qué incluye?</p>
            <ul className="space-y-1 text-xs">
              <li>• Arriendo del departamento</li>
              <li>• Gastos comunes (agua, luz, gas)</li>
              <li>• Mantención de áreas comunes</li>
              {hasNoFee && <li>• <strong>Sin comisión de corretaje</strong></li>}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
