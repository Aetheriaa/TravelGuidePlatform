<template>
    <el-card class="product-card" shadow="hover">
        <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }" class="card-link">
            <div class="image-wrapper" v-if="product.image">
                <el-image class="product-image" :src="product.image" fit="cover" :alt="product.name"
                    :preview-src-list="[product.image]">
                </el-image>
            </div>
            <div v-else class="no-image-text">
                <p class="product-title">{{ product.name }}</p>
                <!-- <p class="product-summary">{{ product.description }}</p> -->
                <div >
                    <p class="product-title">{{ product.name }}</p>
                    <!-- 使用 v-for 渲染分割后的描述 -->
                    <p v-for="(part, index) in descriptionParts" :key="index" class="product-summary">
                        {{ part }}
                    </p>
                </div>
            </div>
            <div class="product-content" v-if="product.image">
                <!-- 有图片时才显示 -->
                <h3 class="product-title">{{ product.name }}</h3>
                <div class="product-info">
                    <span class="product-type">
                        <el-tag size="small" type="info">{{ getProductTypeLabel(product.type) }}</el-tag>
                    </span>
                    <span class="product-status">
                        <el-tag :type="product.status === 1 ? 'success' : 'danger'" effect="dark" size="small">
                            {{ product.status === 1 ? '上架中' : '已下架' }}
                        </el-tag>
                    </span>
                </div>
                <div class="product-details">
                    <p>价格: {{ product.price }}</p>
                    <p>库存: {{ product.stock }}</p>
                    <p>创建时间: {{ formatDate(product.createTime) }}</p>
                </div>
            </div>
        </router-link>
        <div class="product-actions">
            <el-button size="small" type="primary" text :icon="View" @click="gotoDetail(product)">
                查看
            </el-button>
            <el-button v-if="isProductAuthor" size="small" type="primary" text :icon="EditPen"
                @click="gotoUpdate(product)">
                编辑
            </el-button>
            <el-popconfirm v-if="isProductAuthor" :title="`确认${product.status === 1 ? '下架' : '上架'}该商品?`"
                @confirm="handleUpdateStatus(product)">
                <template #reference>
                    <el-button size="small" type="warning" text :icon="product.status === 1 ? Bottom : Top">
                        {{ product.status === 1 ? '下架' : '上架' }}
                    </el-button>
                </template>
            </el-popconfirm>
            <!-- <el-popconfirm v-if="isProductAuthor" title="确定删除此产品吗？" @confirm="handleDelete(product.id)">
                <template #reference>
                    <el-button size="small" type="danger" text :icon="Delete">删除</el-button>
                </template>
            </el-popconfirm> -->
        </div>
    </el-card>
</template>

<script setup>
import { defineProps, computed,  ref } from 'vue';
import { formatDate } from '@/utils/date'; // 你的日期格式化函数
import { View, EditPen, Delete, Top, Bottom } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { updateProductStatus, deleteProduct } from '@/api/product'; // 假设的 API
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';



const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const router = useRouter();
const userStore = useUserStore()
const isProductAuthor = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser && userStore.currentUser.id === props.product.userId;
})

const getProductTypeLabel = (type) => {
    const productTypeMap = {
        flight: '交通票据',
        hotel: '住宿酒店',
        ticket: '景点门票',
        package: '美食套餐',
    };
    return productTypeMap[type] || type || '';
};
const gotoDetail = (product) => {
    router.push({ name: 'ProductDetail', params: { id: product.id } });
};

const gotoUpdate = (product) => {
    router.push({ name: 'ProductUpdate', params: { id: product.id } });
};

const descriptionParts = computed(() => {
    if (props.product && props.product.description) {
        return props.product.description.split(','); 
    }
    return []; // 如果没有描述，返回空数组
});

const handleUpdateStatus = (product) => {
    let newStatus = product.status === 1 ? 0 : 1;
    updateProductStatus(product.id, newStatus).then(res => {
        ElMessage.success(newStatus === 1 ? "上架成功" : "下架成功");
        // props.product.status = newStatus; //直接修改props, 会触发vue的警告, 最好是通过emit事件
        //emit事件来通知父组件更新
        emit("update"); //触发update事件
    }).catch(err => {
        console.log(err);
        ElMessage.error(newStatus === 1 ? "上架失败" : "下架失败");
    });
}
// 新增删除商品逻辑
const handleDelete = (id) => {
    deleteProduct(id)
        .then(() => {
            ElMessage.success('产品删除成功');
            emit('update')
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
            ElMessage.error('删除失败');
        });
};
const emit = defineEmits(["update"])
const imageError = ref(false);
const handleImageError = () => {
    imageError.value = true
}
</script>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 8px;
    overflow: hidden;
}

.card-link {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    text-decoration: none;
    color: inherit;
}

.image-wrapper {
    width: 100%;
    height: 200px;
    /* 或者你想要的高度 */
    object-fit: cover;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.product-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
    flex-wrap: wrap;
}

.product-type {
    margin-right: auto;
    /* 将类型标签推到最左边 */
}

.product-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #666;
    font-size: 14px;
    margin-bottom: auto;
}

.product-actions {
    margin-top: auto;
    /* 将操作按钮推到底部 */
    padding: 10px 15px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

/* 无图片时的文本样式 */
.no-image-text {
    padding: 15px;
    /* 与 product-content 的 padding 一致 */
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: 284px;
    /* 和有图片时保持一致 */
}

.no-image-text .product-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
    /* 调整间距 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
    /* 深色标题 */
}

.no-image-text .product-summary {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    /* 显示更多行 */
    line-clamp: 8;
    -webkit-box-orient: vertical;
}
</style>