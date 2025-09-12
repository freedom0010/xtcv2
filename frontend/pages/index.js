import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { 
  Activity, 
  Shield, 
  BarChart3, 
  Users, 
  Lock, 
  Zap,
  ArrowRight,
  Heart,
  Database,
  Globe
} from 'lucide-react'
import Layout from '../components/Layout'
import { useWallet } from '../contexts/WalletContext'

export default function Home() {
  const router = useRouter()
  const { account, connectWallet } = useWallet()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSubmissions: 0,
    totalAnalyses: 0
  })

  const features = [
    {
      icon: Shield,
      title: "完全隐私保护",
      description: "使用 FHEVM 同态加密技术，确保患者数据在计算过程中始终保持加密状态",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "智能统计分析",
      description: "支持平均值计算、分布统计、趋势分析等多种统计方法",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Database,
      title: "去中心化存储",
      description: "原始数据存储在 IPFS 网络，链上仅保存加密结果和访问凭证",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Globe,
      title: "全球可访问",
      description: "部署在 Sepolia 测试网，全球研究机构都可以参与数据分析",
      color: "from-orange-500 to-red-500"
    }
  ]

  const handleRoleSelection = async (role) => {
    if (!account) {
      await connectWallet()
    }
    
    if (role === 'patient') {
      router.push('/patient')
    } else {
      router.push('/researcher')
    }
  }

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient">糖尿病</span>
                <br />
                <span className="text-gray-800">匿名统计分析平台</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                基于 <span className="font-semibold text-blue-600">FHEVM</span> 同态加密技术，
                为糖尿病患者提供完全隐私保护的数据统计分析服务
              </p>
            </motion.div>

        
       

            {/* 角色选择 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="medical-card cursor-pointer group"
                onClick={() => handleRoleSelection('patient')}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">健康数据管理</h3>
                  <p className="text-gray-600 mb-6">
                    完成综合健康调查问卷，安全上传您的健康数据，为医学研究贡献力量
                  </p>
                  <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                    开始健康调查 <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="medical-card cursor-pointer group"
                onClick={() => handleRoleSelection('researcher')}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">研究员端</h3>
                  <p className="text-gray-600 mb-6">
                    运行统计分析，获取聚合数据洞察，推动糖尿病医学研究进展
                  </p>
                  <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-teal-600 transition-colors">
                    开始数据分析 <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                核心技术特性
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                结合最新的区块链和密码学技术，为医疗数据分析提供前所未有的隐私保护
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="card text-center group hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                技术架构
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                采用业界领先的 Web3 技术栈，确保系统的安全性、可扩展性和去中心化特性
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "FHEVM", desc: "同态加密虚拟机" },
                { name: "IPFS", desc: "去中心化存储" },
                { name: "Sepolia", desc: "以太坊测试网" },
                { name: "Next.js", desc: "现代前端框架" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-blue-600 mb-2">{tech.name}</div>
                  <div className="text-gray-600 text-sm">{tech.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                加入我们，推动医学研究进步
              </h2>
              <p className="text-xl mb-8 opacity-90">
                无论您是患者还是研究员，都可以在保护隐私的前提下为糖尿病研究贡献力量
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !account ? connectWallet() : null}
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full text-lg hover:shadow-xl transition-all duration-300"
              >
                {account ? '已连接钱包' : '连接钱包开始'}
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  )
}