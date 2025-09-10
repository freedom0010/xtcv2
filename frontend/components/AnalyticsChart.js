import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'

export default function AnalyticsChart({ analysisType }) {
  const [chartData, setChartData] = useState(null)
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateMockData()
  }, [analysisType])

  const generateMockData = () => {
    setLoading(true)
    
    // 模拟数据加载延迟
    setTimeout(() => {
      let data, insightData
      
      switch (analysisType) {
        case 0: // 平均值分析
          data = generateAverageData()
          insightData = [
            { type: 'info', text: '平均血糖值为 142.5 mg/dL，略高于正常范围' },
            { type: 'warning', text: '标准差较大 (±28.3)，建议关注血糖波动' },
            { type: 'success', text: '68% 的数据在正常范围内' }
          ]
          break
          
        case 1: // 分布统计
          data = generateDistributionData()
          insightData = [
            { type: 'info', text: '正常血糖占比 58%，高血糖占比 35%' },
            { type: 'warning', text: '高血糖患者比例偏高，需要关注' },
            { type: 'success', text: '低血糖事件较少，仅占 7%' }
          ]
          break
          
        case 2: // 趋势分析
          data = generateTrendData()
          insightData = [
            { type: 'success', text: '近30天血糖控制有所改善' },
            { type: 'info', text: '周末血糖值普遍较高' },
            { type: 'warning', text: '早晨血糖峰值需要关注' }
          ]
          break
          
        default:
          data = []
          insightData = []
      }
      
      setChartData(data)
      setInsights(insightData)
      setLoading(false)
    }, 1500)
  }

  const generateAverageData = () => {
    return [
      { category: '低血糖 (<70)', value: 65.2, count: 23, color: '#3B82F6' },
      { category: '正常 (70-140)', value: 105.8, count: 156, color: '#10B981' },
      { category: '高血糖 (>140)', value: 178.4, count: 89, color: '#EF4444' },
      { category: '整体平均', value: 142.5, count: 268, color: '#8B5CF6' }
    ]
  }

  const generateDistributionData = () => {
    return [
      { name: '低血糖', value: 7, count: 23, color: '#3B82F6' },
      { name: '正常', value: 58, count: 156, color: '#10B981' },
      { name: '高血糖', value: 35, count: 89, color: '#EF4444' }
    ]
  }

  const generateTrendData = () => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        average: 120 + Math.random() * 60 + Math.sin(i * 0.2) * 20,
        morning: 110 + Math.random() * 50 + Math.sin(i * 0.15) * 15,
        evening: 130 + Math.random() * 70 + Math.sin(i * 0.25) * 25
      })
    }
    return days
  }

  const renderAverageChart = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="category" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value.toFixed(1)} mg/dL`, '平均值']}
            labelFormatter={(label) => `类别: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData?.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">{item.category}</div>
            <div className="text-xs text-gray-500">{item.count} 条记录</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderDistributionChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, '占比']} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-4">
          {chartData?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{item.value}%</div>
                <div className="text-sm text-gray-500">{item.count} 人</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTrendChart = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value.toFixed(1)} mg/dL`, name]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="average"
            stackId="1"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.3}
            name="日平均"
          />
          <Line
            type="monotone"
            dataKey="morning"
            stroke="#10B981"
            strokeWidth={2}
            name="晨起"
          />
          <Line
            type="monotone"
            dataKey="evening"
            stroke="#EF4444"
            strokeWidth={2}
            name="晚间"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {chartData ? chartData[chartData.length - 1]?.average.toFixed(1) : '0'}
          </div>
          <div className="text-sm text-purple-700">最新日平均</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {chartData ? chartData[chartData.length - 1]?.morning.toFixed(1) : '0'}
          </div>
          <div className="text-sm text-green-700">最新晨起</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {chartData ? chartData[chartData.length - 1]?.evening.toFixed(1) : '0'}
          </div>
          <div className="text-sm text-red-700">最新晚间</div>
        </div>
      </div>
    </div>
  )

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'warning':
        return <TrendingDown className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getInsightStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在生成分析结果...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* 图表展示 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        {analysisType === 0 && renderAverageChart()}
        {analysisType === 1 && renderDistributionChart()}
        {analysisType === 2 && renderTrendChart()}
      </div>

      {/* 分析洞察 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">分析洞察</h3>
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start space-x-3 p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
          >
            {getInsightIcon(insight.type)}
            <p className="text-sm font-medium">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}