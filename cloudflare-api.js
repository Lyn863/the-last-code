// Cloudflare API 客户端
// 用于替换Firebase数据存储功能

class CloudflareAPI {
    constructor(apiUrl) {
        this.apiUrl = apiUrl || 'https://personality-test-api.[您的workers子域名].workers.dev';
    }

    // 保存测试结果
    async saveTestResult(result) {
        try {
            const response = await fetch(`${this.apiUrl}/api/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('保存测试结果时出错:', error);
            throw error;
        }
    }

    // 获取所有测试结果
    async getAllTestResults() {
        try {
            const response = await fetch(`${this.apiUrl}/api/stats`);
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || '获取数据失败');
            }
        } catch (error) {
            console.error('获取测试结果时出错:', error);
            throw error;
        }
    }

    // 获取统计数据
    async getStatistics() {
        try {
            const results = await this.getAllTestResults();
            
            // 计算总测试数
            const totalTests = results.length;
            
            // 计算人格类型分布
            const typeCounts = {};
            results.forEach(result => {
                if (result.personalityType) {
                    typeCounts[result.personalityType] = (typeCounts[result.personalityType] || 0) + 1;
                }
            });
            
            // 计算维度平均分
            const dimensionScores = { E: 0, O: 0, A: 0, C: 0, N: 0 };
            let validScoreCount = 0;
            
            results.forEach(result => {
                if (result.scores) {
                    Object.keys(dimensionScores).forEach(dim => {
                        if (result.scores[dim]) {
                            dimensionScores[dim] += result.scores[dim];
                        }
                    });
                    validScoreCount++;
                }
            });
            
            // 计算平均分
            const avgScores = {};
            if (validScoreCount > 0) {
                Object.keys(dimensionScores).forEach(dim => {
                    avgScores[dim] = Math.round((dimensionScores[dim] / validScoreCount) * 10) / 10;
                });
            }
            
            return {
                totalTests,
                typeCounts,
                avgScores,
                results
            };
        } catch (error) {
            console.error('计算统计数据时出错:', error);
            throw error;
        }
    }

    // 获取用户信息统计
    async getUserInfoStats() {
        try {
            const results = await this.getAllTestResults();
            
            const stats = {
                educationStage: {},
                testFrequency: {},
                testPurpose: {},
                mbti: {}
            };
            
            results.forEach(result => {
                if (result.userInfo) {
                    // 统计学业阶段
                    if (result.userInfo.educationStage) {
                        stats.educationStage[result.userInfo.educationStage] = 
                            (stats.educationStage[result.userInfo.educationStage] || 0) + 1;
                    }
                    
                    // 统计测试频率
                    if (result.userInfo.testFrequency) {
                        stats.testFrequency[result.userInfo.testFrequency] = 
                            (stats.testFrequency[result.userInfo.testFrequency] || 0) + 1;
                    }
                    
                    // 统计测试目的
                    if (result.userInfo.testPurpose) {
                        stats.testPurpose[result.userInfo.testPurpose] = 
                            (stats.testPurpose[result.userInfo.testPurpose] || 0) + 1;
                    }
                    
                    // 统计MBTI类型
                    if (result.userInfo.mbti && result.userInfo.mbti !== '不知道/不确定') {
                        stats.mbti[result.userInfo.mbti] = 
                            (stats.mbti[result.userInfo.mbti] || 0) + 1;
                    }
                }
            });
            
            return stats;
        } catch (error) {
            console.error('获取用户信息统计时出错:', error);
            throw error;
        }
    }
}

// 使用示例
// const api = new CloudflareAPI('https://your-worker-url.workers.dev');
// 
// // 保存测试结果
// const testResult = {
//     timestamp: new Date().toISOString(),
//     scores: { E: 3.5, N: 2.1, A: 4.2, C: 3.8, O: 3.0 },
//     personalityType: 'campus_apollo',
//     userInfo: {
//         educationStage: '大三',
//         testFrequency: '偶尔（每年1-2次）',
//         testPurpose: '自我了解',
//         mbti: 'ENFP'
//     }
// };
// 
// api.saveTestResult(testResult)
//     .then(data => console.log('保存成功:', data))
//     .catch(err => console.error('保存失败:', err));
// 
// // 获取统计数据
// api.getStatistics()
//     .then(stats => console.log('统计数据:', stats))
//     .catch(err => console.error('获取统计失败:', err));