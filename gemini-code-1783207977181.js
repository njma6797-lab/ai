// ==========================================
// NEGM AI OS V3 - CORE ENGINE & TELEGRAM SEED
// ==========================================

let currentUser = null;
let currentActiveView = 'landing-page';

// الإعدادات الافتراضية لبوت التلجرام المسؤول عن بث التتبع الفوري للمالك
let TELEGRAM_BOT_TOKEN = localStorage.getItem("negm_tg_token") || "7123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"; 
let TELEGRAM_CHAT_ID = localStorage.getItem("negm_tg_chatid") || "123456789";

// نظام تتبع معلومات المتصفح والجهاز والسيستم تلقائياً
function extractClientMachineSpecs() {
    const ua = navigator.userAgent;
    let osName = "نظام غير معروف";
    let browserName = "متصفح غير معروف";

    if (ua.includes("Windows")) osName = "Windows PC";
    else if (ua.includes("Macintosh")) osName = "Mac OS";
    else if (ua.includes("Android")) osName = "Android OS";
    else if (ua.includes("iPhone")) osName = "iOS iPhone";

    if (ua.includes("Chrome")) browserName = "Google Chrome";
    else if (ua.includes("Firefox")) browserName = "Mozilla Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browserName = "Apple Safari";

    return { os: osName, browser: browserName };
}

// دالة إرسال الإشعارات والتتبع الحي لبوت تلجرام المالك
async function emitTrackingToTelegram(messageText) {
    try {
        const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: `🚨 [NEGM OS V3 TRACKING]:\n${messageText}`,
                parse_mode: "Markdown"
            })
        });
    } catch (error) {
        console.error("خطأ في الاتصال بخادم بث التلجرام:", error);
    }
}

// 1. نظام الحفاظ على حالة الجلسة لمنع الـ Refresh Flashing
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("negm_ai_session");
    const savedView = localStorage.getItem("negm_ai_current_view");

    document.getElementById('tg-bot-token-input').value = TELEGRAM_BOT_TOKEN;
    document.getElementById('tg-chat-id-input').value = TELEGRAM_CHAT_ID;

    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUIElements();
        if (savedView && savedView !== 'landing-page') {
            switchView(savedView);
        } else {
            switchView('user-dashboard');
        }
    } else {
        switchView('landing-page');
    }
    
    initializeParticles();
    initAdminCharts();
    populateMockUsersTable();
});

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(viewId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentActiveView = viewId;
        localStorage.setItem("negm_ai_current_view", viewId);
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    const targetTab = document.getElementById(tabId);
    if(targetTab) targetTab.classList.add('active-tab');
}

function switchOsTab(tabId) {
    document.querySelectorAll('.os-tab-content').forEach(tab => tab.classList.remove('active-os-tab'));
    document.getElementById(tabId).classList.add('active-os-tab');
}

// ميكانيكية توليد الكود الفريد (حرفين وأربعة أرقام لا يتكرر)
function generateUniqueUserUID() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let prefix = letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length));
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return prefix + suffix; // مثال: NG4921
}

// إنشاء الحساب
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    
    if(!username || !password) return;
    const uniqueUID = generateUniqueUserUID();
    const specs = extractClientMachineSpecs();

    const userData = {
        uid: uniqueUID,
        username: username,
        password: btoa(password),
        avatar: 'https://cdn-icons-png.flaticon.com/512/610/614131.png',
        role: 'مستخدم عادي',
        points: 300,
        os: specs.os,
        browser: specs.browser,
        country: 'مصر (محاكاة)'
    };

    currentUser = userData;
    localStorage.setItem("negm_ai_session", JSON.stringify(currentUser));
    
    document.getElementById('generated-uid-box').innerText = uniqueUID;
    toggleModal('uid-modal');

    // بث تقرير التسجيل إلى تلجرام المالك فورا
    emitTrackingToTelegram(`👤 حساب جديد ينضم للمنصة!\nالاسم: ${username}\nالكود المولّد: ${uniqueUID}\nالنظام: ${specs.os}\nالمتصفح: ${specs.browser}`);
}

function closeUidModalAndGo() {
    toggleModal('uid-modal');
    updateUserUIElements();
    switchView('user-dashboard');
}

// تسجيل الدخول مع تتبع الأجهزة المباشر
function handleLogin() {
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    // فحص الدخول السري للوحة المالك الشاملة (2009)
    if (identifier === "2009" && password === "2009") {
        switchView('owner-os-page');
        emitTrackingToTelegram(`🔑 دخول آمن: تم فتح لوحة تحكم المالك الفوقية الرائعة (NEGM OS).`);
        return;
    }

    const specs = extractClientMachineSpecs();
    currentUser = {
        uid: identifier.includes("NG") ? identifier : "NG" + Math.floor(1000 + Math.random() * 9000),
        username: identifier,
        role: "مستخدم عادي",
        points: 300,
        os: specs.os,
        browser: specs.browser,
        country: 'مصر'
    };

    localStorage.setItem("negm_ai_session", JSON.stringify(currentUser));
    updateUserUIElements();
    switchView('user-dashboard');

    emitTrackingToTelegram(`🔓 عملية دخول ناجحة:\nالاسم/الكود: ${identifier}\nالجهاز الحالي: ${specs.os} (${specs.browser})`);
}

function handleResetPassword() {
    const user = document.getElementById('forgot-username').value.trim();
    const uid = document.getElementById('forgot-uid').value.trim();
    alert("تم تصفير ميكانيكية الدخول وتعيين كلمة المرور الجديدة بنجاح.");
    emitTrackingToTelegram(`🔄 إعادة تعيين كلمة المرور:\nالحساب: ${user}\nكود الهوية: ${uid}`);
    switchView('login-page');
}

function deductPointsAction(cost, actionName) {
    if(currentUser) {
        if(currentUser.points >= cost) {
            currentUser.points -= cost;
            document.getElementById('user-points-val').innerText = currentUser.points;
            alert(`تم تنفيذ [${actionName}] بنجاح! خصم ${cost} نقطة.`);
            emitTrackingToTelegram(`📉 خصم نقاط:\nالمستخدم: ${currentUser.username} (${currentUser.uid})\nالأداة: ${actionName}\nالنقاط المتبقية: ${currentUser.points}`);
        } else {
            alert("نفذت نقاطك المتاحة اليوم! يرجى الترقية للحساب الفائق Pro أو VIP.");
        }
    }
}

// محاكي إرسال شات ذكي وعرض الرد الفوري المترابط
function sendChatMessage() {
    const input = document.getElementById('chat-input-field');
    const msg = input.value.trim();
    if(!msg) return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="user-msg-bubble" style="text-align:left; color: var(--neon-blue); margin: 8px 0;">👤 أنت: ${msg}</div>`;
    
    input.value = '';
    
    setTimeout(() => {
        chatBox.innerHTML += `<div class="ai-msg-bubble" style="text-align:right; color: #fff; margin: 8px 0; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px;">🤖 مُساعد NEGM [استجابة سريعة]: استقبلت استفسارك بخصوص (${msg}) عبر خوادم المعالجة الفائقة وجاري التحليل العميق.</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);

    deductPointsAction(15, "محادثة AI ذكية");
}

function updateUserUIElements() {
    if(currentUser) {
        document.getElementById('user-nav-name').innerText = currentUser.username;
        document.getElementById('user-nav-uid').innerText = `#${currentUser.uid}`;
        document.getElementById('user-points-val').innerText = currentUser.points || 300;
        if(currentUser.avatar) {
            document.getElementById('user-nav-avatar').src = currentUser.avatar;
        }
    }
}

function logout() {
    if(currentUser) {
        emitTrackingToTelegram(`🚪 تسجيل خروج للمستخدم: ${currentUser.username} (${currentUser.uid})`);
    }
    localStorage.removeItem("negm_ai_session");
    localStorage.removeItem("negm_ai_current_view");
    currentUser = null;
    switchView('landing-page');
}

function saveTelegramCredentials() {
    const token = document.getElementById('tg-bot-token-input').value.trim();
    const chatid = document.getElementById('tg-chat-id-input').value.trim();
    if(token && chatid) {
        TELEGRAM_BOT_TOKEN = token;
        TELEGRAM_CHAT_ID = chatid;
        localStorage.setItem("negm_tg_token", token);
        localStorage.setItem("negm_tg_chatid", chatid);
        alert("تم تحديث وحفظ بيانات تتبع التلجرام بنجاح ورط الخادم!");
        emitTrackingToTelegram("✅ تم تحديث اتصالات البوت بنجاح تام واختبار نقطة تتبع النظام الجارية!");
    }
}

function populateMockUsersTable() {
    const tbody = document.getElementById('users-table-body');
    const mockUsers = [
        { name: "أحمد النجم", code: "NG8821", country: "مصر 🇪🇬", device: "Windows 11 / Chrome", plan: "Ultra VIP" },
        { name: "سارة كريم", code: "NG4921", country: "السعودية 🇸🇦", device: "iPhone / Safari", plan: "Free" },
        { name: "محمود شاكر", code: "NG1104", country: "الإمارات 🇦🇪", device: "Android / Edge", plan: "Pro" }
    ];
    tbody.innerHTML = '';
    mockUsers.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td><img src="https://cdn-icons-png.flaticon.com/512/610/614131.png" style="width:35px; border-radius:50%;"> ${u.name}</td>
                <td><b style="color:var(--neon-blue); font-family:var(--font-en);">${u.code}</b></td>
                <td>${u.country}</td>
                <td><small style="color:var(--text-muted);">${u.device}</small></td>
                <td><span class="badge visual-plan">${u.plan}</span></td>
                <td><button class="glass-btn" style="padding:4px 10px; border-color:red; color:red;" onclick="alert('تم تجميد وحظر الهوية الرقمية للعميل ومنعه من الدخول')">حظر الحساب</button></td>
            </tr>
        `;
    });
}

function toggleModal(modalId) {
    document.getElementById(modalId).classList.toggle('open');
}

function previewAvatar(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('avatar-display').style.backgroundImage = `url(${reader.result})`;
        document.getElementById('user-nav-avatar').src = reader.result;
    }
    if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

function initializeParticles() {
    const container = document.getElementById('particles-container');
    if(!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 35; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 6 + 's';
        container.appendChild(particle);
    }
}

function initAdminCharts() {
    const ctx = document.getElementById('osMainChart');
    if(!ctx) return;
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['01:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'معدل معالجة طلبات الأكواد والشات الفورية لـ AI',
                data: [420, 780, 1110, 2400, 3100, 4890],
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.05)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}