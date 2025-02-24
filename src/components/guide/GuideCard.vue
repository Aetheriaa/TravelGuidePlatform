<template>
    <el-card class="guide-card" shadow="hover">
        <router-link :to="{ name: 'GuideDetail', params: { id: guide.id } }" class="card-link">
            <div class="image-wrapper" v-if="guide.coverImage">
                <el-image :src="guide.coverImage" class="cover-image" fit="cover" lazy>
                    <template #error>
                        <div class="image-placeholder">
                            <Picture class="placeholder-icon" />
                            <p class="placeholder-text">图片加载失败</p>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="content">
                <h3 class="title">{{ guide.title }}</h3>
                <div class="info">
                    <!-- <span class="author">
                        <User class="icon" /> {{ guide.authorName || '佚名' }}
                    </span> -->
                    <span class="create-time">
                        <Clock class="icon" /> {{ formatDate(guide.createTime) }}
                    </span>
                    <br />
                    <span class="view-count">
                        <View class="icon" /> {{ guide.viewCount }}
                    </span>
                    
                    <span class="like-count">
                        <Star class="icon" /> {{ guide.likeCount }}
                    </span>
                </div>
                <p :class="['summary', { 'summary-no-image': !guide.coverImage }]">
                    {{ guide.summary }}
                    <template v-if="!guide.coverImage">
                        {{ ' ' + guide.content.substring(0, 150) }}...
                    </template>
                </p>
            </div>
        </router-link>
        <div class="actions">
            <el-tag size="small" type="info" effect="light" v-if="guide.category">
                {{ guide.category }}
            </el-tag>
            <el-tooltip content="喜欢" placement="top">
                <el-button class="action-button" type="link" :icon="isLiked ? StarFilled : Star"
                    @click.prevent="handleLike(guide.id)"></el-button>
            </el-tooltip>
            <el-tooltip content="评论" placement="top">
                <router-link :to="{ name: 'GuideDetail', params: { id: guide.id }, hash: '#comments' }">
                    <el-button class="action-button" type="link" :icon="ChatLineRound"></el-button>
                </router-link>
            </el-tooltip>
        </div>
    </el-card>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { formatDate } from '@/utils/date';
import { likeGuide } from '@/api/guide';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
// 导入图标
import {
    Picture,
    User,
    Clock,
    View,
    Star,
    StarFilled,
    ChatLineRound,
} from '@element-plus/icons-vue';

const props = defineProps({
    guide: {
        type: Object,
        required: true,
    },
});

const isLiked = ref(false);
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const handleLike = (guideId) => {
    if (!isLoggedIn.value) {
        ElMessage.warning('请先登录');
        return;
    }
    likeGuide(guideId)
        .then(() => {
            isLiked.value = !isLiked.value;
            props.guide.likeCount += isLiked.value ? 1 : -1;
            ElMessage.success(isLiked.value ? '点赞成功' : '取消点赞成功');
        })
        .catch((error) => {
            ElMessage.error(error.response?.data?.msg || '操作失败');
        });
};
</script>

<style scoped>
.guide-card {
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.image-wrapper {
    width: 100%;
    height: 180px;
    position: relative;
}

.cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 占位图样式 */
.image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    color: #909399;
}

.placeholder-icon {
    font-size: 32px;
    margin-bottom: 5px;
}

.placeholder-text {
    font-size: 14px;
}

.content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.info {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.info .icon {
    margin-right: 4px;
    width: 1em;
    /* 使用 em 单位 */
    height: 1em;
    /* 使用 em 单位 */
}

/* 统一设置所有图标大小 */
.icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
}

.summary {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

/* 没有图片时，摘要的样式 */
.summary-no-image {
    -webkit-line-clamp: 8;
    /* 增加显示的行数 */
    line-clamp: 4;
}

.actions {
    padding: 10px 15px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.action-button {
    color: #666;
}

.action-button:hover {
    color: #409EFF;
}
</style>