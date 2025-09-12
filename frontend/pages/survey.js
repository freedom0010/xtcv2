import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, CheckCircle, AlertCircle, Upload } from 'lucide-react'
import Layout from '../components/Layout'
import DiabetesSurvey from '../components/DiabetesSurvey'
import { useWallet } from '../contexts/WalletContext'
import { useContract } from '../contexts/ContractContext'
import { useToast } from '../contexts/ToastContext'
import filebaseService from '../services/filebaseService'

export default function SurveyPage() {
  const { account, connectWallet, isSepoliaNetwork } = useWallet()
  const { submitPatientData, loading, fhevmReady, ipfsReady } = useContract()
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSurveySubmit = async (surveyData) => {
    if (!account) {
      await connectWallet()
      return
    }

    if (!isSepoliaNetwork()) {
      showToast('请切换到 Sepolia 测试网', 'error')
      return
    }

    setIsSubmitting(true)
    
    try {
      showToast('正在提交调查问卷...', 'info')
      
      // 1. 首先上传到 IPFS
      const ipfsResult = await filebaseService.submitPatientRecord(account, {
        ...surveyData,
        dataType: 'diabetes-survey',
        submittedAt: new Date().toISOString()
      })
      
      if (!ipfsResult.success) {
        throw new Error(`IPFS上传失败: ${ipfsResult.error}`)
      }
      
      showToast(`数据已上传到IPFS: ${ipfsResult.cid.substring(0, 10)}...`, 'success')
      
      // 2. 然后提交到区块链（包含IPFS CID）
      const result = await submitPatientData(
        surveyData.bloodSugar || 100, // 使用血糖值作为数值
        new Date().toISOString(),
        JSON.stringify({
          dataType: 'diabetes-survey',
          ipfsCid: ipfsResult.cid,
          patientId: ipfsResult.patientId,
          submittedAt: new Date().toISOString(),
          ipfsUrl: ipfsResult.ipfsUrl
        })
      )
      
      if (result) {
        showToast('调查问卷提交成功！数据已安全存储到IPFS和区块链', 'success')
      }
    } catch (error) {
      console.error('提交失败:', error)
      showToast('提交失败，请重试', 'error')
    } finally {
      setIsSubmitting(false)
    }
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
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">健康问卷调查</h1>
            <p className="text-xl text-gray-600 mb-8">请先连接钱包以开始填写健康问卷</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              className="btn-primary"
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">糖尿病健康问卷</h1>
          <p className="text-xl text-gray-600">帮助我们了解您的健康状况，为医学研究提供宝贵数据</p>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">系统状态</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              {fhevmReady ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-gray-700">
                FHEVM 加密: {fhevmReady ? '已连接' : '模拟模式'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {ipfsReady ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span className="text-gray-700">
                IPFS 存储: {ipfsReady ? '已连接' : '模拟模式'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Survey Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DiabetesSurvey 
            onSubmit={handleSurveySubmit}
            isSubmitting={isSubmitting || loading}
          />
        </motion.div>
      </div>
    </Layout>
  )
}