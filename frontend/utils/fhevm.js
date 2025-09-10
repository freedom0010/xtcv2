import { FhevmInstance } from 'fhevmjs'

class FHEVMClient {
  constructor() {
    this.instance = null
    this.publicKey = null
    this.initialized = false
  }

  async initialize(provider) {
    try {
      // 初始化 FHEVM 实例
      this.instance = await FhevmInstance.create({
        chainId: 11155111, // Sepolia testnet
        publicKeyId: '0x...' // 需要从网络获取
      })

      // 获取公钥
      this.publicKey = this.instance.getPublicKey()
      this.initialized = true
      
      console.log('FHEVM 客户端初始化成功')
      return true
    } catch (error) {
      console.error('FHEVM 初始化失败:', error)
      return false
    }
  }

  async encryptUint32(value) {
    if (!this.initialized) {
      throw new Error('FHEVM 客户端未初始化')
    }

    try {
      // 验证输入值范围
      const numValue = parseInt(value)
      if (numValue < 0 || numValue > 4294967295) {
        throw new Error('值超出 uint32 范围')
      }

      // 使用 FHEVM 加密
      const encrypted = this.instance.encrypt32(numValue)
      
      return {
        data: encrypted.data,
        proof: encrypted.proof
      }
    } catch (error) {
      console.error('加密失败:', error)
      throw error
    }
  }

  async encryptBloodGlucose(glucoseValue) {
    // 验证血糖值范围 (20-600 mg/dL)
    const glucose = parseFloat(glucoseValue)
    if (glucose < 20 || glucose > 600) {
      throw new Error('血糖值必须在 20-600 mg/dL 范围内')
    }

    // 将浮点数转换为整数 (乘以10保留一位小数)
    const intValue = Math.round(glucose * 10)
    
    return await this.encryptUint32(intValue)
  }

  getPublicKey() {
    return this.publicKey
  }

  isInitialized() {
    return this.initialized
  }
}

// 创建全局实例
export const fhevmClient = new FHEVMClient()

// 辅助函数
export const initializeFHEVM = async (provider) => {
  return await fhevmClient.initialize(provider)
}

export const encryptGlucoseValue = async (value) => {
  return await fhevmClient.encryptBloodGlucose(value)
}

// 模拟加密函数 (用于开发测试)
export const mockEncryptGlucose = (value) => {
  const glucose = parseFloat(value)
  if (glucose < 20 || glucose > 600) {
    throw new Error('血糖值必须在 20-600 mg/dL 范围内')
  }

  // 生成模拟的加密数据
  const mockData = new Uint8Array(32)
  const valueBytes = new TextEncoder().encode(value.toString())
  mockData.set(valueBytes.slice(0, Math.min(valueBytes.length, 32)))
  
  return {
    data: '0x' + Array.from(mockData).map(b => b.toString(16).padStart(2, '0')).join(''),
    proof: '0x' + '00'.repeat(64) // 模拟证明
  }
}