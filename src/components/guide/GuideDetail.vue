<template>
    <div v-if="guide" class="guide-detail">
        <!-- 添加图片显示区域 -->
        <div class="guide-image-wrapper" v-if="guide.coverImage">
            <img :src="guide.coverImage" :alt="guide.title" class="guide-image" />
        </div>

        <h1>{{ guide.title }}</h1>
        <div class="author-info">
            <!-- 1. 添加到作者个人主页的链接 -->
            <router-link :to="{ name: 'UserProfile', params: { userId: guide.userId } }">
                <span>作者：{{ guide.authorName }}</span>
                <img v-if="guide.authorAvatar" :src="guide.authorAvatar" alt="作者头像" class="avatar">
            </router-link>
        </div>
        <el-button v-if="!isMe" size="small" :type="isFollowing ? 'info' : 'primary'" @click="toggleFollow"
            class="follow-button">
            {{ isFollowing ? '取消关注' : '关注' }}
        </el-button>

        <div class="guide-info">
            <span>发布时间：{{ formatDate(guide.createTime) }}</span>
            <span>更新时间：{{ formatDate(guide.updateTime) }}</span>
            <span>浏览量：{{ guide.viewCount }}</span>
            <span>点赞数：{{ guide.likeCount }}</span>
            <span>标签：{{ guide.tags }}</span>
        </div>
        <div class="guide-content" v-html="guide.content" style="white-space: pre-wrap;"></div>
        <el-divider></el-divider>
        <div class="actions">
            <el-button :icon="isLiked ? 'Star' : 'Star'" @click="toggleLike">
                {{ isLiked ? '取消点赞' : '点赞' }}
            </el-button>
            <el-button :icon="isFavorited ? 'Collection' : 'CollectionTag'" @click="toggleFavorite">
                {{ isFavorited ? '取消收藏' : '收藏' }}
            </el-button>
            <template v-if="isAuthor">
                <router-link :to="{ name: 'GuideUpdate', params: { id: guide.id } }">
                    <el-button type="primary" icon="Edit">编辑</el-button>
                </router-link>
                <el-popconfirm title="确定删除这篇攻略吗？" @confirm="deleteCurrentGuide">
                    <template #reference>
                        <el-button type="danger" icon="Delete">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </div>
        <!-- 评论列表 -->
        <CommentList :guide-id="guide.id" :comments="comments" @comment-added="fetchComments"></CommentList>
        <div class="comment-form">
            <el-input type="textarea" :rows="4" v-model="newCommentContent" placeholder="发表评论..."></el-input>
            <el-button type="primary" @click="submitComment">发表评论</el-button>
        </div>
    </div>
    <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { getGuideDetail, likeGuide, unlikeGuide, favoriteGuide, unfavoriteGuide, deleteGuide, recordGuideView } from '@/api/guide';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { formatDate } from '@/utils/date';
import CommentList from '@/components/comment/CommentList.vue';
import { getCommentsByGuideId, createComment } from '@/api/comment';
// 导入用户相关的 API
import { followUser, unfollowUser, checkFollowing } from '@/api/user';

const route = useRoute();
const router = useRouter();
const guide = ref(null);
const isLiked = ref(false);
const isFavorited = ref(false);
const userStore = useUserStore();
const comments = ref([]);
const newCommentContent = ref('');

// 是否已关注该作者
const isFollowing = ref(false);


// 计算属性：判断当前用户是否是正在查看的攻略的作者
const isMe = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser && guide.value && userStore.currentUser.id === guide.value.userId;
});

// 构建评论树的函数
function buildCommentTree(comments) {
    const commentMap = {};
    const tree = [];

    comments.forEach(comment => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
        if (comment.parentCommentId) {
            const parent = commentMap[comment.parentCommentId];
            if (parent) {
                parent.replies.push(commentMap[comment.id]);
            }
        } else {
            tree.push(commentMap[comment.id]);
        }
    });

    return tree;
}


const fetchGuideDetail = () => {
    getGuideDetail(route.params.id)
        .then(response => {
            guide.value = response.data.data;
            isLiked.value = response.data.data.liked;
            isFavorited.value = response.data.data.favorited;
            if (guide.value.tags && typeof guide.value.tags === 'string') {
                guide.value.tags = guide.value.tags.split(',');
            }
            if (userStore.isLoggedIn) {
                recordGuideView(userStore.currentUser.id, guide.value.id);
            } 
            checkIsFollowing();
            fetchComments(); // 获取评论
        })
        .catch(error => {
            console.error("Error fetching guide detail:", error);
            ElMessage.error('Failed to load guide detail');
        });
};

const fetchComments = () => {
    getCommentsByGuideId(route.params.id)
        .then(res => {
            // 获取评论后，构建评论树
            comments.value = buildCommentTree(res.data.data);
        })
        .catch(err => {
            console.log(err);
            ElMessage.error('Failed to load comments');
        });
};

const isAuthor = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser && guide.value && userStore.currentUser.id === guide.value.userId
});

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            fetchGuideDetail();
            
        }
    },
    { immediate: true }
);

const scrollToComment = (commentId) => {
    nextTick(() => {
        const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
        if (commentElement) {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
};

const toggleLike = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning("请先登录")
        router.push('/login')
        return
    }
    try {
        if (isLiked.value) {
            await unlikeGuide(guide.value.id);
            guide.value.likeCount--;
            ElMessage.success('取消点赞成功')
        } else {
            await likeGuide(guide.value.id);
            guide.value.likeCount++;
            ElMessage.success('点赞成功')
        }
        isLiked.value = !isLiked.value;

    } catch (error) {
        console.log(error);
    }
};

const toggleFavorite = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning("请先登录")
        router.push('/login')
        return
    }
    try {
        if (isFavorited.value) {
            await unfavoriteGuide(guide.value.id)
            ElMessage.success('取消收藏成功')
        } else {
            await favoriteGuide(guide.value.id)
            ElMessage.success('收藏成功')
        }
        isFavorited.value = !isFavorited.value
    } catch (error) {
        console.log(error);
    }
}
const deleteCurrentGuide = () => {
    deleteGuide(guide.value.id).then(() => {
        ElMessage.success('删除成功')
        router.push('/guides')
    }).catch(err => {
        console.log(err)
    })
}

const submitComment = () => {
    if (!newCommentContent.value.trim()) {
        ElMessage.warning('评论内容不能为空');
        return;
    }
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login');
        return;
    }
    const data = {
        guideId: guide.value.id,
        content: newCommentContent.value,
        parentCommentId: null  // 顶层评论的 parentCommentId 为 null
    };
    createComment(data).then(() => {
        ElMessage.success('评论成功');
        newCommentContent.value = '';
        fetchComments(); // 刷新评论列表, 会自动构建树
    }).catch(error => {
        console.error("Error creating comment:", error);
        ElMessage.error('Failed to create comment');
    });
};

// 检查是否已关注
const checkIsFollowing = async () => {
    try {
        const response = await checkFollowing(guide.value.userId);
        isFollowing.value = response.data.data;
    } catch (error) {
        console.error('Error checking follow status:', error);
    }
};

// 关注/取消关注
const toggleFollow = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login');
        return;
    }
    try {
        if (isFollowing.value) {
            await unfollowUser(guide.value.userId);
            ElMessage.success('已取消关注');
        } else {
            await followUser(guide.value.userId);
            ElMessage.success('关注成功');
        }
        isFollowing.value = !isFollowing.value; // 更新关注状态
    } catch (error) {
        console.error("Error toggling follow:", error);
        ElMessage.error('操作失败');
    }
};
</script>

<style scoped>
.guide-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

/* 新增：图片容器样式 */
.guide-image-wrapper {
    width: 100%;
    height: 300px;
    /* 或者你希望的高度 */
    margin-bottom: 20px;
}

.guide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 保持图片比例并填充容器 */
    display: block;
    /* 移除图片底部多余的空白 */
}

.guide-detail h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
}

.author-info {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    font-size: 14px;
    color: #888;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 10px;
}

.guide-info {
    font-size: 0.9em;
    color: #888;
    margin-bottom: 1em;
}

.guide-content {
    line-height: 1.8;
    margin-bottom: 20px;
    white-space: pre-wrap;
}

.actions {
    margin-top: 20px;
}
</style>