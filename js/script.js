document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    const productsData = [
        {
            id: 1,
            name: "优质运动鞋",
            price: 299.00,
            image: "../img/优质运动鞋.jpg",
            description: "这款优质运动鞋采用最新的缓震技术和透气材料，提供卓越的穿着体验和支撑。适合跑步、健身及日常休闲穿搭。"
        },
        {
            id: 2,
            name: "时尚T恤",
            price: 99.00,
            image: "../img/时尚T恤.jpg",
            description: "纯棉制作的时尚T恤，手感柔软，穿着舒适。简约设计搭配多种颜色，轻松打造个性化造型。"
        },
        {
            id: 3,
            name: "智能手表",
            price: 899.00,
            image: "../img/智能手表.jpg",
            description: "多功能智能手表，具备心率监测、睡眠追踪、来电提醒和消息同步等功能。续航持久，是您健康生活的智能伙伴。"
        },
        {
            id: 4,
            name: "舒适耳机",
            price: 150.00,
            image: "../img/舒适耳机.jpg",
            description: "轻量化设计，佩戴舒适的头戴式耳机。音质清晰，低音强劲，带来沉浸式听觉体验。长时间佩戴不感疲劳。"
        },
        {
            id: 5,
            name: "经典牛仔裤",
            price: 180.00,
            image: "../img/经典牛仔裤.jpg",
            description: "采用优质丹宁布料，经典版型，时尚百搭。耐磨耐穿，经过特殊洗水工艺，手感柔软且穿着舒适。"
        },
        {
            id: 6,
            name: "户外背包",
            price: 220.00,
            image: "../img/户外背包.jpg",
            description: "防水耐磨的户外背包，多层收纳设计，容量大。适合徒步旅行、露营和日常通勤，为您提供便利。"
        }
    ];

    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    if (currentPage === 'product.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = productsData.find(p => p.id === productId);

        if (product) {
            document.getElementById('productImage').src = product.image;
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productDescription').textContent = product.description;
            document.getElementById('productPrice').textContent = `￥${product.price.toFixed(2)}`;

            document.getElementById('addToCartBtn').addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantity').value);
                if (quantity > 0) {
                    const cart = getCart();
                    const existingProductIndex = cart.findIndex(item => item.id === product.id);

                    if (existingProductIndex > -1) {
                        cart[existingProductIndex].quantity += quantity;
                    } else {
                        cart.push({ ...product, quantity: quantity });
                    }
                    saveCart(cart);
                    alert(`${product.name} 已加入购物车! 数量: ${quantity}`);
                } else {
                    alert('购买数量必须大于0。');
                }
            });
        } else {
            alert('产品未找到。即将跳转回首页。');
            window.location.href = 'index.html';
        }
    }

    if (currentPage === 'cart.html') {
        const cartTableBody = document.getElementById('cartItems');
        const cartTotalSpan = document.getElementById('cartTotal');

        function updateCartDisplay() {
            const cart = getCart();
            cartTableBody.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartTableBody.innerHTML = '<tr><td colspan="5">购物车是空的。<a class="goToIndex" href="../index.html">去首页挑选商品</a></li></td></tr>';
            } else {
                cart.forEach(item => {
                    const row = document.createElement('tr');
                    const subtotal = item.price * item.quantity;
                    total += subtotal;
                    row.innerHTML = `
                        <td><img src="${item.image}" alt="${item.name}">${item.name}</td>
                        <td>￥${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td>￥${subtotal.toFixed(2)}</td>
                        <td><button class="remove-btn" data-id="${item.id}">移除</button></td>
                    `;
                    cartTableBody.appendChild(row);
                });
            }
            cartTotalSpan.textContent = `￥${total.toFixed(2)}`;
        }

        cartTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-btn')) {
                const productId = parseInt(event.target.dataset.id);
                let cart = getCart();
                cart = cart.filter(item => item.id !== productId);
                saveCart(cart);
                updateCartDisplay();
            }
        });

        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('模拟结算成功！');
                localStorage.removeItem('shoppingCart');
                updateCartDisplay();
            });
        }

        updateCartDisplay();
    }

    if (currentPage === 'login.html') {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');
        const loginSuccessMessage = document.getElementById('loginSuccessMessage');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            usernameError.textContent = '';
            passwordError.textContent = '';
            loginSuccessMessage.textContent = '';

            if (usernameInput.value.trim() === '') {
                usernameError.textContent = '用户名不能为空。';
                isValid = false;
            }

            if (passwordInput.value.trim() === '') {
                passwordError.textContent = '密码不能为空。';
                isValid = false;
            }

            if (isValid) {
                // 模拟登录成功逻辑
                loginSuccessMessage.textContent = '登录成功！即将跳转...';
                
                setTimeout(() => {
                    window.location.href = 'index.html'; // 登录成功后跳转到首页
                }, 1500);
            }
        });
    }

    if (currentPage === 'register.html') {
        const registerForm = document.getElementById('registerForm');
        const regUsernameInput = document.getElementById('regUsername');
        const regEmailInput = document.getElementById('regEmail');
        const regPasswordInput = document.getElementById('regPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        const regUsernameError = document.getElementById('regUsernameError');
        const regEmailError = document.getElementById('regEmailError');
        const regPasswordError = document.getElementById('regPasswordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        const registerSuccessMessage = document.getElementById('registerSuccessMessage');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            regUsernameError.textContent = '';
            regEmailError.textContent = '';
            regPasswordError.textContent = '';
            confirmPasswordError.textContent = '';
            registerSuccessMessage.textContent = '';

            if (regUsernameInput.value.trim() === '') {
                regUsernameError.textContent = '用户名不能为空。';
                isValid = false;
            } else if (regUsernameInput.value.trim().length < 3) {
                regUsernameError.textContent = '用户名至少3个字符。';
                isValid = false;
            }

            if (regEmailInput.value.trim() === '') {
                regEmailError.textContent = '邮箱不能为空。';
                isValid = false;
            } else if (!emailRegex.test(regEmailInput.value.trim())) {
                regEmailError.textContent = '请输入有效的邮箱地址。';
                isValid = false;
            }

            if (regPasswordInput.value.trim() === '') {
                regPasswordError.textContent = '密码不能为空。';
                isValid = false;
            } else if (regPasswordInput.value.trim().length < 6) {
                regPasswordError.textContent = '密码至少6个字符。';
                isValid = false;
            }

            if (confirmPasswordInput.value.trim() === '') {
                confirmPasswordError.textContent = '请确认密码。';
                isValid = false;
            } else if (regPasswordInput.value !== confirmPasswordInput.value) {
                confirmPasswordError.textContent = '两次输入的密码不一致。';
                isValid = false;
            }

            if (isValid) {
                // 模拟注册成功逻辑
                registerSuccessMessage.textContent = '注册成功！即将跳转到登录页...';
                
                setTimeout(() => {
                    window.location.href = 'login.html'; // 注册成功后跳转到登录页面
                }, 1500);
            }
        });
    }
});