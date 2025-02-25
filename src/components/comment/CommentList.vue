<template>
    <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
                <img :src="comment.userAvatar || defaultAvatar" class="avatar" />
                <span class="username">{{ comment.username }}</span>
                <span v-if="comment.parentCommentId" class="reply-info">
                    回复 @{{ comment.parentCommentUserName }}
                </span>
                <span class="create-time">{{ formatDate(comment.createTime) }}</span>
                <div class="actions" v-if="isAuthor(comment)">
                    <el-button type="text" size="small" @click="showEditForm(comment)">编辑</el-button>
                    <el-popconfirm title="确定删除这条评论吗？" @confirm="handleDelete(comment.id)">
                        <template #reference>
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
            <div class="comment-content">
                <template v-if="editingCommentId === comment.id">
                    <el-input type="textarea" :rows="3" v-model="editContent" placeholder="请输入评论内容"></el-input>
                    <el-button type="primary" size="small" @click="submitEdit(comment)">提交编辑</el-button>
                    <el-button size="small" @click="cancelEdit">取消</el-button>
                </template>
                <template v-else>
                    {{ comment.content }}
                </template>
            </div>

            <CommentList :comments="comment.replies" :guide-id="guideId" @comment-added="handleCommentAdded" />

            <el-button type="text" size="small" @click="showReplyForm(comment)">回复</el-button>

            <div v-if="replyFormVisible.get(comment.id)" class="reply-form">
                <el-input type="textarea" :rows="3" v-model="replyContent" placeholder="请输入回复内容"></el-input>
                <el-button type="primary" size="small" @click="submitReply(comment)">提交回复</el-button>
                <el-button size="small" @click="cancelReply(comment.id)">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, defineProps, onMounted, reactive, computed } from 'vue';
import { createComment, deleteComment, updateComment } from '@/api/comment'; // 引入 updateComment
import { ElMessage } from 'element-plus';
import { formatDate } from '@/utils/date';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
    guideId: {
        type: [String, Number],
        required: true
    },
    comments: {
        type: Array,
        default: () => []
    }
});

const userStore = useUserStore();
const router = useRouter()
const defaultAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');

const replyContent = ref('');

// 使用 Map 来存储每个评论的回复表单显示状态
const replyFormVisible = reactive(new Map());

const emit = defineEmits(['comment-added']);
const editingCommentId = ref(null);
const editContent = ref('');
const showEditForm = (comment) => {
    editingCommentId.value = comment.id;
    editContent.value = comment.content;
};


const submitEdit = (comment) => {
    if (!editContent.value.trim()) {
        ElMessage.warning('评论内容不能为空');
        return;
    }
    // 修改这里：将 id 也包含在 data 对象中
    updateComment(comment.id, { id: comment.id, content: editContent.value })
        .then(() => {
            ElMessage.success('评论修改成功');
            editingCommentId.value = null;
            editContent.value = '';
            emit('comment-added'); // 刷新评论列表
        })
        .catch(err => {
            console.error(err);
            ElMessage.error('评论修改失败');
        });
};


const cancelEdit = () => {
    editingCommentId.value = null;
    editContent.value = '';
};

// 提交回复
const submitReply = (parentComment) => {
    if (!replyContent.value.trim()) {
        ElMessage.warning('回复内容不能为空');
        return;
    }
    // 检查用户是否登录
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login'); // 可选
        return;
    }
    const data = {
        guideId: props.guideId,
        content: replyContent.value,
        parentCommentId: parentComment.id
    };
    createComment(data)
        .then(() => {
            ElMessage.success('回复成功');
            replyContent.value = '';
            // replyToCommentId.value = null; // 不需要了
            replyFormVisible.set(parentComment.id, false); // 关闭回复框
            emit('comment-added');
        })
        .catch(err => {
            console.log(err);
            ElMessage.error('Failed to reply');
        });
};

// 显示/隐藏回复输入框
const showReplyForm = (comment) => {
    // 初始化
    replyFormVisible.set(comment.id, true)
    replyContent.value = `@${comment.username} `;

};

// 取消回复
const cancelReply = (commentId) => {
    replyFormVisible.set(commentId, false); // 隐藏回复框
    replyContent.value = '';
};

// 判断当前用户是否是评论的作者 (代码不变)
const isAuthor = (comment) => {
    return computed(() => {
        return userStore.isLoggedIn && userStore.currentUser && comment.userId === userStore.currentUser.id;
    });
};

const handleCommentAdded = () => {
    emit('comment-added');
};

// 删除评论 (只有变化的部分)
const handleDelete = (commentId) => {
    deleteComment(commentId)
        .then(() => {
            ElMessage.success("删除成功");
            emit('comment-added'); // 触发父组件的 comment-added 事件
        })
        .catch(err => {
            console.log(err);
            ElMessage.error("删除失败");
        });
};
</script>

    <style scoped>
        .comment-list {
            margin-top: 20px;
        }

        .comment {
            border: 1px solid #eee;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        .comment-header {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            font-size: 14px;
            color: #666;
        }

        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .username {
            font-weight: bold;
            margin-right: 5px;
        }

        .reply-info {
            color: #409EFF;
            margin: 0 5px;
        }

        .create-time {
            margin-left: auto;
        }

        .comment-content {
            margin-left: 40px;
            /* 缩进，与头像对齐 */
            margin-bottom: 10px;
            line-height: 1.5;
            word-break: break-word;
            /* 处理长单词/URL 换行 */
        }

        .actions {
            margin-left: auto;
        }

        .reply-form {
            margin-left: 40px;
            /* 缩进，与父评论对齐 */
            margin-top: 10px;
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 5px;
        }

        .comment-form {
            margin-top: 20px;
        }
    </style>
