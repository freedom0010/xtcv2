import { create } from 'ipfs-http-client'

class IPFSClient {
  constructor() {
    this.client = null
    this.initialized = false
  }

  async initialize() {
    try {
      // 连接到本地 IPFS 节点或公共网关
      this.client = create({
        host: 'localhost',
        port: 5001,
        protocol: 'http'
      })

      // 测试连接
      await this.client.id()
      this.initialized = true
      console.log('IPFS 客户端初始化成功')
      return true
    } catch (error) {
      console.warn('本地 IPFS 节点连接失败，尝试使用公共网关')
      
      try {
        // 使用 Infura IPFS 网关
        this.client = create({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
            authorization: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID 
              ? `Basic ${Buffer.from(process.env.NEXT_PUBLIC_INFURA_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET).toString('base64')}`
              : undefined
          }
        })

        await this.client.id()
        this.initialized = true
        console.log('IPFS 公共网关连接成功')
        return true
      } catch (publicError) {
        console.error('IPFS 初始化完全失败:', publicError)
        return false
      }
    }
  }

  async uploadPatientData(patientData) {
    if (!this.initialized) {
      throw new Error('IPFS 客户端未初始化')
    }

    try {
      // 准备上传数据
      const dataToUpload = {
        ...patientData,
        uploadTime: new Date().toISOString(),
        version: '1.0',
        dataType: 'encrypted-glucose-data'
      }

      // 转换为 JSON 字符串
      const jsonData = JSON.stringify(dataToUpload, null, 2)
      
      // 上传到 IPFS
      const result = await this.client.add(jsonData, {
        pin: true, // 固定文件
        cidVersion: 1 // 使用 CIDv1
      })

      console.log('数据已上传到 IPFS:', result.cid.toString())
      return result.cid.toString()
    } catch (error) {
      console.error('IPFS 上传失败:', error)
      throw error
    }
  }

  async retrievePatientData(cid) {
    if (!this.initialized) {
      throw new Error('IPFS 客户端未初始化')
    }

    try {
      const chunks = []
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk)
      }
      
      const data = Buffer.concat(chunks).toString()
      return JSON.parse(data)
    } catch (error) {
      console.error('IPFS 数据检索失败:', error)
      throw error
    }
  }

  async pinData(cid) {
    if (!this.initialized) {
      throw new Error('IPFS 客户端未初始化')
    }

    try {
      await this.client.pin.add(cid)
      console.log('数据已固定:', cid)
      return true
    } catch (error) {
      console.error('固定数据失败:', error)
      return false
    }
  }

  isInitialized() {
    return this.initialized
  }
}

// 创建全局实例
export const ipfsClient = new IPFSClient()

// 辅助函数
export const initializeIPFS = async () => {
  return await ipfsClient.initialize()
}

export const uploadToIPFS = async (data) => {
  return await ipfsClient.uploadPatientData(data)
}

export const retrieveFromIPFS = async (cid) => {
  return await ipfsClient.retrievePatientData(cid)
}

// 模拟 IPFS 上传 (用于开发测试)
export const mockUploadToIPFS = async (data) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 生成模拟的 CID
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  const mockCid = `Qm${timestamp}${random}`.substring(0, 46)
  
  console.log('模拟上传到 IPFS:', mockCid)
  console.log('上传数据:', data)
  
  return mockCid
}

// IPFS 网关 URL 生成器
export const getIPFSUrl = (cid, gateway = 'https://ipfs.io/ipfs/') => {
  return `${gateway}${cid}`
}

// 验证 CID 格式
export const isValidCID = (cid) => {
  // 简单的 CID 格式验证
  const cidRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$|^bafy[a-z2-7]{55}$/
  return cidRegex.test(cid)
}