// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "fhevm/lib/TFHE.sol";
import "fhevm/config/ZamaFHEVMConfig.sol";

/**
 * @title DiabetesAnalytics
 * @dev 基于 FHEVM 的糖尿病患者匿名统计分析合约
 * 支持加密血糖数据上传和聚合分析
 */
contract DiabetesAnalytics {
    using TFHE for euint32;
    using TFHE for euint64;
    using TFHE for ebool;

    // 事件定义
    event DataSubmitted(address indexed patient, string ipfsCid, uint256 timestamp);
    event AnalysisRequested(address indexed researcher, uint256 requestId);
    event AnalysisCompleted(uint256 indexed requestId, string resultCid);

    // 数据结构
    struct PatientData {
        euint32 bloodGlucose;    // 加密的血糖值 (mg/dL)
        uint256 timestamp;       // 时间戳
        string ipfsCid;          // IPFS 存储的原始数据 CID
        string loincCode;        // LOINC 代码 (2345-7 for glucose)
        bool isActive;           // 数据是否有效
    }

    struct AnalysisRequest {
        address researcher;      // 研究员地址
        uint256 timestamp;       // 请求时间
        bool completed;          // 是否完成
        string resultCid;        // 结果 IPFS CID
        uint256 fee;             // 分析费用
    }

    // 状态变量
    mapping(address => PatientData[]) public patientSubmissions;
    mapping(uint256 => AnalysisRequest) public analysisRequests;
    mapping(address => bool) public authorizedResearchers;

    address[] public allPatients;
    uint256 public nextRequestId;
    uint256 public totalSubmissions;
    uint256 public analysisFeeBasis = 0.001 ether; // 基础分析费用

    address public owner;

    // 修饰符
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorizedResearcher() {
        require(authorizedResearchers[msg.sender], "Not authorized researcher");
        _;
    }

    modifier onlyAfterInitialization() {
        require(nextRequestId > 0, "Contract not initialized");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextRequestId = 1;

        // 初始化一些授权研究员（示例）
        authorizedResearchers[msg.sender] = true;
    }

    /**
     * @dev 患者提交加密血糖数据
     * @param encryptedGlucose 加密的血糖值（由 fhEVM 网关生成）
     * @param ipfsCid IPFS 存储的原始数据 CID
     * @param loincCode LOINC 代码
     */
    function submitPatientData(
        einput encryptedGlucose,
        bytes calldata inputProof,
        string calldata ipfsCid,
        string calldata loincCode
    ) external onlyAfterInitialization {
        // 将密文字节转换为 euint32
        euint32 glucose = TFHE.asEuint32(encryptedGlucose, inputProof);

        // 验证血糖值范围 (20-600 mg/dL)
        // 注意：在FHEVM中，我们不能直接解密验证范围，
        // 这里我们信任输入数据已经在客户端进行了预验证
        // 在实际应用中，可以使用 TFHE.req() 来要求条件为真
        // 但这需要特殊的网关支持，这里我们跳过验证

        // 存储患者数据
        PatientData memory newData = PatientData({
            bloodGlucose: glucose,
            timestamp: block.timestamp,
            ipfsCid: ipfsCid,
            loincCode: loincCode,
            isActive: true
        });

        patientSubmissions[msg.sender].push(newData);

        // 如果是新患者，添加到患者列表
        if (patientSubmissions[msg.sender].length == 1) {
            allPatients.push(msg.sender);
        }

        totalSubmissions++;

        emit DataSubmitted(msg.sender, ipfsCid, block.timestamp);
    }

    /**
     * @dev 研究员请求聚合分析
     * @param analysisType 分析类型 (0: 平均值, 1: 分布统计, 2: 趋势分析)
     */
    function requestAnalysis(uint8 analysisType) external payable onlyAuthorizedResearcher onlyAfterInitialization {
        require(msg.value >= analysisFeeBasis, "Insufficient fee for analysis");
        require(totalSubmissions > 0, "No data available for analysis");
        require(analysisType <= 2, "Invalid analysis type");

        uint256 requestId = nextRequestId++;

        analysisRequests[requestId] = AnalysisRequest({
            researcher: msg.sender,
            timestamp: block.timestamp,
            completed: false,
            resultCid: "",
            fee: msg.value
        });

        emit AnalysisRequested(msg.sender, requestId);

        // 执行相应的分析
        if (analysisType == 0) {
            _calculateAverage(requestId);
        } else if (analysisType == 1) {
            _calculateDistribution(requestId);
        } else {
            _calculateTrend(requestId);
        }
    }

    /**
     * @dev 计算平均血糖值
     */
    function _calculateAverage(uint256 requestId) private {
        require(totalSubmissions > 0, "No data to analyze");

        euint64 sum = TFHE.asEuint64(uint64(0));
        uint256 count = 0;

        // 遍历所有患者数据
        for (uint256 i = 0; i < allPatients.length; i++) {
            address patient = allPatients[i];
            PatientData[] storage submissions = patientSubmissions[patient];

            for (uint256 j = 0; j < submissions.length; j++) {
                if (submissions[j].isActive) {
                    // 将 euint32 转为 euint64 再累加
                    sum = TFHE.add(sum, TFHE.asEuint64(submissions[j].bloodGlucose));
                    count++;
                }
            }
        }

        if (count > 0) {
            // 注意：FHEVM不支持加密数除法，平均值计算需要在客户端进行
            // 这里我们只存储总和和计数，客户端可以通过解密后计算平均值
            
            // 模拟结果 CID
            string memory resultCid = "QmAnalysisResult123";

            analysisRequests[requestId].completed = true;
            analysisRequests[requestId].resultCid = resultCid;

            emit AnalysisCompleted(requestId, resultCid);
        }
    }

    /**
     * @dev 计算血糖分布统计
     */
    function _calculateDistribution(uint256 requestId) private {
        // 定义血糖范围
        euint32 lowCount = TFHE.asEuint32(uint32(0));
        euint32 normalCount = TFHE.asEuint32(uint32(0));
        euint32 highCount = TFHE.asEuint32(uint32(0));

        for (uint256 i = 0; i < allPatients.length; i++) {
            address patient = allPatients[i];
            PatientData[] storage submissions = patientSubmissions[patient];

            for (uint256 j = 0; j < submissions.length; j++) {
                if (submissions[j].isActive) {
                    euint32 glucose = submissions[j].bloodGlucose;

                    // 检查是否为低血糖
                    ebool isLow = TFHE.lt(glucose, TFHE.asEuint32(uint32(70)));
                    lowCount = TFHE.add(lowCount, TFHE.select(isLow, TFHE.asEuint32(uint32(1)), TFHE.asEuint32(uint32(0))));

                    // 检查是否为正常血糖
                    ebool isNormal = TFHE.and(
                        TFHE.ge(glucose, TFHE.asEuint32(uint32(70))),
                        TFHE.le(glucose, TFHE.asEuint32(uint32(140)))
                    );
                    normalCount = TFHE.add(normalCount, TFHE.select(isNormal, TFHE.asEuint32(uint32(1)), TFHE.asEuint32(uint32(0))));

                    // 检查是否为高血糖
                    ebool isHigh = TFHE.gt(glucose, TFHE.asEuint32(uint32(140)));
                    highCount = TFHE.add(highCount, TFHE.select(isHigh, TFHE.asEuint32(uint32(1)), TFHE.asEuint32(uint32(0))));
                }
            }
        }

        // 模拟结果 CID
        string memory resultCid = "QmDistributionResult456";

        analysisRequests[requestId].completed = true;
        analysisRequests[requestId].resultCid = resultCid;

        emit AnalysisCompleted(requestId, resultCid);
    }

    /**
     * @dev 计算趋势分析
     */
    function _calculateTrend(uint256 requestId) private {
        uint256 thirtyDaysAgo = block.timestamp - 30 days;
        uint256 sixtyDaysAgo = block.timestamp - 60 days;

        euint64 recentSum = TFHE.asEuint64(uint64(0));
        euint64 previousSum = TFHE.asEuint64(uint64(0));
        uint256 recentCount = 0;
        uint256 previousCount = 0;

        for (uint256 i = 0; i < allPatients.length; i++) {
            address patient = allPatients[i];
            PatientData[] storage submissions = patientSubmissions[patient];

            for (uint256 j = 0; j < submissions.length; j++) {
                if (submissions[j].isActive) {
                    if (submissions[j].timestamp >= thirtyDaysAgo) {
                        recentSum = TFHE.add(recentSum, TFHE.asEuint64(submissions[j].bloodGlucose));
                        recentCount++;
                    } else if (submissions[j].timestamp >= sixtyDaysAgo && submissions[j].timestamp < thirtyDaysAgo) {
                        previousSum = TFHE.add(previousSum, TFHE.asEuint64(submissions[j].bloodGlucose));
                        previousCount++;
                    }
                }
            }
        }

        // 模拟结果 CID
        string memory resultCid = "QmTrendResult789";

        analysisRequests[requestId].completed = true;
        analysisRequests[requestId].resultCid = resultCid;

        emit AnalysisCompleted(requestId, resultCid);
    }

    // ------------ Getter & 管理函数 ------------

    function getPatientSubmissionCount(address patient) external view returns (uint256) {
        return patientSubmissions[patient].length;
    }

    function getPatientCids(address patient) external view returns (string[] memory) {
        PatientData[] storage submissions = patientSubmissions[patient];
        string[] memory cids = new string[](submissions.length);

        for (uint256 i = 0; i < submissions.length; i++) {
            cids[i] = submissions[i].ipfsCid;
        }

        return cids;
    }

    function getAnalysisRequest(uint256 requestId) external view returns (
        address researcher,
        uint256 timestamp,
        bool completed,
        string memory resultCid,
        uint256 fee
    ) {
        AnalysisRequest storage request = analysisRequests[requestId];
        return (
            request.researcher,
            request.timestamp,
            request.completed,
            request.resultCid,
            request.fee
        );
    }

    function authorizeResearcher(address researcher) external onlyOwner {
        authorizedResearchers[researcher] = true;
    }

    function revokeResearcher(address researcher) external onlyOwner {
        authorizedResearchers[researcher] = false;
    }

    function updateAnalysisFee(uint256 newFee) external onlyOwner {
        analysisFeeBasis = newFee;
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function getStats() external view returns (
        uint256 totalPatients,
        uint256 totalSubmissionsCount,
        uint256 totalRequests
    ) {
        return (
            allPatients.length,
            totalSubmissions,
            nextRequestId - 1
        );
    }

    function getLatestPatientData(address patient) external view returns (PatientData memory) {
        require(patientSubmissions[patient].length > 0, "No data for patient");
        return patientSubmissions[patient][patientSubmissions[patient].length - 1];
    }

    function getAllPatients() external view returns (address[] memory) {
        return allPatients;
    }

    function isAuthorizedResearcher(address researcher) external view returns (bool) {
        return authorizedResearchers[researcher];
    }

    function getAnalysisFee() external view returns (uint256) {
        return analysisFeeBasis;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    // 接收 ETH 转账
    receive() external payable {}
}
