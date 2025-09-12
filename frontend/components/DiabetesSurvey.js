import { useState } from 'react'
import { motion } from 'framer-motion'
import filebaseService from '../services/filebaseService'
import { 
  User, 
  Heart, 
  Activity, 
  Calendar, 
  Pill, 
  Scale, 
  Droplets,
  Clock,
  FileText,
  Send,
  Shield
} from 'lucide-react'

export default function DiabetesSurvey({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    // 基本信息
    age: '',
    gender: '',
    height: '',
    weight: '',
    
    // 糖尿病相关
    diabetesType: '',
    diagnosisYear: '',
    bloodSugar: '',
    hba1c: '',
    
    // 生活方式
    exercise: '',
    diet: '',
    smoking: '',
    alcohol: '',
    
    // 治疗情况
    medication: '',
    insulin: '',
    complications: '',
    
    // 其他
    familyHistory: '',
    notes: ''
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // 基本信息验证
    if (!formData.age) newErrors.age = '请输入年龄'
    if (!formData.gender) newErrors.gender = '请选择性别'
    if (!formData.height) newErrors.height = '请输入身高'
    if (!formData.weight) newErrors.weight = '请输入体重'

    // 糖尿病相关验证
    if (!formData.diabetesType) newErrors.diabetesType = '请选择糖尿病类型'
    if (!formData.diagnosisYear && formData.diabetesType !== '无') {
      newErrors.diagnosisYear = '请输入确诊年份'
    }
    if (!formData.bloodSugar) {
      newErrors.bloodSugar = '请输入血糖值'
    } else if (parseFloat(formData.bloodSugar) < 0) {
      newErrors.bloodSugar = '血糖值不能为负数'
    }

    // 生活方式验证
    if (!formData.exercise) newErrors.exercise = '请选择运动频率'
    if (!formData.diet) newErrors.diet = '请选择饮食控制情况'
    if (!formData.smoking) newErrors.smoking = '请选择吸烟情况'
    if (!formData.alcohol) newErrors.alcohol = '请选择饮酒情况'

    // 治疗情况验证
    if (!formData.insulin) newErrors.insulin = '请选择胰岛素使用情况'
    if (!formData.familyHistory) newErrors.familyHistory = '请选择家族病史情况'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // 获取钱包地址
        const walletAddress = window.ethereum?.selectedAddress || 'demo-address'
        
        // 上传到IPFS
        console.log('🔄 正在上传数据到IPFS...')
        const result = await ipfsService.submitPatientRecord(walletAddress, formData)
        
        if (result.success) {
          console.log('✅ IPFS上传成功:', result)
          alert(`${result.message}
患者ID: ${result.patientId}
IPFS CID: ${result.cid}`)
          
          // 调用原始的onSubmit回调
          onSubmit({
            ...formData,
            patientId: result.patientId,
            ipfsCid: result.cid,
            walletAddress
          })
        } else {
          console.error('❌ IPFS上传失败:', result.error)
          alert('数据上传失败: ' + result.error)
        }
      } catch (error) {
        console.error('❌ 提交过程中发生错误:', error)
        alert('提交失败: ' + error.message)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">糖尿病健康调查问卷</h2>
        <p className="text-gray-600">请如实填写以下信息，所有数据将被加密保护</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">基本信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年龄 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="请输入年龄"
                className={`input-field ${errors.age ? 'border-red-500' : ''}`}
                min="1"
                max="120"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别 <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身高 (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="请输入身高"
                className={`input-field ${errors.height ? 'border-red-500' : ''}`}
                min="50"
                max="250"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                体重 (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="请输入体重"
                className={`input-field ${errors.weight ? 'border-red-500' : ''}`}
                min="20"
                max="300"
                step="0.1"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>
        </motion.div>

        {/* 糖尿病相关信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-800">糖尿病相关信息</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                糖尿病类型 <span className="text-red-500">*</span>
              </label>
              <select
                name="diabetesType"
                value={formData.diabetesType}
                onChange={handleInputChange}
                className={`input-field ${errors.diabetesType ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="none">无</option>
                <option value="type1">1型糖尿病</option>
                <option value="type2">2型糖尿病</option>
                <option value="gestational">妊娠糖尿病</option>
                <option value="other">其他类型</option>
              </select>
              {errors.diabetesType && <p className="text-red-500 text-sm mt-1">{errors.diabetesType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确诊年份 {formData.diabetesType !== '无' && <span className="text-red-500">*</span>}
                {formData.diabetesType === '无' && <span className="text-gray-500">（选填）</span>}
              </label>
              <input
                type="number"
                name="diagnosisYear"
                value={formData.diagnosisYear}
                onChange={handleInputChange}
                placeholder={formData.diabetesType === '无' ? "无糖尿病可不填" : "请输入确诊年份"}
                min="1950"
                max={new Date().getFullYear()}
                className={`input-field ${errors.diagnosisYear ? 'border-red-500' : ''}`}
                required={formData.diabetesType !== '无'}
              />
              {errors.diagnosisYear && <p className="text-red-500 text-sm mt-1">{errors.diagnosisYear}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最近血糖值 (mg/dL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bloodSugar"
                value={formData.bloodSugar}
                onChange={handleInputChange}
                placeholder="请输入血糖值"
                className={`input-field ${errors.bloodSugar ? 'border-red-500' : ''}`}
                min="0"
                step="0.1"
              />
              {errors.bloodSugar && <p className="text-red-500 text-sm mt-1">{errors.bloodSugar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                糖化血红蛋白 (HbA1c) %
              </label>
              <input
                type="number"
                name="hba1c"
                value={formData.hba1c}
                onChange={handleInputChange}
                placeholder="请输入HbA1c值（选填）"
                step="0.1"
                min="0"
                max="20"
                className="input-field"
              />
            </div>
          </div>
        </motion.div>

        {/* 生活方式 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800">生活方式</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                运动频率 <span className="text-red-500">*</span>
              </label>
              <select
                name="exercise"
                value={formData.exercise}
                onChange={handleInputChange}
                className={`input-field ${errors.exercise ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="never">从不运动</option>
                <option value="rarely">偶尔运动</option>
                <option value="weekly">每周1-2次</option>
                <option value="regular">每周3-4次</option>
                <option value="daily">每天运动</option>
              </select>
              {errors.exercise && <p className="text-red-500 text-sm mt-1">{errors.exercise}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                饮食控制 <span className="text-red-500">*</span>
              </label>
              <select
                name="diet"
                value={formData.diet}
                onChange={handleInputChange}
                className={`input-field ${errors.diet ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="strict">严格控制</option>
                <option value="moderate">适度控制</option>
                <option value="loose">偶尔控制</option>
                <option value="none">不控制</option>
              </select>
              {errors.diet && <p className="text-red-500 text-sm mt-1">{errors.diet}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                吸烟情况 <span className="text-red-500">*</span>
              </label>
              <select
                name="smoking"
                value={formData.smoking}
                onChange={handleInputChange}
                className={`input-field ${errors.smoking ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="never">从不吸烟</option>
                <option value="former">已戒烟</option>
                <option value="occasional">偶尔吸烟</option>
                <option value="regular">经常吸烟</option>
              </select>
              {errors.smoking && <p className="text-red-500 text-sm mt-1">{errors.smoking}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                饮酒情况 <span className="text-red-500">*</span>
              </label>
              <select
                name="alcohol"
                value={formData.alcohol}
                onChange={handleInputChange}
                className={`input-field ${errors.alcohol ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="never">从不饮酒</option>
                <option value="occasional">偶尔饮酒</option>
                <option value="moderate">适量饮酒</option>
                <option value="heavy">经常饮酒</option>
              </select>
              {errors.alcohol && <p className="text-red-500 text-sm mt-1">{errors.alcohol}</p>}
            </div>
          </div>
        </motion.div>

        {/* 治疗情况 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-purple-50 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Pill className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-800">治疗情况</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目前用药
              </label>
              <textarea
                name="medication"
                value={formData.medication}
                onChange={handleInputChange}
                placeholder="请详细描述目前使用的药物（选填）"
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                胰岛素使用情况 <span className="text-red-500">*</span>
              </label>
              <select
                name="insulin"
                value={formData.insulin}
                onChange={handleInputChange}
                className={`input-field ${errors.insulin ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="none">不使用</option>
                <option value="short">短效胰岛素</option>
                <option value="long">长效胰岛素</option>
                <option value="mixed">混合胰岛素</option>
                <option value="pump">胰岛素泵</option>
              </select>
              {errors.insulin && <p className="text-red-500 text-sm mt-1">{errors.insulin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                并发症情况
              </label>
              <textarea
                name="complications"
                value={formData.complications}
                onChange={handleInputChange}
                placeholder="请描述是否有糖尿病相关并发症（选填）"
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                家族病史 <span className="text-red-500">*</span>
              </label>
              <select
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleInputChange}
                className={`input-field ${errors.familyHistory ? 'border-red-500' : ''}`}
              >
                <option value="">请选择</option>
                <option value="none">无家族史</option>
                <option value="parents">父母有糖尿病</option>
                <option value="siblings">兄弟姐妹有糖尿病</option>
                <option value="grandparents">祖父母有糖尿病</option>
                <option value="multiple">多位家属有糖尿病</option>
              </select>
              {errors.familyHistory && <p className="text-red-500 text-sm mt-1">{errors.familyHistory}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                其他备注
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="请补充其他相关信息（选填）"
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* 提交按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`
              flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors text-lg
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>提交中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>提交问卷</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">隐私保护承诺</h4>
            <p className="text-sm text-blue-700">
              您的所有健康数据将使用最先进的同态加密技术进行保护，确保数据在传输和存储过程中始终保持加密状态。
              我们承诺不会泄露您的个人隐私信息，所有数据仅用于医学研究目的。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}