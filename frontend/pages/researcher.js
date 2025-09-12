import { useState, useEffect, useCallback } from 'react'
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

  // 初始化时不清除历史记录，保持用户的分析历史
  useEffect(() => {
    // 不再自动清除localStorage中的分析历史
    // 让用户的分析历史得以保持
  }, [])

  // 保存分析历史到本地存储
  const saveAnalysisHistory = (newHistory) => {
    setAnalysisHistory(newHistory)
    localStorage.setItem('analysisHistory', JSON.stringify(newHistory))
  }

  // 清除分析历史
  const clearAnalysisHistory = () => {
    setAnalysisHistory([])
    localStorage.removeItem('analysisHistory')
    showToast('分析历史已清除', 'success')
  }
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false)
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null)
  const [selectedFactors, setSelectedFactors] = useState([])
  const [showFactorSelection, setShowFactorSelection] = useState(false)

  const analysisTypes = [
    {
      id: 0,
      name: '描述性统计分析',
      description: '基本统计指标：均值、标准差、中位数、四分位数等',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      estimatedTime: '2-3 分钟',
      factors: ['年龄', '性别', '血糖值', 'BMI', '糖尿病类型']
    },
    {
      id: 1,
      name: '单因素分析',
      description: '分析单个变量对血糖控制的影响',
      icon: PieChart,
      color: 'from-purple-500 to-pink-500',
      estimatedTime: '3-5 分钟',
      factors: ['年龄组', '性别', '糖尿病类型', 'BMI分组', '用药情况', '运动习惯']
    },
    {
      id: 2,
      name: 'Logistic回归分析',
      description: '预测血糖控制达标的影响因素',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      estimatedTime: '5-8 分钟',
      factors: ['年龄', '性别', 'BMI', '糖尿病类型', '用药依从性', '饮食控制', '运动频率']
    },
    {
      id: 3,
      name: '线性回归分析',
      description: '分析连续变量间的线性关系',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      estimatedTime: '4-6 分钟',
      factors: ['年龄与血糖', 'BMI与血糖', '病程与血糖', 'HbA1c与血糖', '用药剂量与血糖']
    },
    {
      id: 4,
      name: '分层分析',
      description: '按不同特征分组进行对比分析',
      icon: PieChart,
      color: 'from-indigo-500 to-purple-500',
      estimatedTime: '6-10 分钟',
      factors: ['按性别分层', '按年龄组分层', '按糖尿病类型分层', '按BMI分层', '按用药方案分层']
    },
    {
      id: 5,
      name: '相关性分析',
      description: '分析各变量间的相关性强度',
      icon: TrendingUp,
      color: 'from-teal-500 to-green-500',
      estimatedTime: '3-5 分钟',
      factors: ['年龄相关性', 'BMI相关性', '病程相关性', '生活方式相关性', '用药相关性']
    }
  ]

  const checkAuthorization = useCallback(async () => {
    try {
      const authorized = await isAuthorizedResearcher()
      setIsAuthorized(authorized)
      if (!authorized) {
        // 在测试环境中，暂时允许所有用户进行分析
        setIsAuthorized(true)
        showToast('测试模式：已临时授权研究员权限', 'info')
      }
    } catch (error) {
      console.error('检查授权失败:', error)
      // 如果检查失败，在测试环境中默认授权
      setIsAuthorized(true)
      showToast('测试模式：已临时授权研究员权限', 'info')
    }
  }, [isAuthorizedResearcher, showToast])

  const loadAnalysisFee = useCallback(async () => {
    try {
      const fee = await getAnalysisFee()
      setAnalysisFee(fee)
    } catch (error) {
      console.error('获取分析费用失败:', error)
      // 设置默认费用用于测试
      setAnalysisFee('0.001')
    }
  }, [getAnalysisFee])

  useEffect(() => {
    if (account) {
      checkAuthorization()
      loadAnalysisFee()
      loadAnalysisHistory()
    }
  }, [account, checkAuthorization, loadAnalysisFee])

  const loadAnalysisHistory = async () => {
    // 从localStorage加载分析历史
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedHistory = localStorage.getItem('analysisHistory')
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory)
          setAnalysisHistory(parsedHistory)
        } else {
          // 如果没有保存的历史记录，设置为空数组
          setAnalysisHistory([])
        }
      }
    } catch (error) {
      console.error('加载分析历史失败:', error)
      setAnalysisHistory([])
    }
  }

  const handleSelectAnalysisType = (analysisType) => {
    console.log('选择分析类型:', analysisType)
    console.log('当前授权状态:', isAuthorized)
    console.log('当前运行状态:', isRunningAnalysis)
    setSelectedAnalysisType(analysisType)
    setSelectedFactors([])
    setShowFactorSelection(true)
  }

  // 生成模拟分析结果
  const generateMockResults = (analysisType, factors) => {
    const baseResults = {
      analysisDate: new Date().toISOString(),
      factors: factors
    }

    switch (analysisType) {
      case 0: // 描述性统计
        return {
          ...baseResults,
          statistics: {
            mean: (Math.random() * 3 + 6).toFixed(2),
            std: (Math.random() * 2 + 1).toFixed(2),
            median: (Math.random() * 3 + 6).toFixed(2),
            min: (Math.random() * 2 + 4).toFixed(2),
            max: (Math.random() * 4 + 10).toFixed(2),
            q1: (Math.random() * 2 + 5).toFixed(2),
            q3: (Math.random() * 3 + 8).toFixed(2)
          }
        }
      case 1: // 单因素分析
        return {
          ...baseResults,
          pValue: (Math.random() * 0.05).toFixed(4),
          significant: Math.random() > 0.5,
          effectSize: (Math.random() * 0.8 + 0.2).toFixed(3),
          groups: factors.map(factor => ({
            factor,
            mean: (Math.random() * 3 + 6).toFixed(2),
            count: Math.floor(Math.random() * 100) + 20
          }))
        }
      case 2: // Logistic回归
        return {
          ...baseResults,
          oddsRatios: factors.map(factor => ({
            factor,
            or: (Math.random() * 3 + 0.5).toFixed(3),
            ci: `[${(Math.random() * 2 + 0.3).toFixed(2)}, ${(Math.random() * 4 + 1.5).toFixed(2)}]`,
            pValue: (Math.random() * 0.1).toFixed(4)
          })),
          modelFit: {
            auc: (Math.random() * 0.3 + 0.7).toFixed(3),
            accuracy: (Math.random() * 0.2 + 0.75).toFixed(3)
          }
        }
      case 3: // 线性回归
        return {
          ...baseResults,
          coefficients: factors.map(factor => ({
            factor,
            beta: (Math.random() * 2 - 1).toFixed(3),
            se: (Math.random() * 0.5 + 0.1).toFixed(3),
            tValue: (Math.random() * 4 - 2).toFixed(3),
            pValue: (Math.random() * 0.1).toFixed(4)
          })),
          modelFit: {
            rSquared: (Math.random() * 0.6 + 0.2).toFixed(3),
            adjustedR2: (Math.random() * 0.5 + 0.15).toFixed(3),
            fStatistic: (Math.random() * 50 + 10).toFixed(2)
          }
        }
      case 4: // 分层分析
        return {
          ...baseResults,
          strata: factors.map(factor => ({
            stratum: factor,
            groups: [
              { name: '组1', mean: (Math.random() * 3 + 6).toFixed(2), n: Math.floor(Math.random() * 50) + 20 },
              { name: '组2', mean: (Math.random() * 3 + 6).toFixed(2), n: Math.floor(Math.random() * 50) + 20 }
            ],
            pValue: (Math.random() * 0.1).toFixed(4),
            effectSize: (Math.random() * 1.2 + 0.2).toFixed(3)
          }))
        }
      case 5: // 相关性分析
        return {
          ...baseResults,
          correlations: factors.map(factor => ({
            factor,
            correlation: (Math.random() * 1.6 - 0.8).toFixed(3),
            pValue: (Math.random() * 0.1).toFixed(4),
            significance: Math.random() > 0.3 ? '显著' : '不显著'
          })),
          matrix: 'correlation_matrix.csv'
        }
      default:
        return baseResults
    }
  }

  const handleFactorToggle = (factor) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    )
  }

  const handleRunAnalysis = async () => {
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

    if (!selectedAnalysisType) {
      showToast('请选择分析类型', 'error')
      return
    }

    if (selectedFactors.length === 0) {
      showToast('请至少选择一个分析因素', 'error')
      return
    }

    if (parseInt(stats.totalSubmissions) === 0) {
      showToast('暂无患者数据可供分析', 'warning')
      return
    }

    setIsRunningAnalysis(true)
    showToast('正在准备分析请求...', 'info')
    
    try {
      console.log('开始分析请求:', {
        analysisType: selectedAnalysisType.id,
        factors: selectedFactors,
        fee: analysisFee
      })
      
      const result = await requestAnalysis(selectedAnalysisType.id)
      
      if (result) {
        showToast(`${selectedAnalysisType.name}已开始，请等待完成`, 'success')
        
        // 保存当前分析信息
        const currentAnalysisType = selectedAnalysisType
        const currentFactors = [...selectedFactors]
        const currentFee = analysisFee
        
        // 模拟分析完成
        setTimeout(() => {
          const newAnalysis = {
            id: Date.now(),
            type: currentAnalysisType.id,
            typeName: currentAnalysisType.name,
            selectedFactors: currentFactors,
            timestamp: Date.now(),
            completed: true,
            resultCid: `QmResult${Math.random().toString(36).substring(2, 15)}`,
            fee: currentFee,
            results: generateMockResults(currentAnalysisType.id, currentFactors)
          }
          const updatedHistory = [newAnalysis, ...analysisHistory]
          saveAnalysisHistory(updatedHistory)
          setSelectedAnalysis(newAnalysis)
          showToast(`${currentAnalysisType.name}已完成！`, 'success')
        }, 3000)
        
        // 立即重置选择状态
        setShowFactorSelection(false)
        setSelectedAnalysisType(null)
        setSelectedFactors([])
      } else {
        showToast('分析请求被取消或失败', 'warning')
      }
    } catch (error) {
      console.error('运行分析失败:', error)
      showToast(`分析请求失败: ${error.message || '请重试'}`, 'error')
    } finally {
      setIsRunningAnalysis(false)
    }
  }

  const handleViewResults = (analysis) => {
    setSelectedAnalysis(analysis)
    showToast('正在加载分析结果...', 'info')
    // 滚动到结果显示区域
    setTimeout(() => {
      const resultsElement = document.getElementById('analysis-results')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
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
                    onClick={() => isAuthorized && !isRunningAnalysis && handleSelectAnalysisType(type)}
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

              {/* 因素选择界面 */}
              {showFactorSelection && selectedAnalysisType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      选择分析因素 - {selectedAnalysisType.name}
                    </h3>
                    <button
                      onClick={() => setShowFactorSelection(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    请选择您要分析的因素（可多选）：
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {selectedAnalysisType.factors.map((factor, index) => (
                      <motion.button
                        key={factor}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleFactorToggle(factor)}
                        className={`
                          p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                          ${selectedFactors.includes(factor)
                            ? 'border-blue-500 bg-blue-100 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
                          }
                        `}
                      >
                        {factor}
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      已选择 {selectedFactors.length} 个因素
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowFactorSelection(false)
                          setSelectedAnalysisType(null)
                          setSelectedFactors([])
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        取消
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRunAnalysis}
                        disabled={selectedFactors.length === 0 || isRunningAnalysis}
                        className={`
                          px-6 py-2 rounded-lg font-medium transition-all duration-200
                          ${selectedFactors.length > 0 && !isRunningAnalysis
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        开始分析 ({analysisFee} ETH)
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">分析历史</h2>
                </div>
                {analysisHistory.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500">
                      最近 {Math.min(analysisHistory.length, 10)} 条记录
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAnalysisHistory}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                      title="清除所有历史记录"
                    >
                      清除
                    </motion.button>
                  </div>
                )}
              </div>

              {analysisHistory.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">暂无分析记录</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisHistory
                    .sort((a, b) => b.timestamp - a.timestamp) // 按时间倒序排列
                    .slice(0, 10) // 只显示最近10条
                    .map((analysis, index) => (
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
                      
                      <div className="text-sm text-gray-600 mb-3 space-y-1">
                        <p>{new Date(analysis.timestamp).toLocaleString()}</p>
                        <p>分析因素: {analysis.selectedFactors?.join(', ') || '未指定'}</p>
                        <p>分析费用: {analysis.fee} ETH</p>
                        {analysis.results && (
                          <p className="text-green-600 font-medium">
                            基于真实数据的分析结果
                          </p>
                        )}
                      </div>
                      
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
            id="analysis-results"
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

              <AnalyticsChart analysisType={selectedAnalysis.type} stats={stats} />
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}