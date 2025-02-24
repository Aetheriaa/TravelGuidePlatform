<template>
    <div class="search-result-page">
        <Header />
        <div class="search-result-container">
            <el-card class="search-result-card" shadow="hover">
                <h1 class="search-result-title">
                    <i class="el-icon-search"></i> 搜索结果：
                    <span class="keyword">{{ keyword }}</span>
                </h1>

                <el-tabs v-model="activeTab" class="result-tabs">
                    <el-tab-pane label="攻略" name="guides">
                        <div v-if="guides.length > 0">
                            <el-row :gutter="20" class="result-grid">
                                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in guides" :key="'g' + guide.id">
                                    <GuideCard :guide="guide" />
                                </el-col>
                            </el-row>
                            <!-- 分页组件 -->
                            <el-pagination v-model:current-page="guidePage" v-model:page-size="pageSize"
                                :page-sizes="[12, 24, 96, 192]" layout="total, sizes, prev, pager, next, jumper"
                                :total="guideTotal" @size-change="handleSizeChange"
                                @current-change="handleCurrentChange">
                            </el-pagination>
                        </div>
                        <div v-else>
                            <p>没有找到相关的攻略。</p>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="产品" name="products">
                        <div v-if="products.length > 0">
                            <el-row :gutter="20" class="result-grid">
                                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products"
                                    :key="'p' + product.id">
                                    <ProductCard :product="product" />
                                </el-col>
                            </el-row>
                            <!-- 分页组件 -->
                            <el-pagination v-model:current-page="productPage" v-model:page-size="pageSize"
                                :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                                :total="productTotal" @size-change="handleSizeChange"
                                @current-change="handleCurrentChange">
                            </el-pagination>
                        </div>
                        <div v-else>
                            <p>没有找到相关的产品。</p>
                        </div>

                    </el-tab-pane>
                    <!-- 如果需要，可以添加搜索用户的标签页 -->
                    <!-- <el-tab-pane label="用户" name="users">
                <div v-if="users.length > 0">
                  <ul>
                    <li v-for="user in users" :key="user.id">{{ user.username }}</li>
                  </ul>
                </div>
                <div v-else>
                  <p>没有找到相关的用户。</p>
                </div>
              </el-tab-pane> -->
                </el-tabs>
            </el-card>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { searchGuides } from '@/api/guide'; // 导入搜索攻略的 API
import { searchProducts } from '@/api/product'; // 导入搜索产品的 API
import GuideCard from '@/components/guide/GuideCard.vue';
import ProductCard from '@/components/product/ProductCard.vue';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { Search } from '@element-plus/icons-vue';  // 引入图标

const route = useRoute();
const keyword = ref('');
const activeTab = ref('guides'); // 默认显示攻略标签页
const guides = ref([]);
const products = ref([]);
// const users = ref([]); // 如果需要搜索用户

//分页
const guidePage = ref(1)
const productPage = ref(1)
const pageSize = ref(12)

//总数
const guideTotal = ref(0)
const productTotal = ref(0)

// 将 search 函数的定义放在 watch 之前!!!
const search = () => {
    if (!keyword.value) {
        return;
    }

    // 搜索攻略
    searchGuides({ keyword: keyword.value, page: guidePage.value, pageSize: pageSize.value })
        .then(response => {
            guides.value = response.data.data.records;
            guideTotal.value = response.data.data.total; // 设置攻略总数
        })
        .catch(error => {
            console.error("Error searching guides:", error);
        });

    // 搜索产品
    searchProducts({ keyword: keyword.value, page: productPage.value, pageSize: pageSize.value })
        .then(response => {
            products.value = response.data.data.records;
            productTotal.value = response.data.data.total; // 设置产品总数
        })
        .catch(error => {
            console.error("Error searching products:", error);
        });

    // 如果需要，搜索用户
    // searchUsers(keyword.value)
    //   .then(response => {
    //     users.value = response.data;
    //   })
    //   .catch(error => {
    //     console.error("Error searching users:", error);
    //   });
};

onMounted(() => {
    keyword.value = route.query.keyword;
    search();
});

// 监听路由参数变化 (兼容手动修改url搜索)
watch(() => route.query.keyword, (newVal) => {
    keyword.value = newVal
    search() //  再次调用
}, { immediate: true })

//分页
const handleSizeChange = (size) => {
    pageSize.value = size;
    search(); // 重新搜索
};
const handleCurrentChange = (current) => {
    //  根据当前激活的标签页，更新对应的页码
    if (activeTab.value === 'guides') {
        guidePage.value = current;
    } else if (activeTab.value === 'products') {
        productPage.value = current;
    }
    search();
}
</script>

<style scoped>
.search-result-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.search-result-container {
    flex-grow: 1;
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.search-result-card {
    border-radius: 8px;
    padding: 20px;
}

.search-result-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    display: flex;
    /* 使用 Flexbox */
    align-items: center;
    /* 垂直居中 */
    gap: 10px;
}

.keyword {
    color: #409eff;
    /* 关键词颜色 */
    font-weight: normal;
    margin-left: 5px;
}

.result-tabs .el-tabs__header {
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
}

.result-tabs .el-tabs__item {
    font-size: 16px;
    color: #606266;
}

.result-tabs .el-tabs__item.is-active {
    color: #409eff;
    font-weight: bold;
}

.result-grid {
    margin-bottom: 20px;
}
</style>