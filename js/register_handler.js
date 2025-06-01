document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registerForm');
    const regUsernameInput = document.getElementById('regUsername');
    const regEmailInput = document.getElementById('regEmail');
    const regPasswordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const regUsernameErrorSpan = document.getElementById('regUsernameError');
    const regEmailErrorSpan = document.getElementById('regEmailError');
    const regPasswordErrorSpan = document.getElementById('regPasswordError');
    const confirmPasswordErrorSpan = document.getElementById('confirmPasswordError');
    const registerSuccessMessageDiv = document.getElementById('registerSuccessMessage');

    const LOCAL_STORAGE_KEY = 'all_registered_users';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!registrationForm || !regUsernameInput || !regEmailInput || !regPasswordInput || !confirmPasswordInput ||
        !regUsernameErrorSpan || !regEmailErrorSpan || !regPasswordErrorSpan || !confirmPasswordErrorSpan || !registerSuccessMessageDiv) {
        console.error("Registration page essential elements not found. Aborting script execution.");
        if (registrationForm) registrationForm.querySelector('button[type="submit"]').disabled = true;
        return;
    }

    /**
     * 在指定的元素中显示消息，并设定颜色和自动清除。
     * @param {string} msg - 要显示的消息。
     * @param {'success'|'error'} type - 消息类型，影响颜色。
     * @param {HTMLElement} targetElement - 消息要显示到的DOM元素。
     */
    function displayMessage(msg, type, targetElement) {
        if (targetElement) {
            targetElement.textContent = msg;
            targetElement.style.color = type === 'error' ? 'red' : 'green';
            if (targetElement.timeoutId) {
                clearTimeout(targetElement.timeoutId);
            }
            targetElement.timeoutId = setTimeout(() => {
                targetElement.textContent = '';
                targetElement.style.color = '';
            }, type === 'success' ? 3000 : 5000);
        } else {
            console.warn(`Target element for message not found. Message: ${msg}`);
        }
    }

    function clearMessages() {
        regUsernameErrorSpan.textContent = '';
        regEmailErrorSpan.textContent = '';
        regPasswordErrorSpan.textContent = '';
        confirmPasswordErrorSpan.textContent = '';
        registerSuccessMessageDiv.textContent = '';
        regUsernameErrorSpan.style.color = '';
        regEmailErrorSpan.style.color = '';
        regPasswordErrorSpan.style.color = '';
        confirmPasswordErrorSpan.style.color = '';
        registerSuccessMessageDiv.style.color = '';
    }

    clearMessages();

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        clearMessages();

        const newUserData = {};
        let isValid = true;

        newUserData.username = regUsernameInput.value.trim();
        newUserData.email = regEmailInput.value.trim();
        newUserData.password = regPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!newUserData.username) {
            displayMessage('用户名不能为空。', 'error', regUsernameErrorSpan);
            isValid = false;
        } else if (newUserData.username.length < 3) {
            displayMessage('用户名至少3个字符。', 'error', regUsernameErrorSpan);
            isValid = false;
        }

        if (!newUserData.email) {
            displayMessage('电子邮件不能为空。', 'error', regEmailErrorSpan);
            isValid = false;
        } else if (!emailRegex.test(newUserData.email)) {
            displayMessage('请输入有效的电子邮件地址。', 'error', regEmailErrorSpan);
            isValid = false;
        }

        if (!newUserData.password) {
            displayMessage('密码不能为空。', 'error', regPasswordErrorSpan);
            isValid = false;
        } else if (newUserData.password.length < 6) {
            displayMessage('密码至少6个字符。', 'error', regPasswordErrorSpan);
            isValid = false;
        }

        if (!confirmPassword) {
            displayMessage('请确认密码。', 'error', confirmPasswordErrorSpan);
            isValid = false;
        } else if (newUserData.password !== confirmPassword) {
            displayMessage('两次输入的密码不一致。', 'error', confirmPasswordErrorSpan);
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        let allUsers = [];
        const storedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (storedDataJSON) {
            try {
                allUsers = JSON.parse(storedDataJSON);
                if (!Array.isArray(allUsers)) {
                    console.warn("LocalStorage data format incorrect. Re-initializing as empty array.");
                    allUsers = [];
                }
            } catch (error) {
                console.error("Failed to parse LocalStorage data:", error);
                displayMessage("读取已保存数据失败，将创建新列表。", 'error', registerSuccessMessageDiv);
                allUsers = [];
            }
        }

        const isDuplicate = allUsers.some(existingUser => {
            return existingUser.username === newUserData.username || existingUser.email === newUserData.email;
        });

        if (isDuplicate) {
            displayMessage("该用户名或邮箱已注册，请勿重复提交！", 'error', registerSuccessMessageDiv);
            return;
        }

        newUserData.registrationTimestamp = Date.now();

        allUsers.push(newUserData);

        try {
            const updatedDataJSON = JSON.stringify(allUsers);
            localStorage.setItem(LOCAL_STORAGE_KEY, updatedDataJSON);
            displayMessage("注册成功！即将跳转至登录页面。", 'success', registerSuccessMessageDiv);
            registrationForm.reset();
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } catch (error) {
            console.error("Failed to save data to LocalStorage:", error);
            if (error.name === 'QuotaExceededError') {
                displayMessage("保存失败：浏览器存储空间不足。", 'error', registerSuccessMessageDiv);
            } else {
                displayMessage("保存失败，请检查浏览器或稍后再试。", 'error', registerSuccessMessageDiv);
            }
        }
    });
});