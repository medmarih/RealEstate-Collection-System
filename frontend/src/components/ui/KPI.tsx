import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Percent, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'

interface KPIProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down'
  icon: React.ReactNode
  color?: 'purple' | 'blue' | 'green' | 'orange'
}

const colorClasses = {
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  orange: 'from-orange-500 to-orange-600'
}

export default function KPI({ title, value, change, trend = 'up', icon, color = 'purple' }: KPIProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30 dark:border-white/20 shadow-xl hover:shadow-2xl hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent dark:via-black/20 group-hover:bg-white/30 dark:group-hover:bg-black/30 transition-all duration-300" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <span className={cn(
                'text-sm font-semibold',
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}>
                {change > 0 ? `+${change}%` : `${change}%`}
              </span>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
              )}
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

