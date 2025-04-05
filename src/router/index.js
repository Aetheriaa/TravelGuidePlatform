// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Register from '@/components/user/Register.vue';
import Login from '@/components/user/Login.vue';
import UserInfo from '@/components/user/UserInfo.vue';
import UserUpdate from '@/components/user/UserUpdate.vue';
import ForgotPassword from '../components/user/ForgotPassword.vue';
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

import FollowingList from '@/components/user/FollowingList.vue';
import FollowerList from '@/components/user/FollowerList.vue';

import TopicListView from '@/views/topic/TopicListView.vue';
import TopicDetailView from '@/views/topic/TopicDetailView.vue';
import TopicCreateView from '@/views/topic/TopicCreateView.vue';
import TopicUpdateView from '@/views/topic/TopicUpdateView.vue';

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

    {
        path: '/user/guide-history',
        name: 'UserGuideHistory',
        component: () => import('@/views/user/UserGuideHistoryView.vue'), // 假设的路径
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/user/liked-guides',
        name: 'UserLikedGuides',
        component: () => import('@/views/user/UserLikedGuidesView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/user/favorite-guides',
        name: 'UserFavoriteGuides',
        component: () => import('@/views/user/UserFavoriteGuidesView.vue'),
        meta: { requiresAuth: true }
    },

    {
        path: '/messages/:userId', // 注意这里的 userId 是对话对方的 userId
        name: 'MessageDetail',
        component: () => import('@/components/message/MessageDetail.vue'),
        props: true,
        meta: { requiresAuth: true } // 确保用户已登录
    },
    {
        path: '/messages',
        name: 'MessageList',
        component: () => import('@/components/message/MessageList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/user/:userId', // 路由路径，:userId 是一个动态参数
        name: 'UserProfile',    // 路由名称
        component: () => import('@/components/user/UserProfile.vue'), // 对应的组件
        props: true           // 将路由参数作为 props 传递给组件
    },
    {
        path: '/user/following', // 当前用户的关注列表
        name: 'FollowingList',
        component: FollowingList,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/user/followers', // 当前用户的粉丝列表
        name: 'FollowerList',
        component: FollowerList,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/popular-tags',
        name: 'PopularTags',
        component: () => import('@/components/guide/PopularTagsView.vue') // 热门标签页
    },
    // 攻略列表页的路由添加 tag 参数 (如果还没有)
    {
        path: '/guides',
        name: 'GuideList',
        component: GuideListView,
        props: (route) => ({ tag: route.query.tag }) // 将 tag 参数作为 props 传递
    },
    {
        path: '/topics',
        name: 'TopicList',
        component: TopicListView
    },
    {
        path: '/topics/:id',
        name: 'TopicDetail',
        component: TopicDetailView,
        props: true // 将路由参数作为 props 传递给组件
    },
    {
        path: '/topics/create',
        name: 'TopicCreate',
        component: TopicCreateView,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/topics/:id/update',
        name: 'TopicUpdate',
        component: TopicUpdateView,
        props: true,
        meta: { requiresAuth: true } // 需要登录
    },
    {
        path: '/forgot-password',
        name: 'forgotPassword',
        component: ForgotPassword,
        props: true,
    },
    {
        path: '/analysis',
        name: 'Analysis',
        component: () => import('@/components/analysis/analysisLog.vue'),
        meta: { requiresAuth: true } // 假设需要管理员权限
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