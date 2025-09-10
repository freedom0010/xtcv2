# Diabetes Analytics DApp

基于 FHEVM 同态加密和 IPFS 去中心化存储的糖尿病患者匿名统计分析平台。

## 🌟 主要特性

- **隐私保护**: 使用 FHEVM 同态加密技术，数据在整个分析过程中始终保持加密状态
- **去中心化存储**: 患者数据通过 IPFS 网络进行去中心化存储
- **匿名统计**: 支持对加密数据进行聚合分析，无需解密原始数据
- **区块链透明**: 基于以太坊 Sepolia 测试网，所有操作公开透明
- **用户友好**: 现代化的 Web3 界面，支持 MetaMask 等钱包

## 🏗️ 技术架构

### 前端技术栈
- **Next.js 14**: React 框架
- **Tailwind CSS**: 样式框架
- **Framer Motion**: 动画库
- **Ethers.js**: 以太坊交互
- **FHEVMJS**: 同态加密客户端
- **IPFS HTTP Client**: IPFS 交互

### 区块链技术栈
- **Solidity**: 智能合约语言
- **FHEVM**: 同态加密虚拟机
- **Hardhat**: 开发框架
- **Sepolia**: 以太坊测试网

### 存储技术栈
- **IPFS**: 去中心化文件系统
- **Infura IPFS**: 托管 IPFS 服务
- **Pinata**: IPFS 固定服务

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- MetaMask 钱包
- Sepolia 测试网 ETH

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/fricksdownert/xtc.git
cd xtc
```

2. **自动安装**
```bash
node scripts/install.js
```

或手动安装：

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install && cd ..

# 编译合约
npm run compile
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 合约地址（部署后填入）
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# FHEVM 配置
NEXT_PUBLIC_FHEVM_GATEWAY_URL=https://gateway.sepolia.zama.ai
NEXT_PUBLIC_ENABLE_REAL_ENCRYPTION=false

# IPFS 配置
NEXT_PUBLIC_ENABLE_REAL_IPFS=false
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret
```

4. **部署合约**（可选）
```bash
npm run deploy
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

## 📱 使用指南

### 患者端操作

1. **连接钱包**: 点击"连接钱包"按钮，连接 MetaMask
2. **切换网络**: 确保连接到 Sepolia 测试网
3. **上传数据**: 
   - 输入血糖值（20-600 mg/dL）
   - 选择测量时间
   - 添加备注（可选）
   - 点击"加密并上传数据"

### 研究员端操作

1. **获取授权**: 联系管理员获得研究员权限
2. **请求分析**: 
   - 选择分析类型（平均值/分布/趋势）
   - 支付分析费用
   - 等待分析完成
3. **查看结果**: 通过 IPFS CID 获取分析结果

## 🔐 隐私保护机制

### FHEVM 同态加密

- **客户端加密**: 血糖数据在客户端使用 FHEVM 进行加密
- **链上计算**: 智能合约直接对加密数据进行统计计算
- **结果解密**: 只有授权研究员可以解密聚合结果

### IPFS 去中心化存储

- **数据分散**: 原始数据存储在 IPFS 网络的多个节点
- **内容寻址**: 使用加密哈希作为数据地址
- **访问控制**: 只有数据所有者和授权方可以访问

## 🛠️ 开发模式

项目支持两种运行模式：

### 模拟模式（默认）
- 使用模拟的 FHEVM 加密
- 使用模拟的 IPFS 上传
- 适合开发和测试

### 生产模式
- 连接真实的 FHEVM 网关
- 连接真实的 IPFS 网络
- 需要配置相应的服务端点

切换到生产模式：
```env
NEXT_PUBLIC_ENABLE_REAL_ENCRYPTION=true
NEXT_PUBLIC_ENABLE_REAL_IPFS=true
```

## 📊 智能合约功能

### 患者功能
- `submitPatientData()`: 提交加密的血糖数据
- `getPatientSubmissions()`: 查看个人提交记录

### 研究员功能
- `requestAnalysis()`: 请求数据分析
- `getAnalysisRequest()`: 查看分析请求状态

### 管理员功能
- `authorizeResearcher()`: 授权研究员
- `updateAnalysisFee()`: 更新分析费用

## 🔧 配置说明

### FHEVM 配置
```javascript
export const FHEVM_CONFIG = {
  chainId: 11155111, // Sepolia
  gatewayUrl: 'https://gateway.sepolia.zama.ai',
  enableRealEncryption: false // 开发模式
}
```

### IPFS 配置
```javascript
export const IPFS_CONFIG = {
  local: {
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  },
  infura: {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  }
}
```

## 🧪 测试

```bash
# 运行合约测试
npm test

# 运行前端测试
cd frontend && npm test
```

## 📦 部署

### 合约部署
```bash
npm run deploy
```

### 前端部署
```bash
cd frontend
npm run build
npm start
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [FHEVM 文档](https://docs.zama.ai/fhevm)
- [IPFS 文档](https://docs.ipfs.tech/)
- [Hardhat 文档](https://hardhat.org/docs)
- [Next.js 文档](https://nextjs.org/docs)

## ⚠️ 免责声明

本项目仅用于教育和研究目的。在生产环境中使用前，请确保：

1. 充分测试所有功能
2. 进行安全审计
3. 遵守相关法律法规
4. 获得必要的医疗数据处理许可

## 📞 支持

如有问题或建议，请：

1. 查看 [Issues](https://github.com/fricksdownert/xtc/issues)
2. 创建新的 Issue
3. 联系项目维护者

---

**注意**: 这是一个演示项目，展示了如何结合 FHEVM 同态加密和 IPFS 去中心化存储来构建隐私保护的医疗数据分析平台。