<template>
    <div class="reply-item">
        <div class="reply-header">
            <img :src="reply.userAvatar || defaultAvatar" class="avatar" />
            <span class="username">{{ reply.username }}</span>
            <span v-if="reply.parentReplyId" class="reply-info">
                回复 @{{ reply.parentReplyUsername }}
            </span>
            <span class="create-time">{{ formatDate(reply.createTime) }}</span>
            <div class="actions" v-if="isAuthor(reply)">
                <el-button type="text" size="small" @click="showEditForm(reply)">编辑</el-button>
                <el-popconfirm title="确定删除这条回复吗？" @confirm="handleDelete(reply.id)">
                    <template #reference>
                        <el-button type="text" size="small">删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
        <div class="reply-content">
            <template v-if="editingReplyId === reply.id">
                <el-input type="textarea" :rows="3" v-model="editContent" placeholder="请输入回复内容"></el-input>
                <el-button type="primary" size="small" @click="submitEdit(reply)">提交编辑</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
            </template>
            <template v-else>
                {{ reply.content }}
            </template>
        </div>

        <!-- 递归显示回复 -->
        <ReplyList :replies="reply.replies" :topic-id="topicId" @reply-created="$emit('reply-created')" />

        <el-button type="text" size="small" @click="showReplyForm(reply)">回复</el-button>

        <!-- 回复表单 -->
        <div v-if="replyFormVisible.get(reply.id)" class="reply-form">
            <el-input type="textarea" :rows="3" v-model="replyContent" placeholder="请输入回复内容"></el-input>
            <el-button type="primary" size="small" @click="submitReply(reply)">提交回复</el-button>
            <el-button size="small" @click="cancelReply(reply.id)">取消</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, reactive, computed } from 'vue';
import { deleteReply, updateReply, createReply } from '@/api/reply'; // 导入 updateReply
import { ElMessage } from 'element-plus';
import { formatDate } from '@/utils/date';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import ReplyList from './ReplyList.vue'
const props = defineProps({
    topicId: {
        type: Number,
        required: true
    },
    reply: { // 父评论
        type: Object,
        required: true
    }
});

const userStore = useUserStore();
const router = useRouter()
const defaultAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');
const replyContent = ref(''); // 回复的内容

// 使用 Map 来存储每个评论的回复表单显示状态
const replyFormVisible = reactive(new Map());

const emit = defineEmits(['reply-created']); // 用于通知父组件回复已创建, 让父组件重新获取数据
const editingReplyId = ref(null);
const editContent = ref('');
const showEditForm = (reply) => {
    editingReplyId.value = reply.id;
    editContent.value = reply.content;
};
// 修改评论
const submitEdit = (reply) => {
    if (!editContent.value.trim()) {
        ElMessage.warning('回复内容不能为空');
        return;
    }
    // 修改这里：将 id 也包含在 data 对象中
    updateReply(reply.id, { content: editContent.value })
        .then(() => {
            ElMessage.success('回复修改成功');
            editingReplyId.value = null;
            editContent.value = '';
            emit('reply-created'); // 刷新评论列表
        })
        .catch(err => {
            console.log(err);
            ElMessage.error('回复修改失败');
        });
};

const cancelEdit = () => {
    editingReplyId.value = null;
    editContent.value = '';
};

// 提交回复
const submitReply = (parentReply) => {
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
        topicId: props.topicId, // 使用 props.topicId
        content: replyContent.value,
        parentReplyId: parentReply.id
    };
    createReply(data)
        .then(() => {
            ElMessage.success('回复成功');
            replyContent.value = '';
            replyFormVisible.set(parentReply.id, false); // 关闭回复框
            emit('reply-created');
        })
        .catch(err => {
            console.log(err);
            ElMessage.error("回复失败");
        });
};

// 显示/隐藏回复输入框
const showReplyForm = (reply) => {
    // 初始化
    replyFormVisible.set(reply.id, true)
    replyContent.value = `@${reply.username} `;

};

// 取消回复
const cancelReply = (replyId) => {
    replyFormVisible.set(replyId, false); // 隐藏回复框
    replyContent.value = '';
};

// 判断当前用户是否是评论的作者
const isAuthor = (reply) => {
    return computed(() => {
        return userStore.isLoggedIn && userStore.currentUser && reply.userId === userStore.currentUser.id;
    });
};

const handleCommentAdded = () => {
    emit('comment-added');
};

// 删除评论
const handleDelete = (replyId) => {
    deleteReply(replyId)
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