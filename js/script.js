document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    const productsData = [
        {
            id: 1,
            name: "优质运动鞋",
            price: 299.00,
            image: "/img/优质运动鞋.webp",
            description: "这款优质运动鞋采用最新的缓震技术和透气材料，提供卓越的穿着体验和支撑。适合跑步、健身及日常休闲穿搭。"
        },
        {
            id: 2,
            name: "时尚T恤",
            price: 99.00,
            image: "/img/时尚T恤.webp",
            description: "纯棉制作的时尚T恤，手感柔软，穿着舒适。简约设计搭配多种颜色，轻松打造个性化造型。"
        },
        {
            id: 3,
            name: "智能手表",
            price: 899.00,
            image: "/img/智能手表.webp",
            description: "多功能智能手表，具备心率监测、睡眠追踪、来电提醒和消息同步等功能。续航持久，是您健康生活的智能伙伴。"
        },
        {
            id: 4,
            name: "舒适耳机",
            price: 150.00,
            image: "/img/舒适耳机.webp",
            description: "轻量化设计，佩戴舒适的头戴式耳机。音质清晰，低音强劲，带来沉浸式听觉体验。长时间佩戴不感疲劳。"
        },
        {
            id: 5,
            name: "经典牛仔裤",
            price: 180.00,
            image: "/img/经典牛仔裤.webp",
            description: "采用优质丹宁布料，经典版型，时尚百搭。耐磨耐穿，经过特殊洗水工艺，手感柔软且穿着舒适。"
        },
        {
            id: 6,
            name: "户外背包",
            price: 220.00,
            image: "/img/户外背包.webp",
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

    const loginLinkItem = document.getElementById('loginLinkItem');
    const registerLinkItem = document.getElementById('registerLinkItem');
    const loggedInUserInfo = document.getElementById('loggedInUserInfo');
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');
    const logoutButton = document.getElementById('logoutButton');

    const CURRENT_USER_STORAGE_KEY = 'current_logged_in_user';

    if (!loginLinkItem || !registerLinkItem || !loggedInUserInfo || !loggedInUsernameSpan || !logoutButton) {
        console.warn("WARN: Header login/logout elements not found. Login status display might not work fully on this page.");
        return;
    }

    function updateHeaderDisplay() {
        const currentUserJSON = sessionStorage.getItem(CURRENT_USER_STORAGE_KEY);

        if (currentUserJSON) {
            try {
                const currentUser = JSON.parse(currentUserJSON);
                if (currentUser && currentUser.username) {
                    loggedInUsernameSpan.textContent = `欢迎您, ${currentUser.username}`;
                    loginLinkItem.style.display = 'none';
                    registerLinkItem.style.display = 'none';
                    loggedInUserInfo.style.display = 'flex';
                } else {
                    sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
                    updateHeaderDisplay();
                }
            } catch (e) {
                console.error("Error parsing current user data from sessionStorage:", e);
                sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
                updateHeaderDisplay();
            }
        } else {
            loginLinkItem.style.display = 'list-item';
            registerLinkItem.style.display = 'list-item';
            loggedInUserInfo.style.display = 'none';
        }
    }

    function handleLogout() {
        sessionStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        updateHeaderDisplay();
        alert("您已成功退出登录。");
        if (currentPage !== 'index.html') {
            window.location.href = 'index.html';
        }
    }

    updateHeaderDisplay();

    logoutButton.addEventListener('click', handleLogout);

    if (currentPage === 'product.html' || currentPage === 'product') {
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

    if (currentPage === 'cart.html' || currentPage === 'cart') {
        const cartTableBody = document.getElementById('cartItems');
        const cartTotalSpan = document.getElementById('cartTotal');

        function updateCartDisplay() {
            const cart = getCart();
            cartTableBody.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartTableBody.innerHTML = '<tr><td colspan="5">购物车是空的。<a class="goToIndex" href="/index.html">去首页挑选商品</a></li></td></tr>';
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
});
