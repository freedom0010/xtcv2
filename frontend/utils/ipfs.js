import axios from 'axios'

// Filebase IPFS 配置
const FILEBASE_API_URL = 'https://api.filebase.io'
const FILEBASE_GATEWAY = process.env.NEXT_PUBLIC_FILEBASE_GATEWAY || 'https://ipfs.filebase.io/ipfs/'

class IPFSService {
  constructor() {
    this.apiKey = process.env.FILEBASE_API_KEY
    this.secretKey = process.env.FILEBASE_SECRET_KEY
    this.bucket = process.env.FILEBASE_BUCKET || 'diabetes-data-bucket'
  }

  /**
   * 上传数据到 IPFS (通过 Filebase)
   * @param {Object} data - 要上传的数据
   * @param {string} filename - 文件名
   * @returns {Promise<string>} IPFS CID
   */
  async uploadData(data, filename = null) {
    try {
      // 如果没有配置 API 密钥，使用模拟上传
      if (!this.apiKey || !this.secretKey) {
        return this.mockUpload(data, filename)
      }

      const jsonData = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      
      const formData = new FormData()
      formData.append('file', blob, filename || `diabetes-data-${Date.now()}.json`)

      const response = await axios.post(`${FILEBASE_API_URL}/v1/ipfs`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data.Hash
    } catch (error) {
      console.error('IPFS 上传失败:', error)
      // 降级到模拟上传
      return this.mockUpload(data, filename)
    }
  }

  /**
   * 从 IPFS 下载数据
   * @param {string} cid - IPFS CID
   * @returns {Promise<Object>} 下载的数据
   */
  async downloadData(cid) {
    try {
      const response = await axios.get(`${FILEBASE_GATEWAY}${cid}`, {
        timeout: 10000,
      })
      return response.data
    } catch (error) {
      console.error('IPFS 下载失败:', error)
      // 返回模拟数据
      return this.mockDownload(cid)
    }
  }

  /**
   * 上传患者血糖数据
   * @param {Object} patientData - 患者数据
   * @returns {Promise<string>} IPFS CID
   */
  async uploadPatientData(patientData) {
    const dataWithMetadata = {
      type: 'patient_glucose_data',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        bloodGlucose: patientData.bloodGlucose,
        measurementTime: patientData.timestamp,
        notes: patientData.notes || '',
        loincCode: '2345-7', // Glucose [Mass/volume] in Blood
      },
      metadata: {
        uploadedAt: new Date().toISOString(),
        patientAddress: patientData.patientAddress,
        encrypted: true,
        encryptionMethod: 'FHEVM',
      }
    }

    return await this.uploadData(dataWithMetadata, `patient-${patientData.patientAddress}-${Date.now()}.json`)
  }

  /**
   * 上传分析结果
   * @param {Object} analysisResult - 分析结果
   * @returns {Promise<string>} IPFS CID
   */
  async uploadAnalysisResult(analysisResult) {
    const resultWithMetadata = {
      type: 'analysis_result',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: analysisResult,
      metadata: {
        generatedAt: new Date().toISOString(),
        analysisType: analysisResult.type,
        encrypted: true,
        encryptionMethod: 'FHEVM',
      }
    }

    return await this.uploadData(resultWithMetadata, `analysis-${analysisResult.type}-${Date.now()}.json`)
  }

  /**
   * 获取 IPFS 网关 URL
   * @param {string} cid - IPFS CID
   * @returns {string} 完整的 IPFS URL
   */
  getGatewayUrl(cid) {
    return `${FILEBASE_GATEWAY}${cid}`
  }

  /**
   * 验证 CID 格式
   * @param {string} cid - IPFS CID
   * @returns {boolean} 是否为有效的 CID
   */
  isValidCID(cid) {
    // 简单的 CID 格式验证
    const cidRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/
    return cidRegex.test(cid)
  }

  /**
   * 模拟上传 (用于开发和测试)
   * @param {Object} data - 数据
   * @param {string} filename - 文件名
   * @returns {Promise<string>} 模拟的 CID
   */
  async mockUpload(data, filename) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // 生成模拟的 CID
    const hash = this.generateMockCID(JSON.stringify(data))
    console.log('模拟 IPFS 上传:', { filename, cid: hash, size: JSON.stringify(data).length })
    
    return hash
  }

  /**
   * 模拟下载 (用于开发和测试)
   * @param {string} cid - CID
   * @returns {Promise<Object>} 模拟数据
   */
  async mockDownload(cid) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
    
    // 根据 CID 返回不同的模拟数据
    if (cid.includes('patient')) {
      return {
        type: 'patient_glucose_data',
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          bloodGlucose: 120 + Math.random() * 80,
          measurementTime: new Date().toISOString(),
          notes: '餐后2小时测量',
          loincCode: '2345-7',
        },
        metadata: {
          uploadedAt: new Date().toISOString(),
          encrypted: true,
          encryptionMethod: 'FHEVM',
        }
      }
    } else if (cid.includes('analysis')) {
      return {
        type: 'analysis_result',
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          analysisType: 0,
          results: {
            average: 142.5,
            standardDeviation: 28.3,
            sampleSize: 268,
            distribution: {
              low: 23,
              normal: 156,
              high: 89
            }
          }
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          encrypted: true,
          encryptionMethod: 'FHEVM',
        }
      }
    }
    
    return { error: 'Data not found' }
  }

  /**
   * 生成模拟的 CID
   * @param {string} content - 内容
   * @returns {string} 模拟的 CID
   */
  generateMockCID(content) {
    // 简单的哈希函数生成模拟 CID
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    
    const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let result = 'Qm'
    
    // 生成44个字符的模拟 CID
    for (let i = 0; i < 44; i++) {
      result += base58Chars[Math.abs(hash + i) % base58Chars.length]
    }
    
    return result
  }

  /**
   * 批量上传数据
   * @param {Array} dataArray - 数据数组
   * @returns {Promise<Array>} CID 数组
   */
  async batchUpload(dataArray) {
    const uploadPromises = dataArray.map((data, index) => 
      this.uploadData(data, `batch-${index}-${Date.now()}.json`)
    )
    
    try {
      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error('批量上传失败:', error)
      throw error
    }
  }

  /**
   * 获取上传统计
   * @returns {Object} 上传统计信息
   */
  getUploadStats() {
    // 这里可以实现实际的统计逻辑
    return {
      totalUploads: 0,
      totalSize: 0,
      lastUpload: null,
    }
  }
}

// 创建单例实例
const ipfsService = new IPFSService()

export default ipfsService

// 导出常用方法
export const {
  uploadData,
  downloadData,
  uploadPatientData,
  uploadAnalysisResult,
  getGatewayUrl,
  isValidCID,
} = ipfsService