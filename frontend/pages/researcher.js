import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Play, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  Database,
  Zap,
  Download,
  Eye
} from 'lucide-react'
import Layout from '../components/Layout'
import AnalyticsChart from '../components/AnalyticsChart'
import { useWallet } from '../contexts/WalletContext'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '../contexts/ToastContext'

export default function ResearcherPage() {
  const { account, connectWallet, isSepoliaNetwork } = useWallet()
  const { 
    requestAnalysis, 
    isAuthorizedResearcher, 
    getAnalysisFee, 
    stats, 
    loading 
  } = useContract()
  const { showToast } = useToast()

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [analysisFee, setAnalysisFee] = useState('0')
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false)

  const analysisTypes = [
    {
      id: 0,
      name: '平均值分析',
      description: '计算所有患者血糖数据的平均值和标准差',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      estimatedTime: '2-3 分钟'
    },
    {
      id: 1,
      name: '分布统计',
      description: '分析血糖值在不同范围内的分布情况',
      icon: PieChart,
      color: 'from-purple-500 to-pink-500',
      estimatedTime: '3-5 分钟'
    },
    {
      id: 2,
      name: '趋势分析',
      description: '分析血糖数据的时间趋势和变化模式',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      estimatedTime: '5-8 分钟'
    }
  ]

  useEffect(() => {
    if (account) {
      checkAuthorization()
      loadAnalysisFee()
      loadAnalysisHistory()
    }
  }, [account])

  const checkAuthorization = async () => {
    try {
      const authorized = await isAuthorizedResearcher()
      setIsAuthorized(authorized)
      if (!authorized) {
        showToast('您尚未获得研究员授权，请联系管理员', 'warning')
      }
    } catch (error) {
      console.error('检查授权失败:', error)
    }
  }

  const loadAnalysisFee = async () => {
    try {
      const fee = await getAnalysisFee()
      setAnalysisFee(fee)
    } catch (error) {
      console.error('获取分析费用失败:', error)
    }
  }

  const loadAnalysisHistory = async () => {
    // 模拟分析历史数据
    const mockHistory = [
      {
        id: 1,
        type: 0,
        typeName: '平均值分析',
        timestamp: Date.now() - 86400000,
        completed: true,
        resultCid: 'QmAnalysisResult123',
        fee: '0.001'
      },
      {
        id: 2,
        type: 1,
        typeName: '分布统计',
        timestamp: Date.now() - 172800000,
        completed: true,
        resultCid: 'QmDistributionResult456',
        fee: '0.001'
      }
    ]
    setAnalysisHistory(mockHistory)
  }

  const handleRunAnalysis = async (analysisType) => {
    if (!account) {
      await connectWallet()
      return
    }

    if (!isSepoliaNetwork()) {
      showToast('请切换到 Sepolia 测试网', 'error')
      return
    }

    if (!isAuthorized) {
      showToast('您没有研究员权限', 'error')
      return
    }

    if (parseInt(stats.totalSubmissions) === 0) {
      showToast('暂无患者数据可供分析', 'warning')
      return
    }

    setIsRunningAnalysis(true)
    
    try {
      const result = await requestAnalysis(analysisType.id)
      
      if (result) {
        showToast(`${analysisType.name}已开始，请等待完成`, 'success')
        
        // 模拟分析完成
        setTimeout(() => {
          const newAnalysis = {
            id: Date.now(),
            type: analysisType.id,
            typeName: analysisType.name,
            timestamp: Date.now(),
            completed: true,
            resultCid: `QmResult${Math.random().toString(36).substring(2, 15)}`,
            fee: analysisFee
          }
          setAnalysisHistory(prev => [newAnalysis, ...prev])
          setSelectedAnalysis(newAnalysis)
          showToast(`${analysisType.name}已完成！`, 'success')
        }, 3000)
      }
    } catch (error) {
      console.error('运行分析失败:', error)
      showToast('分析请求失败，请重试', 'error')
    } finally {
      setIsRunningAnalysis(false)
    }
  }

  const handleViewResults = (analysis) => {
    setSelectedAnalysis(analysis)
    showToast('正在加载分析结果...', 'info')
  }

  if (!account) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">研究员数据分析</h1>
            <p className="text-xl text-gray-600 mb-8">请先连接钱包以开始数据分析</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="btn-secondary"
            >
              连接钱包
            </motion.button>
          </motion.div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">研究员数据分析</h1>
          <p className="text-xl text-gray-600">运行统计分析，获取聚合数据洞察</p>
        </motion.div>

        {/* 统计概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">参与患者</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">数据提交</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalSubmissions}</p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">完成分析</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalRequests}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 分析类型选择 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2"
          >
            <div className="medical-card">
              <div className="flex items-center space-x-3 mb-6">
                <Play className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800">运行分析</h2>
              </div>

              {!isAuthorized && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">需要授权</h4>
                      <p className="text-sm text-yellow-700">您需要获得研究员授权才能运行分析</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {analysisTypes.map((type, index) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      card cursor-pointer transition-all duration-300 hover:shadow-xl
                      ${!isAuthorized || isRunningAnalysis ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => isAuthorized && !isRunningAnalysis && handleRunAnalysis(type)}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{type.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{type.estimatedTime}</span>
                      </span>
                      <span>{analysisFee} ETH</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {isRunningAnalysis && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">分析进行中</h4>
                      <p className="text-sm text-blue-700">正在处理加密数据，请稍候...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* 分析历史 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="xl:col-span-1"
          >
            <div className="medical-card">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">分析历史</h2>
              </div>

              {analysisHistory.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">暂无分析记录</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisHistory.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{analysis.typeName}</h4>
                        {analysis.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {new Date(analysis.timestamp).toLocaleString()}
                      </p>
                      
                      {analysis.completed && (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewResults(analysis)}
                            className="flex-1 bg-blue-100 text-blue-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>查看</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-100 text-green-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 分析结果展示 */}
        {selectedAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <div className="medical-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedAnalysis.typeName} - 结果
                  </h2>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(selectedAnalysis.timestamp).toLocaleString()}
                </div>
              </div>

              <AnalyticsChart analysisType={selectedAnalysis.type} />
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}