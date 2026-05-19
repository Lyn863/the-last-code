// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyD1w7QzV6yF7qJ1X5wJZ7X5X7z8X5X7z8X",
    authDomain: "campus-personality-test.firebaseapp.com",
    projectId: "campus-personality-test",
    storageBucket: "campus-personality-test.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:1234567890123456789012",
    measurementId: "G-123456789012"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();

// 自定义鼠标效果
const customCursor = document.getElementById('custom-cursor');
const hoverElements = document.querySelectorAll('.hover-effect');

document.addEventListener('mousemove', (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
});

document.addEventListener('mousedown', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

hoverElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        customCursor.style.borderColor = '#000';
    });

    element.addEventListener('mouseleave', () => {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        customCursor.style.borderColor = '#000';
    });
});

// 显示自定义鼠标
setTimeout(() => {
    customCursor.style.opacity = '1';
}, 500);

// 页面切换效果
const screens = document.querySelectorAll('.screen');

function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        
        // 记录页面访问
        if (typeof analytics !== 'undefined') {
            analytics.logEvent('screen_view', {
                screen_name: screenId
            });
        }
    }
}

// 测试题目数据
const questions = [
    // 外向性 (E)
    { id: 1, dimension: 'E', text: '喜欢周围有很多朋友', type: 'rating', reverse: false },
    { id: 2, dimension: 'E', text: '在社交场合中感到自在', type: 'rating', reverse: false },
    { id: 3, dimension: 'E', text: '倾向于安静和独处', type: 'rating', reverse: true },
    { id: 4, dimension: 'E', text: '喜欢成为关注的焦点', type: 'rating', reverse: false },
    { id: 5, dimension: 'E', text: '宁愿读书也不愿参加聚会', type: 'rating', reverse: true },
    { id: 6, dimension: 'E', text: '在团队中积极发言', type: 'rating', reverse: false },
    { id: 7, dimension: 'E', text: '遇到陌生人会主动打招呼', type: 'rating', reverse: false },
    { id: 8, dimension: 'E', text: '更喜欢独自完成任务', type: 'rating', reverse: true },
    
    // 开放性 (O)
    { id: 9, dimension: 'O', text: '对新想法和新体验持开放态度', type: 'rating', reverse: false },
    { id: 10, dimension: 'O', text: '喜欢尝试新事物', type: 'rating', reverse: false },
    { id: 11, dimension: 'O', text: '认为传统价值观很重要', type: 'rating', reverse: true },
    { id: 12, dimension: 'O', text: '对艺术和美学有兴趣', type: 'rating', reverse: false },
    { id: 13, dimension: 'O', text: '喜欢按照既定的方式做事', type: 'rating', reverse: true },
    { id: 14, dimension: 'O', text: '经常思考哲学或抽象问题', type: 'rating', reverse: false },
    { id: 15, dimension: 'O', text: '喜欢阅读不同类型的书籍', type: 'rating', reverse: false },
    { id: 16, dimension: 'O', text: '认为变化是生活的一部分', type: 'rating', reverse: false },
    
    // 宜人性 (A)
    { id: 17, dimension: 'A', text: '关心他人的感受', type: 'rating', reverse: false },
    { id: 18, dimension: 'A', text: '愿意帮助有困难的人', type: 'rating', reverse: false },
    { id: 19, dimension: 'A', text: '在争论中坚持自己的观点', type: 'rating', reverse: true },
    { id: 20, dimension: 'A', text: '相信大多数人是诚实的', type: 'rating', reverse: false },
    { id: 21, dimension: 'A', text: '有时会嫉妒他人的成功', type: 'rating', reverse: true },
    { id: 22, dimension: 'A', text: '愿意为团队利益牺牲个人利益', type: 'rating', reverse: false },
    { id: 23, dimension: 'A', text: '对他人的问题表示同情', type: 'rating', reverse: false },
    { id: 24, dimension: 'A', text: '在冲突中倾向于寻求和解', type: 'rating', reverse: false },
    
    // 尽责性 (C)
    { id: 25, dimension: 'C', text: '做事有条理，喜欢按计划行事', type: 'rating', reverse: false },
    { id: 26, dimension: 'C', text: '能够坚持完成困难的任务', type: 'rating', reverse: false },
    { id: 27, dimension: 'C', text: '经常拖延任务', type: 'rating', reverse: true },
    { id: 28, dimension: 'C', text: '重视准时和可靠性', type: 'rating', reverse: false },
    { id: 29, dimension: 'C', text: '喜欢提前规划', type: 'rating', reverse: false },
    { id: 30, dimension: 'C', text: '做事认真负责', type: 'rating', reverse: false },
    { id: 31, dimension: 'C', text: '容易分心', type: 'rating', reverse: true },
    { id: 32, dimension: 'C', text: '能够很好地管理时间', type: 'rating', reverse: false },
    
    // 神经质 (N)
    { id: 33, dimension: 'N', text: '经常感到焦虑或担忧', type: 'rating', reverse: false },
    { id: 34, dimension: 'N', text: '情绪波动较大', type: 'rating', reverse: false },
    { id: 35, dimension: 'N', text: '面对压力时保持冷静', type: 'rating', reverse: true },
    { id: 36, dimension: 'N', text: '对批评很敏感', type: 'rating', reverse: false },
    { id: 37, dimension: 'N', text: '很少感到沮丧', type: 'rating', reverse: true },
    { id: 38, dimension: 'N', text: '经常感到紧张', type: 'rating', reverse: false },
    { id: 39, dimension: 'N', text: '能够很好地控制自己的情绪', type: 'rating', reverse: true },
    { id: 40, dimension: 'N', text: '对未来感到乐观', type: 'rating', reverse: true },
    
    // 额外信息收集
    { id: 41, dimension: 'info', text: '您所处的学业阶段是？', type: 'choice', options: ['初中', '高中', '大一', '大二', '大三', '大四', '研究生', '已就业'] },
    { id: 42, dimension: 'info', text: '您之前做过人格测试吗？', type: 'yesno' },
    { id: 43, dimension: 'info', text: '您做人格测试的频率是？', type: 'choice', options: ['从未做过', '偶尔（每年1-2次）', '有时（每季度1次）', '经常（每月1次或更多）'] },
    { id: 44, dimension: 'info', text: '您进行人格测试的主要目的是什么？', type: 'choice', options: ['自我了解', '职业规划', '人际关系', '娱乐消遣', '学习研究', '其他'] },
    { id: 45, dimension: 'info', text: '您认为人格测试对您的自我认知有帮助吗？', type: 'choice', options: ['完全没有帮助', '帮助很小', '一般', '有一定帮助', '非常有帮助'] },
    { id: 46, dimension: 'info', text: '您是否会在日常交流中主动提及或使用自己的人格标签？', type: 'choice', options: ['从不', '很少', '有时', '经常', '总是'] },
    { id: 47, dimension: 'info', text: '您觉得人格测试结果多大程度上准确描述您的性格？', type: 'choice', options: ['完全不准确', '不太准确', '一般', '比较准确', '完全准确'] },
    { id: 48, dimension: 'info', text: '您是否曾因测试结果而产生心理暗示或行为改变？', type: 'choice', options: ['完全没有', '很少', '有时', '经常', '总是'] },
    { id: 49, dimension: 'info', text: '您如何看待网络上各种人格测试传播的现象？', type: 'choice', options: ['完全无用，是伪科学', '娱乐性质，不可当真', '有一定参考价值', '很有意义，值得推广', '非常科学，应该普及'] },
    { id: 50, dimension: 'info', text: '您的MBTI类型是？', type: 'choice', options: ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ', '不知道/不确定'] }
];

// 人格类型数据
const personalityTypes = [
    {
        id: 'campus_apollo',
        name: '校园阿波罗',
        dimensions: { E: '高', N: '低', A: '高', C: '中', O: '中' },
        description: '热情开朗，喜欢结交朋友，情绪稳定，很少焦虑。待人友善，容易信任他人。做事有条理但不刻板。是团队中的"阳光人物"。',
        strengths: [
            '社交能力强，容易建立人际关系',
            '情绪稳定，能够应对压力',
            '乐于助人，善于团队合作',
            '积极乐观，能够鼓舞他人'
        ],
        challenges: [
            '可能过于关注社交而忽视个人时间',
            '在需要深入思考的任务上可能缺乏耐心',
            '对批评可能过于敏感'
        ],
        career: [
            '市场营销',
            '人力资源',
            '教育',
            '公关',
            '客户服务'
        ],
        relationship: [
            '在朋友圈中通常是核心人物',
            '喜欢组织社交活动',
            '倾向于建立广泛但可能不够深入的人际关系',
            '在冲突中倾向于寻求和解'
        ],
        image: 'https://img.icons8.com/color/480/000000/sun--v1.png'
    },
    {
        id: 'campus_athena',
        name: '校园雅典娜',
        dimensions: { E: '中', N: '低', A: '中', C: '高', O: '高' },
        description: '聪明理性，善于分析和解决问题。做事有条理，注重细节。对新想法持开放态度，喜欢学习新知识。是团队中的"智囊"。',
        strengths: [
            '逻辑思维能力强',
            '学习能力出色',
            '做事认真负责',
            '善于解决复杂问题'
        ],
        challenges: [
            '可能过于理性而忽视情感因素',
            '在社交场合可能显得拘谨',
            '对自己和他人要求过高'
        ],
        career: [
            '科学研究',
            '工程技术',
            '数据分析',
            '学术研究',
            '咨询'
        ],
        relationship: [
            '倾向于与志同道合的人建立深厚友谊',
            '重视思想交流和智力对话',
            '在人际关系中可能显得较为理性',
            '对朋友的选择较为挑剔'
        ],
        image: 'https://img.icons8.com/color/480/000000/olympia.png'
    },
    {
        id: 'campus_dionysus',
        name: '校园狄俄尼索斯',
        dimensions: { E: '高', N: '中', A: '中', C: '低', O: '高' },
        description: '充满激情和创造力，喜欢尝试新事物。活在当下，享受生活。可能有些冲动，不太喜欢规则和约束。是团队中的"创意源泉"。',
        strengths: [
            '创造力强，思维活跃',
            '充满激情和活力',
            '善于激励他人',
            '适应能力强'
        ],
        challenges: [
            '可能缺乏条理性和计划性',
            '难以坚持完成长期任务',
            '在需要严格遵守规则的环境中可能感到不适'
        ],
        career: [
            '艺术创作',
            '广告创意',
            '创业',
            '表演艺术',
            '媒体'
        ],
        relationship: [
            '交友广泛，朋友众多',
            '在社交场合充满魅力',
            '可能在亲密关系中表现得较为不稳定',
            '喜欢与有趣、有创意的人交往'
        ],
        image: 'https://img.icons8.com/color/480/000000/wine-glass.png'
    },
    {
        id: 'campus_hermes',
        name: '校园赫尔墨斯',
        dimensions: { E: '高', N: '低', A: '中', C: '中', O: '高' },
        description: '灵活多变，善于适应不同环境。机智幽默，善于沟通。对新事物充满好奇，喜欢学习各种技能。是团队中的"多面手"。',
        strengths: [
            '适应能力强',
            '沟通能力出色',
            '学习能力强',
            '思维敏捷'
        ],
        challenges: [
            '可能缺乏专注力',
            '难以深入研究某个领域',
            '在需要长期坚持的任务上可能表现不佳'
        ],
        career: [
            '销售',
            '公关',
            '记者',
            '翻译',
            '项目管理'
        ],
        relationship: [
            '善于与人打交道',
            '在不同社交圈中都能如鱼得水',
            '交友广泛但可能缺乏深度',
            '喜欢变化和新鲜感'
        ],
        image: 'https://img.icons8.com/color/480/000000/winged-shoes.png'
    },
    {
        id: 'campus_artemis',
        name: '校园阿尔忒弥斯',
        dimensions: { E: '低', N: '低', A: '中', C: '高', O: '中' },
        description: '独立自主，喜欢独处。做事认真负责，注重细节。对自己和他人有较高要求。可能显得有些冷漠，但内心温暖。是团队中的"可靠者"。',
        strengths: [
            '独立自主，自我驱动',
            '做事认真负责',
            '专注力强',
            '善于分析问题'
        ],
        challenges: [
            '可能过于内向，缺乏社交能力',
            '对他人要求过高，难以合作',
            '在团队合作中可能显得不够积极'
        ],
        career: [
            '科学研究',
            '技术开发',
            '会计',
            '图书管理',
            '质量控制'
        ],
        relationship: [
            '朋友不多但关系深厚',
            '在亲密关系中较为忠诚',
            '可能不善于表达情感',
            '重视个人空间和隐私'
        ],
        image: 'https://img.icons8.com/color/480/000000/bow-and-arrow.png'
    },
    {
        id: 'campus_zeus',
        name: '校园宙斯',
        dimensions: { E: '高', N: '中', A: '低', C: '高', O: '中' },
        description: '自信果断，喜欢领导和指挥他人。有责任感，能够承担重任。可能有些强势，不太善于倾听他人意见。是团队中的"领导者"。',
        strengths: [
            '领导能力强',
            '决策果断',
            '责任感强',
            '目标明确'
        ],
        challenges: [
            '可能过于强势，忽视他人意见',
            '在团队合作中可能显得专制',
            '对批评较为敏感'
        ],
        career: [
            '管理',
            '政治',
            '法律',
            '军事',
            '创业'
        ],
        relationship: [
            '在人际关系中倾向于主导',
            '喜欢结交有影响力的人',
            '可能难以接受他人的建议或批评',
            '在亲密关系中可能显得较为强势'
        ],
        image: 'https://img.icons8.com/color/480/000000/lightning-bolt.png'
    },
    {
        id: 'campus_demeter',
        name: '校园德墨忒尔',
        dimensions: { E: '中', N: '中', A: '高', C: '高', O: '低' },
        description: '温柔体贴，善于照顾他人。做事认真负责，注重传统和稳定。重视家庭和友谊，愿意为他人付出。是团队中的"照顾者"。',
        strengths: [
            '善于照顾他人',
            '责任心强',
            '注重细节',
            '善于团队合作'
        ],
        challenges: [
            '可能过于保守，抵制变化',
            '在面对新挑战时可能缺乏勇气',
            '可能过度关注他人需求而忽视自身'
        ],
        career: [
            '教育',
            '医疗护理',
            '社会工作',
            '人力资源',
            '行政管理'
        ],
        relationship: [
            '在朋友圈中通常是照顾者的角色',
            '重视长期稳定的关系',
            '善于倾听和支持他人',
            '可能过度付出而忽视自身需求'
        ],
        image: 'https://img.icons8.com/color/480/000000/wheat.png'
    },
    {
        id: 'campus_poseidon',
        name: '校园波塞冬',
        dimensions: { E: '中', N: '高', A: '中', C: '中', O: '高' },
        description: '情感丰富，情绪波动较大。有创造力，喜欢艺术和美学。可能有些敏感，容易受到外界影响。是团队中的"艺术家"。',
        strengths: [
            '创造力强',
            '情感丰富，善于表达',
            '直觉敏锐',
            '有艺术天赋'
        ],
        challenges: [
            '情绪波动较大，难以控制',
            '在压力下可能表现不佳',
            '可能过于敏感，容易受伤'
        ],
        career: [
            '艺术创作',
            '文学',
            '音乐',
            '设计',
            '心理学'
        ],
        relationship: [
            '在亲密关系中情感投入',
            '善于表达爱意和情感',
            '可能过于敏感，容易误解他人',
            '喜欢与能够理解自己的人交往'
        ],
        image: 'https://img.icons8.com/color/480/000000/waves.png'
    },
    {
        id: 'campus_hades',
        name: '校园哈迪斯',
        dimensions: { E: '低', N: '高', A: '低', C: '高', O: '中' },
        description: '内向深沉，喜欢思考和分析。做事认真负责，注重细节。可能有些悲观，对未来感到担忧。是团队中的"思考者"。',
        strengths: [
            '思维深刻，善于分析',
            '做事认真负责',
            '专注力强',
            '有洞察力'
        ],
        challenges: [
            '可能过于悲观，缺乏乐观精神',
            '社交能力较弱，难以建立关系',
            '在压力下可能表现不佳'
        ],
        career: [
            '研究',
            '分析',
            '编程',
            '写作',
            '哲学'
        ],
        relationship: [
            '朋友不多但关系深厚',
            '在亲密关系中较为忠诚',
            '可能不善于表达情感',
            '喜欢与能够深入交流的人交往'
        ],
        image: 'https://img.icons8.com/color/480/000000/underworld.png'
    },
    {
        id: 'campus_hestia',
        name: '校园赫斯提亚',
        dimensions: { E: '低', N: '低', A: '高', C: '中', O: '低' },
        description: '安静温和，喜欢简单的生活。善于倾听和理解他人。重视家庭和友谊，愿意为他人付出。是团队中的"倾听者"。',
        strengths: [
            '善于倾听和理解',
            '温和友善',
            '情绪稳定',
            '善于创造和谐氛围'
        ],
        challenges: [
            '可能过于被动，缺乏主动性',
            '在需要表达自己观点时可能显得犹豫',
            '对变化可能有些抵触'
        ],
        career: [
            '咨询',
            '教育',
            '社会工作',
            '图书管理',
            '行政支持'
        ],
        relationship: [
            '在朋友圈中通常是倾听者的角色',
            '重视长期稳定的关系',
            '善于创造温馨和谐的氛围',
            '可能过于迁就他人而忽视自身需求'
        ],
        image: 'https://img.icons8.com/color/480/000000/hearth.png'
    }
];

// 全局变量
let currentQuestionIndex = 0;
let userAnswers = [];
let userInfo = {};
let testStartTime = null;

// DOM 元素
const startTestBtn = document.getElementById('start-test-btn');
const statsBtn = document.getElementById('stats-btn');
const backToIntroBtn = document.getElementById('back-to-intro-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const retakeBtn = document.getElementById('retake-btn');
const shareBtn = document.getElementById('share-btn');
const closeShareModal = document.getElementById('close-share-modal');
const copyLinkBtn = document.getElementById('copy-link-btn');
const shareModal = document.getElementById('share-modal');
const toast = document.getElementById('toast');

// 初始化
function init() {
    // 绑定事件监听器
    startTestBtn.addEventListener('click', startTest);
    statsBtn.addEventListener('click', showStatsPage);
    backToIntroBtn.addEventListener('click', () => showScreen('intro-page'));
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    retakeBtn.addEventListener('click', retakeTest);
    shareBtn.addEventListener('click', showShareModal);
    closeShareModal.addEventListener('click', hideShareModal);
    copyLinkBtn.addEventListener('click', copyShareLink);
    
    // 加载统计数据
    loadStatsData();
    
    // 初始化图表
    initCharts();
}

// 开始测试
function startTest() {
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    userInfo = {};
    testStartTime = new Date();
    
    showScreen('test-page');
    showQuestion(currentQuestionIndex);
    
    // 记录测试开始事件
    analytics.logEvent('test_start');
}

// 显示问题
function showQuestion(index) {
    const question = questions[index];
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    
    // 更新问题内容
    questionNumber.innerHTML = `问题 <span class="font-normal">${index + 1}</span>/${questions.length}`;
    questionText.textContent = question.text;
    
    // 更新进度条
    const progress = ((index + 1) / questions.length) * 100;
    progressText.textContent = `${index + 1}/${questions.length}`;
    progressBar.style.width = `${progress}%`;
    
    // 显示对应的选项类型
    const ratingOptions = document.getElementById('rating-options');
    const yesNoOptions = document.getElementById('yes-no-options');
    const multipleChoiceOptions = document.getElementById('multiple-choice-options');
    const mbtiInput = document.getElementById('mbti-input');
    
    ratingOptions.classList.add('hidden');
    yesNoOptions.classList.add('hidden');
    multipleChoiceOptions.classList.add('hidden');
    mbtiInput.classList.add('hidden');
    
    switch (question.type) {
        case 'rating':
            ratingOptions.classList.remove('hidden');
            updateRatingOptions(question.id);
            break;
        case 'yesno':
            yesNoOptions.classList.remove('hidden');
            updateYesNoOptions(question.id);
            break;
        case 'choice':
            multipleChoiceOptions.classList.remove('hidden');
            updateMultipleChoiceOptions(question.id, question.options);
            break;
        case 'mbti':
            mbtiInput.classList.remove('hidden');
            updateMBTIInput(question.id);
            break;
    }
    
    // 更新导航按钮状态
    prevBtn.disabled = index === 0;
    nextBtn.disabled = userAnswers[index] === null;
    
    // 如果是最后一题，更改按钮文本
    if (index === questions.length - 1) {
        nextBtn.innerHTML = '完成测试 <i class="fa fa-check ml-2"></i>';
    } else {
        nextBtn.innerHTML = '下一题 <i class="fa fa-arrow-right ml-2"></i>';
    }
}

// 更新评分选项
function updateRatingOptions(questionId) {
    const ratingBtns = document.querySelectorAll('.rating-btn');
    const answer = userAnswers[currentQuestionIndex];
    
    ratingBtns.forEach(btn => {
        btn.classList.remove('border-primary', 'bg-neutral-50');
        if (parseInt(btn.dataset.value) === answer) {
            btn.classList.add('border-primary', 'bg-neutral-50');
        }
        
        btn.onclick = () => {
            const value = parseInt(btn.dataset.value);
            userAnswers[currentQuestionIndex] = value;
            nextBtn.disabled = false;
            updateRatingOptions(questionId);
        };
    });
}

// 更新是/否选项
function updateYesNoOptions(questionId) {
    const yesNoBtns = document.querySelectorAll('.yes-no-btn');
    const answer = userAnswers[currentQuestionIndex];
    
    yesNoBtns.forEach(btn => {
        btn.classList.remove('border-primary', 'bg-neutral-50');
        if (btn.dataset.value === answer) {
            btn.classList.add('border-primary', 'bg-neutral-50');
        }
        
        btn.onclick = () => {
            const value = btn.dataset.value;
            userAnswers[currentQuestionIndex] = value;
            nextBtn.disabled = false;
            updateYesNoOptions(questionId);
        };
    });
}

// 更新选择题选项
function updateMultipleChoiceOptions(questionId, options) {
    const container = document.getElementById('multiple-choice-options');
    const answer = userAnswers[currentQuestionIndex];
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加选项
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn py-4 border border-neutral-300 hover:border-primary hover:bg-neutral-50 transition-all-300 flex items-center justify-center hover-effect';
        btn.dataset.value = option;
        
        if (option === answer) {
            btn.classList.add('border-primary', 'bg-neutral-50');
        }
        
        btn.textContent = option;
        
        btn.onclick = () => {
            userAnswers[currentQuestionIndex] = option;
            nextBtn.disabled = false;
            updateMultipleChoiceOptions(questionId, options);
        };
        
        container.appendChild(btn);
    });
}

// 更新MBTI输入
function updateMBTIInput(questionId) {
    const input = document.getElementById('mbti-text');
    const answer = userAnswers[currentQuestionIndex];
    
    if (answer) {
        input.value = answer;
    } else {
        input.value = '';
    }
    
    input.oninput = () => {
        const value = input.value.trim().toUpperCase();
        userAnswers[currentQuestionIndex] = value;
        nextBtn.disabled = !value;
    };
}

// 上一题
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// 下一题
function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // 完成测试
        completeTest();
    }
}

// 完成测试
function completeTest() {
    // 显示加载页面
    showScreen('loading-page');
    
    // 收集用户信息
    collectUserInfo();
    
    // 计算得分
    const scores = calculateScores();
    
    // 匹配人格类型
    const personalityType = matchPersonalityType(scores);
    
    // 保存测试结果
    saveTestResult(scores, personalityType);
    
    // 延迟显示结果，增加等待感
    setTimeout(() => {
        showResult(scores, personalityType);
    }, 2000);
}

// 收集用户信息
function collectUserInfo() {
    // 从额外问题中收集用户信息
    for (let i = 40; i < questions.length; i++) {
        const question = questions[i];
        const answer = userAnswers[i];
        
        switch (question.id) {
            case 41: // 学业阶段
                userInfo.educationStage = answer;
                break;
            case 42: // 是否做过人格测试
                userInfo.hasTakenPersonalityTest = answer === 'yes';
                break;
            case 43: // 人格测试频率
                userInfo.testFrequency = answer;
                break;
            case 44: // 测试目的
                userInfo.testPurpose = answer;
                break;
            case 45: // 对自我认知的帮助
                userInfo.helpfulnessForSelfAwareness = answer;
                break;
            case 46: // 是否主动提及人格标签
                userInfo.mentionPersonalityTag = answer;
                break;
            case 47: // 测试结果准确性
                userInfo.resultAccuracy = answer;
                break;
            case 48: // 是否产生心理暗示或行为改变
                userInfo.psychologicalImpact = answer;
                break;
            case 49: // 对网络人格测试现象的看法
                userInfo.viewOnPersonalityTests = answer;
                break;
            case 50: // MBTI类型
                userInfo.mbti = answer;
                break;
        }
    }
}

// 计算得分
function calculateScores() {
    const scores = { E: 0, O: 0, A: 0, C: 0, N: 0 };
    const counts = { E: 0, O: 0, A: 0, C: 0, N: 0 };
    
    // 计算每个维度的得分
    for (let i = 0; i < 40; i++) {
        const question = questions[i];
        const answer = userAnswers[i];
        
        if (answer !== null) {
            let score = answer;
            
            // 反向计分题目
            if (question.reverse) {
                score = 6 - score; // 1↔5, 2↔4, 3↔3
            }
            
            scores[question.dimension] += score;
            counts[question.dimension]++;
        }
    }
    
    // 计算平均分
    Object.keys(scores).forEach(dim => {
        if (counts[dim] > 0) {
            scores[dim] = Math.round((scores[dim] / counts[dim]) * 10) / 10;
        }
    });
    
    return scores;
}

// 匹配人格类型
function matchPersonalityType(scores) {
    // 将得分转换为高/中/低
    const levels = {};
    Object.keys(scores).forEach(dim => {
        if (scores[dim] >= 4) levels[dim] = '高';
        else if (scores[dim] >= 3) levels[dim] = '中';
        else levels[dim] = '低';
    });
    
    // 匹配最接近的人格类型
    let bestMatch = null;
    let bestScore = -1;
    
    personalityTypes.forEach(type => {
        let matchScore = 0;
        Object.keys(levels).forEach(dim => {
            if (type.dimensions[dim] === levels[dim]) {
                matchScore++;
            }
        });
        
        if (matchScore > bestScore) {
            bestScore = matchScore;
            bestMatch = type;
        }
    });
    
    return bestMatch;
}

// 保存测试结果
function saveTestResult(scores, personalityType) {
    const testResult = {
        timestamp: new Date(),
        scores: scores,
        personalityType: personalityType.id,
        testDuration: (new Date() - testStartTime) / 1000, // 秒
        userInfo: userInfo
    };
    
    // 保存到 Firebase
    db.collection('testResults').add(testResult)
        .then(docRef => {
            console.log('测试结果已保存:', docRef.id);
            // 记录测试完成事件
            analytics.logEvent('test_complete', {
                personality_type: personalityType.id,
                test_duration: testResult.testDuration
            });
        })
        .catch(error => {
            console.error('保存测试结果时出错:', error);
        });
}

// 显示结果
function showResult(scores, personalityType) {
    // 更新结果页面内容
    document.getElementById('personality-type').textContent = personalityType.name;
    document.getElementById('personality-dimensions').textContent = 
        `E: ${personalityType.dimensions.E}, N: ${personalityType.dimensions.N}, A: ${personalityType.dimensions.A}, C: ${personalityType.dimensions.C}, O: ${personalityType.dimensions.O}`;
    document.getElementById('personality-description').textContent = personalityType.description;
    
    // 设置人格类型图片
    const personalityImage = document.getElementById('personality-image');
    personalityImage.innerHTML = `<img src="${personalityType.image}" alt="${personalityType.name}" class="w-full h-full object-contain">`;
    
    // 更新维度得分图表
    updateDimensionScores(scores);
    
    // 更新深度解读
    updatePersonalityDetails(personalityType);
    
    // 更新分享弹窗内容
    document.getElementById('share-type').textContent = personalityType.name;
    document.getElementById('share-text').textContent = personalityType.description;
    
    // 显示结果页面
    showScreen('result-page');
    
    // 更新统计图表
    updateResultCharts();
}

// 更新维度得分图表
function updateDimensionScores(scores) {
    // 更新得分条高度和文本
    Object.keys(scores).forEach(dim => {
        const percentage = (scores[dim] / 5) * 100;
        document.getElementById(`${dim.toLowerCase()}-score-bar`).style.height = `${percentage}%`;
        document.getElementById(`${dim.toLowerCase()}-score-text`).textContent = scores[dim];
    });
}

// 更新人格详情
function updatePersonalityDetails(personalityType) {
    // 更新优势与特长
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    personalityType.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
    });
    
    // 更新挑战与成长
    const challengesList = document.getElementById('challenges-list');
    challengesList.innerHTML = '';
    personalityType.challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.textContent = challenge;
        challengesList.appendChild(li);
    });
    
    // 更新适合的专业与职业
    const careerList = document.getElementById('career-list');
    careerList.innerHTML = '';
    personalityType.career.forEach(career => {
        const li = document.createElement('li');
        li.textContent = career;
        careerList.appendChild(li);
    });
    
    // 更新人际关系
    const relationshipList = document.getElementById('relationship-list');
    relationshipList.innerHTML = '';
    personalityType.relationship.forEach(relationship => {
        const li = document.createElement('li');
        li.textContent = relationship;
        relationshipList.appendChild(li);
    });
}

// 重新测试
function retakeTest() {
    showScreen('intro-page');
}

// 显示分享弹窗
function showShareModal() {
    shareModal.classList.remove('hidden');
}

// 隐藏分享弹窗
function hideShareModal() {
    shareModal.classList.add('hidden');
}

// 复制分享链接
function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            showToast('链接已复制到剪贴板');
        })
        .catch(err => {
            console.error('复制链接失败:', err);
            showToast('复制失败，请手动复制链接');
        });
}

// 显示提示
function showToast(message) {
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('opacity-100');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// 显示统计页面
function showStatsPage() {
    showScreen('stats-page');
    updateStatsCharts();
}

// 加载统计数据
function loadStatsData() {
    // 获取测试总数
    db.collection('testResults').get()
        .then(querySnapshot => {
            const totalTests = querySnapshot.size;
            document.getElementById('total-tests').textContent = totalTests;
            document.getElementById('stats-total-tests').textContent = totalTests;
        })
        .catch(error => {
            console.error('获取统计数据时出错:', error);
        });
}

// 图表实例
let personalityDistributionChart = null;
let statsPersonalityChart = null;
let statsDimensionsChart = null;

// 初始化图表
function initCharts() {
    // 结果页面的人格分布图表
    const distributionCtx = document.getElementById('personality-distribution-chart');
    if (distributionCtx) {
        personalityDistributionChart = new Chart(distributionCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '人数',
                    data: [],
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // 统计页面的人格分布图表
    const statsPersonalityCtx = document.getElementById('stats-personality-chart');
    if (statsPersonalityCtx) {
        statsPersonalityChart = new Chart(statsPersonalityCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // 统计页面的维度平均分图表
    const statsDimensionsCtx = document.getElementById('stats-dimensions-chart');
    if (statsDimensionsCtx) {
        statsDimensionsChart = new Chart(statsDimensionsCtx, {
            type: 'radar',
            data: {
                labels: ['外向性 (E)', '开放性 (O)', '宜人性 (A)', '尽责性 (C)', '神经质 (N)'],
                datasets: [{
                    label: '平均分',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(0, 0, 0, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// 更新结果页面的图表
function updateResultCharts() {
    // 获取人格类型分布数据
    db.collection('testResults').get()
        .then(querySnapshot => {
            const typeCounts = {};
            personalityTypes.forEach(type => {
                typeCounts[type.id] = 0;
            });
            
            querySnapshot.forEach(doc => {
                const result = doc.data();
                if (typeCounts.hasOwnProperty(result.personalityType)) {
                    typeCounts[result.personalityType]++;
                }
            });
            
            // 更新图表数据
            if (personalityDistributionChart) {
                personalityDistributionChart.data.labels = personalityTypes.map(type => type.name);
                personalityDistributionChart.data.datasets[0].data = personalityTypes.map(type => typeCounts[type.id]);
                personalityDistributionChart.update();
            }
        })
        .catch(error => {
            console.error('获取人格分布数据时出错:', error);
        });
}

// 更新统计页面的图表
function updateStatsCharts() {
    // 获取人格类型分布数据
    db.collection('testResults').get()
        .then(querySnapshot => {
            const typeCounts = {};
            const dimensionScores = { E: 0, O: 0, A: 0, C: 0, N: 0 };
            let totalTests = 0;
            
            personalityTypes.forEach(type => {
                typeCounts[type.id] = 0;
            });
            
            querySnapshot.forEach(doc => {
                const result = doc.data();
                
                // 统计人格类型
                if (typeCounts.hasOwnProperty(result.personalityType)) {
                    typeCounts[result.personalityType]++;
                }
                
                // 统计维度得分
                Object.keys(dimensionScores).forEach(dim => {
                    if (result.scores && result.scores[dim]) {
                        dimensionScores[dim] += result.scores[dim];
                    }
                });
                
                totalTests++;
            });
            
            // 更新人格分布图表
            if (statsPersonalityChart) {
                const colors = [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#C9CBCF', '#7BC225', '#1A73E8', '#EA4335'
                ];
                
                statsPersonalityChart.data.labels = personalityTypes.map(type => type.name);
                statsPersonalityChart.data.datasets[0].data = personalityTypes.map(type => typeCounts[type.id]);
                statsPersonalityChart.data.datasets[0].backgroundColor = colors;
                statsPersonalityChart.update();
            }
            
            // 更新维度平均分图表
            if (statsDimensionsChart && totalTests > 0) {
                const avgScores = Object.keys(dimensionScores).map(dim => 
                    Math.round((dimensionScores[dim] / totalTests) * 10) / 10
                );
                
                statsDimensionsChart.data.datasets[0].data = avgScores;
                statsDimensionsChart.update();
            }
            
            // 更新测试总数
            document.getElementById('total-tests').textContent = totalTests;
            document.getElementById('stats-total-tests').textContent = totalTests;
        })
        .catch(error => {
            console.error('获取统计数据时出错:', error);
        });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);