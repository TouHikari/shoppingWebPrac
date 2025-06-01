document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const usernameErrorSpan = document.getElementById('usernameError');
    const passwordErrorSpan = document.getElementById('passwordError');
    const loginSuccessMessageDiv = document.getElementById('loginSuccessMessage');

    const ALL_USERS_STORAGE_KEY = 'all_registered_users';
    const CURRENT_USER_STORAGE_KEY = 'current_logged_in_user';
    
    if (!loginForm || !loginUsernameInput || !loginPasswordInput || !usernameErrorSpan || !passwordErrorSpan || !loginSuccessMessageDiv) {
        console.error("Login page essential elements not found. Aborting script execution.");
        if (loginForm) loginForm.querySelector('button[type="submit"]').disabled = true;
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
        usernameErrorSpan.textContent = '';
        passwordErrorSpan.textContent = '';
        loginSuccessMessageDiv.textContent = '';
        usernameErrorSpan.style.color = '';
        passwordErrorSpan.style.color = '';
        loginSuccessMessageDiv.style.color = '';
    }

    clearMessages();

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        clearMessages();

        const inputUsername = loginUsernameInput.value.trim();
        const inputPassword = loginPasswordInput.value;

        let isValid = true;

        if (!inputUsername) {
            displayMessage('用户名不能为空。', 'error', usernameErrorSpan);
            isValid = false;
        }

        if (!inputPassword) {
            displayMessage('密码不能为空。', 'error', passwordErrorSpan);
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const storedDataJSON = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        let allUsers = [];

        if (storedDataJSON) {
            try {
                allUsers = JSON.parse(storedDataJSON);
                if (!Array.isArray(allUsers)) {
                    console.warn("LocalStorage data format incorrect. Initializing as empty array.");
                    allUsers = [];
                }
            } catch (error) {
                console.error("Failed to parse LocalStorage data:", error);
                displayMessage("读取注册数据失败，无法登录。", 'error', loginSuccessMessageDiv);
                return;
            }
        }

        if (allUsers.length === 0) {
            displayMessage("没有注册用户，请先注册。", 'error', loginSuccessMessageDiv);
            return;
        }

        const foundUser = allUsers.find(user => {
            return user.username === inputUsername && user.password === inputPassword;
        });

        if (foundUser) {
            displayMessage("登录成功！即将跳转至首页...", 'success', loginSuccessMessageDiv);
            try {
                sessionStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(foundUser));
                loginForm.reset();
                setTimeout(() => { window.location.href = '/index.html'; }, 1500);
            } catch (error) {
                console.error("Failed to save current user to SessionStorage:", error);
                displayMessage("登录状态保存失败，请稍后再试。", 'error', loginSuccessMessageDiv);
            }
        } else {
            displayMessage("登录失败：用户名或密码不匹配。", 'error', loginSuccessMessageDiv);
        }
    });
});