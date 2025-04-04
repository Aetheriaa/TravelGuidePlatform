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
            <!-- Use the computed property here -->
            <span>标签：{{ tagsString }}</span>
        </div>
        <div class="guide-content" v-html="guide.content" style="white-space: pre-wrap;"></div>
        <el-divider></el-divider>
        <div class="actions">
             <!-- 修正：使用 el-icon 和 导入的图标组件 -->
            <el-button @click="toggleLike">
                <el-icon><Star /></el-icon> <!-- 注意：原代码isLiked两种状态都用了Star，这里保持一致。如果需要区分填充/非填充，可以导入StarFilled -->
                {{ isLiked ? '取消点赞' : '点赞' }}
            </el-button>
             <!-- 修正：使用 el-icon 和 导入的图标组件 -->
            <el-button @click="toggleFavorite">
                 <el-icon>
                     <!-- 使用 v-if 或 :is 动态切换图标 -->
                     <Collection v-if="isFavorited" />
                     <CollectionTag v-else />
                 </el-icon>
                {{ isFavorited ? '取消收藏' : '收藏' }}
            </el-button>
            <template v-if="isAuthor">
                <router-link :to="{ name: 'GuideUpdate', params: { id: guide.id } }">
                     <!-- 修正：使用 el-icon 和 导入的图标组件 -->
                    <el-button type="primary">
                        <el-icon><Edit /></el-icon>编辑
                    </el-button>
                </router-link>
                <el-popconfirm title="确定删除这篇攻略吗？" @confirm="deleteCurrentGuide">
                    <template #reference>
                         <!-- 修正：使用 el-icon 和 导入的图标组件 -->
                        <el-button type="danger">
                            <el-icon><Delete /></el-icon>删除
                        </el-button>
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
import { ElMessage, ElIcon } from 'element-plus'; // 导入 ElIcon (虽然模板中直接用，但规范上可导入)
import { useUserStore } from '@/stores/user';
import { formatDate } from '@/utils/date';
import CommentList from '@/components/comment/CommentList.vue';
import { getCommentsByGuideId, createComment } from '@/api/comment';
// 导入用户相关的 API
import { followUser, unfollowUser, checkFollowing } from '@/api/user';
// 导入需要的 Element Plus 图标
import { Star, Collection, CollectionTag, Edit, Delete } from '@element-plus/icons-vue';

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
    // 在访问 guide.value 之前确保它不为 null
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

// Computed property for the tags string
const tagsString = computed(() => {
  return guide.value && guide.value.tags ? guide.value.tags.join(', ') : '';
});


const fetchGuideDetail = () => {
    getGuideDetail(route.params.id)
        .then(response => {
            guide.value = response.data.data;
            // console.log(guide.tags); // 调试时取消注释
            isLiked.value = response.data.data.liked;
            isFavorited.value = response.data.data.favorited;
            // transform string to array, if needed
            if (guide.value.tags && typeof guide.value.tags === 'string') {
                // 确保分割后去除可能存在的空格
                 guide.value.tags = guide.value.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else if (!guide.value.tags) {
                 guide.value.tags = []; // 确保 tags 是一个数组
            }

            // 在获取到 guide 详情后再执行依赖 guide.value 的操作
            if (userStore.isLoggedIn && guide.value) {
                 recordGuideView(userStore.currentUser.id, guide.value.id);
                 checkIsFollowing(); // 确保在 guide.value.userId 可用时调用
            }
            fetchComments(); // 获取评论
        })
        .catch(error => {
            console.error("Error fetching guide detail:", error);
            ElMessage.error('加载攻略详情失败');
            guide.value = null; // 加载失败时重置 guide
        });
};

const fetchComments = () => {
    // 确保 guide.value 存在且有 id
    if (!guide.value || !guide.value.id) return;
    getCommentsByGuideId(guide.value.id) // 使用 guide.value.id 而不是 route.params.id 保证一致性
        .then(res => {
            // 获取评论后，构建评论树
            comments.value = buildCommentTree(res.data.data || []); // 提供默认空数组防止出错
        })
        .catch(err => {
            console.log(err);
            ElMessage.error('加载评论失败');
        });
};

const isAuthor = computed(() => {
    // 在访问 guide.value 之前确保它不为 null
    return userStore.isLoggedIn && userStore.currentUser && guide.value && userStore.currentUser.id === guide.value.userId;
});

watch(
    () => route.params.id,
    (newId, oldId) => { // 添加 oldId 用于比较
        // 只有当 id 实际变化，或者首次加载（oldId 为 undefined）时才获取
        if (newId && newId !== oldId) {
            guide.value = null; // 重置 guide 数据，显示 loading
            comments.value = []; // 重置评论
            isLiked.value = false;
            isFavorited.value = false;
            isFollowing.value = false; // 重置关注状态
            fetchGuideDetail();
        }
    },
    { immediate: true } // 立即执行一次以处理初始加载
);

// 这部分逻辑在 CommentList 组件内部处理更佳，这里保留原逻辑以防万一
// const scrollToComment = (commentId) => {
//     nextTick(() => {
//         const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
//         if (commentElement) {
//             commentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//         }
//     });
// };

const toggleLike = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning("请先登录")
        router.push('/login')
        return
    }
    if (!guide.value) return; // 防止 guide 未加载时操作

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
        ElMessage.error('操作失败'); // 提供通用错误消息
    }
};

const toggleFavorite = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning("请先登录")
        router.push('/login')
        return
    }
    if (!guide.value) return; // 防止 guide 未加载时操作

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
        ElMessage.error('操作失败'); // 提供通用错误消息
    }
}
const deleteCurrentGuide = () => {
    if (!guide.value) return; // 防止 guide 未加载时操作

    deleteGuide(guide.value.id).then(() => {
        ElMessage.success('删除成功')
        router.push('/guides') // 或其他合适的跳转目标
    }).catch(err => {
        console.log(err)
        ElMessage.error('删除失败');
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
    if (!guide.value) return; // 防止 guide 未加载时操作

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
        ElMessage.error('评论失败');
    });
};

// 检查是否已关注
const checkIsFollowing = async () => {
    // 确保 guide.value 和 guide.value.userId 存在，并且不是在看自己的攻略
    if (!userStore.isLoggedIn || !guide.value || !guide.value.userId || isMe.value) {
        isFollowing.value = false; // 如果未登录、攻略数据不全或查看自己的攻略，则不显示关注按钮/状态
        return;
    }
    try {
        const response = await checkFollowing(guide.value.userId);
        isFollowing.value = response.data.data; // API 返回 boolean
    } catch (error) {
        console.error('Error checking follow status:', error);
        // 不提示错误，避免干扰用户
        isFollowing.value = false; // 出错时默认为未关注
    }
};

// 关注/取消关注
const toggleFollow = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login');
        return;
    }
     if (!guide.value || !guide.value.userId || isMe.value) {
         console.warn("Cannot follow/unfollow: guide data missing or viewing own profile.");
         return; // 防止无效操作
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

// 在组件挂载时获取初始数据
// onMounted(() => {
//  fetchGuideDetail(); // fetchGuideDetail 会在 watch immediate:true 时自动调用，这里可以省略
// });

</script>

<style scoped>
.guide-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff; /* 添加背景色以区分页面 */
    border-radius: 8px; /* 轻微圆角 */
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1); /* 添加阴影 */
}

/* 新增：图片容器样式 */
.guide-image-wrapper {
    width: 100%;
    max-height: 400px; /* 限制最大高度 */
    margin-bottom: 20px;
    overflow: hidden; /* 隐藏超出部分 */
    border-radius: 4px; /* 图片容器也加圆角 */
}

.guide-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保持图片比例并填充容器 */
    display: block; /* 移除图片底部多余的空白 */
}

.guide-detail h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
    color: #303133; /* 深灰色标题 */
}

.author-info {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    font-size: 14px;
    color: #606266; /* 常规灰色 */
}

.author-info a { /* 使链接样式更统一 */
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit; /* 继承父元素颜色 */
    transition: color 0.3s;
}
.author-info a:hover {
    color: #409EFF; /* 鼠标悬停时变蓝 */
}


.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 10px;
    border: 1px solid #eee; /* 给头像加个边框 */
}

.follow-button {
    margin-bottom: 1em; /* 与下方信息区隔开 */
}

.guide-info {
    font-size: 0.9em;
    color: #909399; /* 稍浅的灰色 */
    margin-bottom: 1.5em; /* 增加与内容区的间距 */
    display: flex; /* 使用 Flexbox 布局 */
    justify-content: flex-start; /* 从左侧开始排列 */
    flex-wrap: wrap;  /*当空间不足时换行*/
    gap: 15px; /* 使用 gap 属性设置间距 */
}
/* .guide-info > span{ */
    /* margin-right: 15px; /*添加右边距*/ /* 使用 gap 替代 */
/* } */
/* .guide-info > span:last-child { */
    /* margin-right: 0; 去掉最后一个的右边距 */ /* 使用 gap 后不再需要 */
/* } */


.guide-content {
    line-height: 1.8; /* 增加行高提高可读性 */
    margin-bottom: 20px;
    color: #303133; /* 内容使用深灰色 */
    white-space: pre-wrap; /* 保留换行和空格 */
    word-wrap: break-word; /* 允许长单词换行 */
}

.el-divider {
    margin: 20px 0; /* 分割线上下边距 */
}

.actions {
    margin-top: 20px;
    margin-bottom: 30px; /* 与评论区隔开 */
    display: flex;
    gap: 10px; /* 按钮间距 */
}

/* 修正 el-button 内的 el-icon 样式 */
.actions .el-button .el-icon {
    margin-right: 5px; /* 图标和文字间距 */
}
.actions .el-button > span { /* 确保图标和文字垂直居中 */
 display: inline-flex;
 align-items: center;
}


.comment-form {
    margin-top: 30px; /* 评论表单与列表的间距 */
    display: flex;
    flex-direction: column; /* 垂直排列输入框和按钮 */
    gap: 10px; /* 输入框和按钮间距 */
}

.comment-form .el-button {
    align-self: flex-end; /* 按钮靠右 */
}

/* 当没有攻略数据时显示Loading */
div[v-else] {
    text-align: center;
    padding: 50px;
    color: #909399;
}
</style>