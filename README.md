# 糖尿病匿名统计分析平台

基于 **FHEVM + IPFS + Sepolia** 测试链的去中心化糖尿病患者匿名数据统计分析 DApp。

## 🎯 项目概述

本项目为糖尿病患者和医学研究员提供了一个完全隐私保护的数据分析平台：

- **患者端**：安全上传加密的血糖数据
- **研究员端**：运行统计分析并查看可视化结果
- **隐私保护**：所有数据使用 FHEVM 同态加密技术处理
- **去中心化存储**：原始数据存储在 IPFS，链上仅保存 CID 和加密结果

## 🏗️ 技术架构

### 核心技术栈

- **前端框架**：Next.js 14 + React 18 + TypeScript
- **UI 组件**：TailwindCSS + Shadcn/UI
- **动效库**：Framer Motion
- **数据可视化**：Recharts
- **区块链交互**：ethers.js v6 + MetaMask
- **智能合约**：Solidity + FHEVM (@fhevm/solidity)
- **去中心化存储**：IPFS (Filebase 网关)
- **测试网络**：Sepolia Testnet

### 系统架构图

```
┌─────────────────┐    ┌─────────────────┐
│   患者端 UI     │    │  研究员端 UI    │
│  (React/Next)   │    │  (React/Next)   │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          ├──────────────────────┤
          │                      │
┌─────────▼──────────────────────▼───────┐
│         Web3 交互层 (ethers.js)        │
└─────────┬──────────────────────┬───────┘
          │                      │
┌─────────▼───────┐    ┌─────────▼───────┐
│  FHEVM 合约     │    │  IPFS 存储      │
│ (Sepolia 链)    │    │  (Filebase)     │
└─────────────────┘    └─────────────────┘
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- MetaMask 钱包
- Sepolia 测试网 ETH

### 1. 克隆项目

```bash
git clone <repository-url>
cd diabetes-fhe-dapp
```

### 2. 安装依赖

```bash
# 安装合约依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

### 3. 环境配置

#### 后端配置

复制并配置环境变量：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 区块链配置
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here

# IPFS 配置
FILEBASE_API_KEY=your_filebase_api_key
FILEBASE_SECRET_KEY=your_filebase_secret_key
FILEBASE_BUCKET=diabetes-data-bucket
```

#### 前端配置

```bash
cd frontend
cp .env.local.example .env.local
```

编辑 `frontend/.env.local`：

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=部署后的合约地址
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
NEXT_PUBLIC_FILEBASE_GATEWAY=https://ipfs.filebase.io/ipfs/
```

### 4. 部署智能合约

```bash
# 编译合约
npm run compile

# 部署到 Sepolia 测试网
npm run deploy
```

部署成功后，将合约地址更新到前端环境变量中。

### 5. 启动前端应用

```bash
cd frontend
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📱 功能特性

### 患者端功能

- **连接钱包**：支持 MetaMask 钱包连接
- **数据上传**：
  - 输入血糖值 (20-600 mg/dL)
  - 选择测量时间
  - 添加备注信息
  - 自动 FHE 加密处理
- **提交历史**：查看已提交的数据记录
- **隐私保护**：所有数据完全加密，无法被第三方读取

### 研究员端功能

- **授权验证**：仅授权研究员可运行分析
- **分析类型**：
  - 平均值分析：计算血糖平均值和标准差
  - 分布统计：分析血糖值分布情况
  - 趋势分析：时间序列趋势分析
- **数据可视化**：
  - 柱状图、饼图、折线图
  - 交互式图表展示
  - 分析洞察和建议
- **分析历史**：查看历史分析记录

### 核心安全特性

- **同态加密**：使用 FHEVM 技术，数据在计算过程中始终加密
- **去中心化存储**：原始数据存储在 IPFS，确保数据不可篡改
- **链上验证**：所有操作在区块链上可验证和追溯
- **权限控制**：研究员需要授权才能运行分析

## 🔧 开发指南

### 项目结构

```
diabetes-fhe-dapp/
├── contracts/                 # 智能合约
│   └── DiabetesAnalytics.sol
├── scripts/                   # 部署脚本
│   └── deploy.js
├── test/                      # 合约测试
│   └── DiabetesAnalytics.test.js
├── frontend/                  # 前端应用
│   ├── components/           # React 组件
│   ├── contexts/             # Context 提供者
│   ├── pages/                # 页面组件
│   ├── styles/               # 样式文件
│   └── utils/                # 工具函数
├── hardhat.config.js         # Hardhat 配置
└── package.json
```

### 智能合约接口

#### 主要函数

```solidity
// 患者提交数据
function submitPatientData(
    einput encryptedGlucose,
    bytes calldata inputProof,
    string calldata ipfsCid,
    string calldata loincCode
) external

// 研究员请求分析
function requestAnalysis(uint8 analysisType) external payable

// 获取统计信息
function getStats() external view returns (uint256, uint256, uint256)
```

#### 事件

```solidity
event DataSubmitted(address indexed patient, string ipfsCid, uint256 timestamp);
event AnalysisRequested(address indexed researcher, uint256 requestId);
event AnalysisCompleted(uint256 indexed requestId, string resultCid);
```

### 前端组件说明

- **Layout.js**：应用布局和导航
- **WalletContext.js**：钱包连接和状态管理
- **ContractContext.js**：智能合约交互
- **ToastContext.js**：消息提示系统
- **AnalyticsChart.js**：数据可视化组件

## 🧪 测试

### 运行合约测试

```bash
npm test
```

### 测试覆盖的功能

- 合约部署和初始化
- 患者数据提交
- 研究员授权和分析请求
- 事件触发和数据验证

## 🌐 部署

### Sepolia 测试网部署

1. 获取 Sepolia 测试网 ETH：
   - 访问 [Sepolia Faucet](https://sepoliafaucet.com/)
   - 获取测试 ETH

2. 配置 Infura 或 Alchemy：
   - 注册并获取 API Key
   - 更新 `SEPOLIA_RPC_URL`

3. 部署合约：
   ```bash
   npm run deploy
   ```

4. 验证合约（可选）：
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### 前端部署

推荐使用 Vercel 部署：

```bash
cd frontend
npm run build
```

或使用 Vercel CLI：

```bash
vercel --prod
```

## 📊 使用示例

### 患者上传数据

1. 连接 MetaMask 钱包
2. 切换到 Sepolia 测试网
3. 输入血糖值和测量时间
4. 点击"加密并上传数据"
5. 确认交易并等待上链

### 研究员运行分析

1. 连接已授权的研究员钱包
2. 选择分析类型（平均值/分布/趋势）
3. 支付分析费用并提交请求
4. 等待分析完成并查看结果

## 🔐 隐私和安全

### 数据保护机制

1. **客户端加密**：数据在上传前使用 FHEVM 加密
2. **同态计算**：分析过程中数据始终保持加密状态
3. **去中心化存储**：原始数据存储在 IPFS，无中心化风险
4. **链上验证**：所有操作可在区块链上验证

### 安全最佳实践

- 定期更新依赖包
- 使用硬件钱包存储私钥
- 在主网部署前进行充分测试
- 实施多重签名管理

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 故障排除

### 常见问题

**Q: MetaMask 连接失败**
A: 确保已安装 MetaMask 并切换到 Sepolia 测试网

**Q: 合约交互失败**
A: 检查合约地址是否正确，账户是否有足够的 ETH

**Q: IPFS 上传失败**
A: 检查 Filebase 配置，或使用模拟模式进行测试

**Q: 分析结果不显示**
A: 确保有足够的患者数据，且研究员账户已授权

### 获取帮助

- 查看 [Issues](../../issues) 页面
- 阅读 [Wiki](../../wiki) 文档
- 联系项目维护者

## 🔮 未来规划

- [ ] 支持更多分析算法
- [ ] 集成更多 IPFS 网关
- [ ] 添加移动端支持
- [ ] 实现数据市场功能
- [ ] 支持多种加密货币支付
- [ ] 添加 DAO 治理机制

---

**免责声明**：本项目仅用于教育和研究目的。在处理真实医疗数据时，请确保遵守相关法律法规和隐私保护要求。