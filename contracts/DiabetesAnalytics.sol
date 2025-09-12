// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DiabetesAnalytics
 * @dev 糖尿病患者匿名统计分析合约 - 简化版本
 * 支持加密血糖数据上传和聚合分析（使用模拟加密）
 */
contract DiabetesAnalytics {
    // 事件定义
    event DataSubmitted(address indexed patient, string ipfsCid, uint256 timestamp);
    event AnalysisRequested(address indexed researcher, uint256 requestId);
    event AnalysisCompleted(uint256 indexed requestId, string resultCid);

    // 数据结构
    struct PatientData {
        bytes encryptedBloodGlucose;  // 加密的血糖值数据
        bytes encryptionProof;        // 加密证明
        uint256 timestamp;            // 时间戳
        string ipfsCid;               // IPFS 存储的原始数据 CID
        string loincCode;             // LOINC 代码 (2345-7 for glucose)
        bool isActive;                // 数据是否有效
    }

    struct AnalysisRequest {
        address researcher;      // 研究员地址
        uint256 timestamp;       // 请求时间
        bool completed;          // 是否完成
        string resultCid;        // 结果 IPFS CID
        uint256 fee;             // 分析费用
        uint8 analysisType;      // 分析类型
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

    constructor() {
        owner = msg.sender;
        nextRequestId = 1;

        // 初始化一些授权研究员（示例）
        authorizedResearchers[msg.sender] = true;
    }

    /**
     * @dev 患者提交加密血糖数据
     * @param encryptedGlucose 加密的血糖值数据
     * @param inputProof 加密证明
     * @param ipfsCid IPFS 存储的原始数据 CID
     * @param loincCode LOINC 代码
     */
    function submitPatientData(
        bytes calldata encryptedGlucose,
        bytes calldata inputProof,
        string calldata ipfsCid,
        string calldata loincCode
    ) external {
        require(bytes(ipfsCid).length > 0, "IPFS CID cannot be empty");
        require(encryptedGlucose.length > 0, "Encrypted data cannot be empty");

        // 存储患者数据
        PatientData memory newData = PatientData({
            encryptedBloodGlucose: encryptedGlucose,
            encryptionProof: inputProof,
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
     * @param analysisType 分析类型 (0: 描述性统计, 1: 单因素分析, 2: Logistic回归, 3: 线性回归, 4: 分层分析, 5: 相关性分析)
     */
    function requestAnalysis(uint8 analysisType) external payable onlyAuthorizedResearcher {
        require(msg.value >= analysisFeeBasis, "Insufficient fee for analysis");
        require(totalSubmissions > 0, "No data available for analysis");
        require(analysisType <= 5, "Invalid analysis type");

        uint256 requestId = nextRequestId++;

        analysisRequests[requestId] = AnalysisRequest({
            researcher: msg.sender,
            timestamp: block.timestamp,
            completed: false,
            resultCid: "",
            fee: msg.value,
            analysisType: analysisType
        });

        emit AnalysisRequested(msg.sender, requestId);

        // 模拟分析完成（在实际应用中，这会由预言机或后台服务完成）
        _completeAnalysis(requestId, analysisType);
    }

    /**
     * @dev 完成分析（模拟）
     */
    function _completeAnalysis(uint256 requestId, uint8 analysisType) private {
        string memory resultCid;
        
        if (analysisType == 0) {
            resultCid = "QmDescriptiveAnalysisResult123";
        } else if (analysisType == 1) {
            resultCid = "QmUnivariateAnalysisResult456";
        } else if (analysisType == 2) {
            resultCid = "QmLogisticRegressionResult789";
        } else if (analysisType == 3) {
            resultCid = "QmLinearRegressionResultABC";
        } else if (analysisType == 4) {
            resultCid = "QmStratifiedAnalysisResultDEF";
        } else {
            resultCid = "QmCorrelationAnalysisResultGHI";
        }

        analysisRequests[requestId].completed = true;
        analysisRequests[requestId].resultCid = resultCid;

        emit AnalysisCompleted(requestId, resultCid);
    }

    // ------------ Getter 函数 ------------

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

    function getPatientData(address patient, uint256 index) external view returns (
        bytes memory encryptedBloodGlucose,
        bytes memory encryptionProof,
        uint256 timestamp,
        string memory ipfsCid,
        string memory loincCode,
        bool isActive
    ) {
        require(index < patientSubmissions[patient].length, "Index out of bounds");
        PatientData storage data = patientSubmissions[patient][index];
        
        return (
            data.encryptedBloodGlucose,
            data.encryptionProof,
            data.timestamp,
            data.ipfsCid,
            data.loincCode,
            data.isActive
        );
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

    function getAllPatients() external view returns (address[] memory) {
        return allPatients;
    }

    function isAuthorizedResearcher(address researcher) external view returns (bool) {
        return authorizedResearchers[researcher];
    }

    function getAnalysisFee() external view returns (uint256) {
        return analysisFeeBasis;
    }

    // ------------ 管理函数 ------------

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

    function deactivatePatientData(address patient, uint256 index) external onlyOwner {
        require(index < patientSubmissions[patient].length, "Index out of bounds");
        patientSubmissions[patient][index].isActive = false;
    }

    // 手动完成分析（管理员功能）
    function completeAnalysis(uint256 requestId, string calldata resultCid) external onlyOwner {
        require(requestId < nextRequestId, "Invalid request ID");
        require(!analysisRequests[requestId].completed, "Analysis already completed");
        
        analysisRequests[requestId].completed = true;
        analysisRequests[requestId].resultCid = resultCid;

        emit AnalysisCompleted(requestId, resultCid);
    }

    // 获取最近的分析请求
    function getRecentAnalysisRequests(uint256 limit) external view returns (uint256[] memory) {
        uint256 totalRequests = nextRequestId - 1;
        uint256 returnCount = limit > totalRequests ? totalRequests : limit;
        uint256[] memory recentRequests = new uint256[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recentRequests[i] = totalRequests - i;
        }
        
        return recentRequests;
    }

    // 获取患者最新数据
    function getLatestPatientData(address patient) external view returns (
        bytes memory encryptedBloodGlucose,
        uint256 timestamp,
        string memory ipfsCid
    ) {
        require(patientSubmissions[patient].length > 0, "No data for patient");
        PatientData storage latest = patientSubmissions[patient][patientSubmissions[patient].length - 1];
        
        return (
            latest.encryptedBloodGlucose,
            latest.timestamp,
            latest.ipfsCid
        );
    }

    // 接收 ETH 转账
    receive() external payable {}
}