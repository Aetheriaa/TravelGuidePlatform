<template>
    <!-- 模板结构保持不变 -->
    <el-card class="product-card" shadow="hover">
        <div class="card-content-wrapper">
            <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }" class="card-link">
                <!-- 图片区域 -->
                <div class="image-wrapper" v-if="product.image">
                    <el-image class="product-image" :src="product.image" fit="cover" :alt="product.name" lazy :preview-src-list="[product.image]" :initial-index="0" hide-on-click-modal>
                        <template #error>
                            <div class="image-slot-error">
                                <el-icon><Picture /></el-icon>
                                <span>图片加载失败</span>
                            </div>
                        </template>
                    </el-image>
                </div>

                <!-- 信息区域 -->
                <div :class="['product-info-area', { 'no-image': !product.image }]">
                    <h3 class="product-title">{{ product.name }}</h3>
                    <div class="product-meta">
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
                     <div v-if="!product.image" class="product-description-no-image">
                        <p v-for="(part, index) in descriptionParts" :key="index" class="product-summary">
                            {{ part }}
                        </p>
                     </div>
                </div>
            </router-link>
        </div>

        <!-- 操作按钮区域 -->
        <div class="product-actions">
            <el-button size="small" type="primary" text :icon="View" @click="gotoDetail(product)"> 查看 </el-button>
            <el-button v-if="isProductAuthor" size="small" type="primary" text :icon="EditPen" @click="gotoUpdate(product)"> 编辑 </el-button>
            <el-popconfirm v-if="isProductAuthor" :title="`确认${product.status === 1 ? '下架' : '上架'}该商品?`" @confirm="handleUpdateStatus(product)">
                <template #reference>
                    <el-button size="small" :type="product.status === 1 ? 'warning' : 'success'" text :icon="product.status === 1 ? Bottom : Top"> {{ product.status === 1 ? '下架' : '上架' }} </el-button>
                </template>
            </el-popconfirm>
        </div>
    </el-card>
</template>

<script setup>
// ... Script 部分无需修改 ...
import { defineProps, computed, defineEmits } from 'vue';
import { formatDate } from '@/utils/date';
import { View, EditPen, Delete, Top, Bottom, Picture } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { updateProductStatus, deleteProduct } from '@/api/product';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const props = defineProps({ product: { type: Object, required: true, }, });
const emit = defineEmits(["update"]);
const router = useRouter();
const userStore = useUserStore();
const isProductAuthor = computed(() => { return userStore.isLoggedIn && userStore.currentUser && userStore.currentUser.id === props.product.userId; });
const getProductTypeLabel = (type) => { const map = { flight: '交通票据', hotel: '住宿酒店', ticket: '景点门票', package: '美食套餐', }; return map[type] || type || ''; };
const gotoDetail = (product) => { router.push({ name: 'ProductDetail', params: { id: product.id } }); };
const gotoUpdate = (product) => { router.push({ name: 'ProductUpdate', params: { id: product.id } }); };
const descriptionParts = computed(() => { if (props.product && props.product.description) { return props.product.description.split(',').map(s => s.trim()).filter(s => s); } return []; });
const handleUpdateStatus = (product) => { let newStatus = product.status === 1 ? 0 : 1; updateProductStatus(product.id, newStatus).then(() => { ElMessage.success(newStatus === 1 ? "上架成功" : "下架成功"); emit("update"); }).catch(err => { console.error("更新状态时出错:", err); ElMessage.error(newStatus === 1 ? "上架失败" : "下架失败"); }); };
const handleDelete = (id) => { deleteProduct(id).then(() => { ElMessage.success('产品删除成功'); emit('update'); }).catch((error) => { console.error('删除产品时出错:', error); ElMessage.error('删除失败'); }); };
</script>

<style scoped>
/* 确保卡片尝试填充父容器高度 */
.product-card {
   height: 100%;
   border-radius: 8px;
   overflow: hidden;
   /* display: flex 和 flex-direction 不再需要直接应用在根元素上 */
}

/* --- 关键修改：使用 :deep() 操作 el-card 内部的 body --- */
.product-card :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    /* 让 body 高度 100% 填充卡片可用空间
       这依赖于 .product-card 自身有有效的高度（来自父容器）*/
    height: 100%;
    padding: 0; /* 重置 Element Plus 的 body 内边距，我们在内部控制 */
}

/* 内容包装器，现在是 .el-card__body 的直接子元素 */
.card-content-wrapper {
    flex-grow: 1; /* 让内容区伸展，填充可用空间 */
    display: flex;
    flex-direction: column;
    min-height: 0; /* 防止 flex 布局在内容溢出时的计算问题 */
    overflow: hidden; /* 隐藏可能溢出的内容 */
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
    height: 180px; /* 保持调整后的高度 */
    flex-shrink: 0;
    background-color: #f5f7fa;
}

.product-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.image-slot-error { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #f5f7fa; color: #c0c4cc; font-size: 14px; }
.image-slot-error .el-icon { font-size: 30px; margin-bottom: 5px; }

/* 信息区域，需要自己处理内边距 */
.product-info-area {
    padding: 15px; /* 在这里设置内边距 */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /* 不再需要 flex-grow，由父级 .card-content-wrapper 控制 */
}

.product-info-area.no-image {
    justify-content: flex-start;
    /* 可以设定一个最小高度，保证无图时不会太扁 */
    min-height: 90px;
}

.product-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.3; }
.product-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 10px; flex-wrap: wrap; }
.product-details { display: flex; flex-direction: column; gap: 4px; color: #606266; font-size: 0.85rem; margin-bottom: 10px; line-height: 1.5; }
.product-details p { margin: 0; }

.product-description-no-image {
    margin-top: auto; /* 尝试将描述推向其容器底部 */
    padding-top: 8px;
    overflow: hidden;
}

.product-summary { font-size: 0.85rem; color: #666; line-height: 1.6; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 4; /* 保持限制行数 */ line-clamp: 4; -webkit-box-orient: vertical; margin: 0 0 5px 0; }

/* 操作按钮区域，现在是 .el-card__body 的直接子元素 */
.product-actions {
    padding: 8px 15px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-shrink: 0; /* 必须，防止被压缩 */
    background-color: #fff;
    /* margin-top: auto; 不再需要 */
}
</style>