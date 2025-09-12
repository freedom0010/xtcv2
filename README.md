# 🩺 糖尿病患者匿名统计分析 DApp

基于 FHEVM + IPFS + Sepolia 的隐私保护糖尿病数据分析平台

## 📋 项目简介

这是一个创新的去中心化应用（DApp），专为糖尿病患者数据的隐私保护和统计分析而设计。通过结合同态加密（FHEVM）、分布式存储（IPFS）和以太坊测试网（Sepolia），为医疗数据分析提供了一个安全、透明且不可篡改的解决方案。

### 🎯 核心特性

- **🔐 隐私保护**: 使用同态加密技术保护患者敏感数据
- **📊 数据分析**: 提供多种统计分析方法（描述性统计、回归分析、相关性分析等）
- **🌐 去中心化**: 基于区块链和 IPFS 的分布式架构
- **📱 用户友好**: 现代化的 Web 界面，支持响应式设计
- **🔒 数据完整性**: 通过区块链确保数据不可篡改
- **📈 实时可视化**: 动态图表展示分析结果

## 🏗️ 技术架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   IPFS          │
│   (Next.js)     │◄──►│   Contract      │◄──►│   Storage       │
│                 │    │   (FHEVM)       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Sepolia       │◄─────────────┘
                        │   Testnet       │
                        └─────────────────┘
```

### 技术栈

- **前端**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **智能合约**: Solidity, FHEVM (同态加密)
- **区块链**: Sepolia 测试网
- **存储**: IPFS (Filebase)
- **数据可视化**: Recharts
- **开发工具**: Hardhat, ESLint, TypeScript

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### 1. 克隆项目

```bash
git clone <repository-url>
cd diabetes-fhe-dapp
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 3. 环境配置

创建环境变量文件：

```bash
# 根目录 .env
cp .env.example .env

# 前端目录 .env.local
cd frontend
cp .env.local.example .env.local
```

配置必要的环境变量：

**根目录 `.env`:**
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**前端 `frontend/.env.local`:**
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
NEXT_PUBLIC_FILEBASE_GATEWAY=https://ipfs.filebase.io/ipfs/

# Filebase IPFS 配置 (可选)
FILEBASE_ACCESS_KEY=your_filebase_access_key
FILEBASE_SECRET_KEY=your_filebase_secret_key
```

### 4. 部署智能合约

```bash
# 编译合约
npm run compile

# 部署到 Sepolia 测试网
npm run deploy
```

### 5. 启动前端应用

```bash
# 启动开发服务器
npm run dev

# 或者直接在前端目录启动
cd frontend
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📖 使用指南

### 患者数据提交

1. **连接钱包**: 点击"连接钱包"按钮连接 MetaMask
2. **填写问卷**: 完成糖尿病相关健康问卷
3. **数据加密**: 系统自动使用同态加密保护您的数据
4. **上链存储**: 加密数据存储到 IPFS 并记录到区块链

### 数据分析查看

1. **选择分析类型**: 
   - 描述性统计分析
   - 单因素分析
   - Logistic 回归分析
   - 线性回归分析
   - 分层分析
   - 相关性分析

2. **查看结果**: 
   - 交互式图表展示
   - 统计指标说明
   - 分析洞察建议

### 管理员功能

1. **数据概览**: 查看总体数据统计
2. **IPFS 调试**: 检查存储状态
3. **合约交互**: 管理智能合约

## 🔧 开发指南

### 项目结构

```
diabetes-fhe-dapp/
├── contracts/                 # 智能合约
│   └── DiabetesAnalytics.sol
├── frontend/                  # 前端应用
│   ├── components/           # React 组件
│   ├── pages/               # Next.js 页面
│   ├── services/            # 服务层
│   ├── contexts/            # React Context
│   └── config/              # 配置文件
├── scripts/                  # 部署脚本
├── artifacts/               # 编译产物
└── README.md
```

### 主要组件

- **AnalyticsChart.js**: 数据可视化组件
- **DiabetesSurvey.js**: 患者问卷组件
- **Layout.js**: 应用布局组件
- **ipfsService.js**: IPFS 存储服务
- **contractService.js**: 智能合约交互服务

### 开发命令

```bash
# 编译智能合约
npm run compile

# 运行测试
npm run test

# 部署合约
npm run deploy

# 启动前端开发服务器
npm run dev

# 构建前端生产版本
npm run build

# 代码检查
cd frontend && npm run lint
```

## 🔒 隐私与安全

### 数据保护机制

1. **同态加密**: 使用 FHEVM 对敏感数据进行加密
2. **匿名化**: 患者身份信息完全匿名
3. **去中心化存储**: IPFS 分布式存储防止单点故障
4. **不可篡改**: 区块链确保数据完整性

### 安全最佳实践

- 私钥安全存储，不要泄露给他人
- 定期备份钱包和重要数据
- 仅在测试网络使用测试代币
- 验证合约地址的正确性

## 🌐 网络配置

### Sepolia 测试网配置

```javascript
// MetaMask 网络配置
Network Name: Sepolia Test Network
RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://sepolia.etherscan.io
```

### 获取测试代币

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)

## 📊 数据分析功能

### 支持的分析类型

1. **描述性统计**: 均值、标准差、分布情况
2. **单因素分析**: 血糖水平分布分析
3. **回归分析**: 影响因素识别和预测
4. **相关性分析**: 变量间关系分析
5. **分层分析**: 按人群特征分组分析

### 可视化图表

- 柱状图 (Bar Chart)
- 饼图 (Pie Chart)
- 折线图 (Line Chart)
- 面积图 (Area Chart)
- 散点图 (Scatter Plot)

## 🤝 贡献指南

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 React/Next.js 最佳实践
- 编写清晰的注释和文档
- 确保测试通过

## 🐛 故障排除

### 常见问题

**Q: 前端启动时出现 "Cannot find module 'next/babel'" 错误**
```bash
# 解决方案：清理缓存并重新安装依赖
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Q: 智能合约部署失败**
```bash
# 检查网络配置和私钥设置
# 确保有足够的测试 ETH
# 验证 RPC URL 是否正确
```

**Q: IPFS 上传失败**
```bash
# 检查 Filebase 配置
# 验证 API 密钥是否正确
# 确保网络连接正常
```

### 获取帮助

- 查看 [Issues](../../issues) 页面
- 阅读项目文档
- 联系开发团队

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [FHEVM](https://github.com/zama-ai/fhevm) - 同态加密虚拟机
- [IPFS](https://ipfs.io/) - 分布式存储网络
- [Next.js](https://nextjs.org/) - React 框架
- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [Recharts](https://recharts.org/) - 数据可视化库

## 📞 联系我们

- 项目主页: [GitHub Repository](../../)
- 问题反馈: [Issues](../../issues)
- 邮箱: developer@example.com

---

**⚠️ 免责声明**: 本项目仅用于教育和研究目的。在生产环境中使用前，请进行充分的安全审计和测试。医疗数据处理需要遵循相关法律法规。