// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Register from '@/components/user/Register.vue';
import Login from '@/components/user/Login.vue';
import UserInfo from '@/components/user/UserInfo.vue';
import UserUpdate from '@/components/user/UserUpdate.vue';
import { useUserStore } from '@/stores/user';

// 导入攻略相关的路由组件
import GuideListView from '@/views/guide/GuideListView.vue';
import GuideDetailView from '@/views/guide/GuideDetailView.vue';
import GuideCreateView from '@/views/guide/GuideCreateView.vue';
import GuideUpdateView from '@/views/guide/GuideUpdateView.vue';
import HomeView from '@/views/HomeView.vue';

// 导入行程相关
import ItineraryListView from '@/views/itinerary/ItineraryListView.vue';
import ItineraryDetailView from '@/views/itinerary/ItineraryDetailView.vue';
import ItineraryCreateView from '@/views/itinerary/ItineraryCreateView.vue';
import ItineraryUpdateView from '@/views/itinerary/ItineraryUpdateView.vue';
// 旅游产品相关
import ProductListView from '@/views/product/ProductListView.vue';
import ProductDetailView from '@/views/product/ProductDetailView.vue';
import ProductCreateView from '@/views/product/ProductCreateView.vue';
import ProductUpdateView from '@/views/product/ProductUpdateView.vue';

// 订单相关
import OrderListView from '@/views/order/OrderListView.vue';
import OrderDetailView from '@/views/order/OrderDetailView.vue';

const routes = [
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/userinfo',
        name: 'UserInfo',
        component: UserInfo,
        meta: { requiresAuth: true }
    },
    {
        path: '/userupdate',
        name: 'UserUpdate',
        component: UserUpdate,
        meta: { requiresAuth: true }
    },
    // 攻略相关路由
    {
        path: '/guides',
        name: 'GuideList',
        component: GuideListView
    },
    {
        path: '/guides/:id',
        name: 'GuideDetail',
        component: GuideDetailView,
        props: true // 将路由参数作为 props 传递给组件
    },
    {
        path: '/guides/create',
        name: 'GuideCreate',
        component: GuideCreateView,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/guides/:id/update',
        name: 'GuideUpdate',
        component: GuideUpdateView,
        meta: { requiresAuth: true } //需要登录
    },
    {
        path: '/',
        name: 'HomeView',
        component: HomeView,
        meta: { requiresAuth: true } //需要登录
    },
    {
        path: '/itineraries',
        name: 'ItineraryList',
        component: ItineraryListView,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/itineraries/:id',
        name: 'ItineraryDetail',
        component: ItineraryDetailView,
        props: true, // 将路由参数作为 props 传递给组件
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/itineraries/create',
        name: 'ItineraryCreate',
        component: ItineraryCreateView,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/itineraries/:id/update',
        name: 'ItineraryUpdate',
        component: ItineraryUpdateView,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/products',
        name: 'ProductList',
        component: ProductListView,
        meta: { requiresAuth: true }
    },
    {
        path: '/products/:id',
        name: 'ProductDetail',
        component: ProductDetailView,
        props: true
    },
    {
        path: '/products/create',
        name: 'ProductCreate',
        component: ProductCreateView,
        meta: { requiresAuth: true } // 假设只有登录用户才能创建
    },
    {
        path: '/products/:id/update',
        name: 'ProductUpdate',
        component: ProductUpdateView,
        props: true,
        meta: { requiresAuth: true } // 假设只有登录用户才能编辑
    },
    // 订单相关路由
    {
        path: '/orders',
        name: 'OrderList',
        component: OrderListView,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: OrderDetailView,
        props: true, // 将路由参数作为 props 传递给组件
        meta: { requiresAuth: true } // 需要登录
    },
    // 支付页面
    {
        path: '/orders/:id/:productId/pay',
        name: 'OrderPay',
        component: () => import('@/views/order/OrderPayView.vue'),
        props: true,
        meta: { requiresAuth: true } // 可能需要登录
    },
    {
        path: '/search',
        name: 'SearchResult',
        component: () => import('@/views/search/SearchResultView.vue') // 搜索结果页
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!userStore.isLoggedIn) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;