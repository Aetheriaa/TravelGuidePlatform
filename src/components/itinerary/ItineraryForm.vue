<template>
    <el-form :model="itinerary" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="行程名称" prop="name">
            <el-input v-model="itinerary.name" placeholder="请输入行程名称"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="itinerary.startDate" type="date" placeholder="选择开始日期"
                value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
            <el-date-picker v-model="itinerary.endDate" type="date" placeholder="选择结束日期"
                value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="行程描述" prop="description">
            <el-input v-model="itinerary.description" type="textarea" :rows="3" placeholder="请输入行程描述"></el-input>
        </el-form-item>

        <!-- 行程详情 -->
        <el-form-item label="行程详情">
            <el-button type="primary" size="small" @click="addDetail">添加行程详情</el-button>
            <el-button type="success" size="small" @click="addDay">添加一天</el-button>

            <div v-for="(detail, index) in itinerary.details" :key="index" class="detail-item">
                <!-- 使用 ItineraryDetailForm 组件 -->
                <ItineraryDetailForm v-model:type="detail.type" v-model:itemId="detail.itemId" v-model:day="detail.day"
                    v-model:startTime="detail.startTime" v-model:endTime="detail.endTime" v-model:notes="detail.notes"
                    @remove="removeDetail(index)" />
                <el-divider></el-divider>
            </div>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm">{{ isEdit ? '保存修改' : '创建行程' }}</el-button>
            <el-button @click="cancelForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import ItineraryDetailForm from './ItineraryDetailForm.vue'; // 导入行程详情表单组件

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    itineraryData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['submit', 'cancel']);
const formRef = ref(null);
const itinerary = reactive({
    name: '',
    startDate: null,
    endDate: null,
    description: '',
    details: [] // 行程详情列表
});

const rules = reactive({
    name: [
        { required: true, message: '请输入行程名称', trigger: 'blur' }
    ],
    startDate: [
        { required: true, message: '请选择开始日期', trigger: 'change' }
    ],
    endDate: [
        { required: true, message: '请选择结束日期', trigger: 'change' }
    ]
});

// 添加行程详情
const addDetail = () => {
    itinerary.details.push({
        type: '',
        itemId: null,
        day: 1, // 默认添加到第一天
        startTime: null,
        endTime: null,
        notes: ''
    });
};
// 添加一天，可以添加多天
const addDay = () => {
    const maxDay = itinerary.details.reduce((max, detail) => Math.max(max, detail.day), 0); //找到最大的day
    itinerary.details.push({
        type: '',
        itemId: null,
        day: maxDay + 1, //新添加的放在最后一天
        startTime: null,
        endTime: null,
        notes: ''
    });
};

// 移除行程详情
const removeDetail = (index) => {
    itinerary.details.splice(index, 1);
};

// 提交表单
const submitForm = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            emit('submit', itinerary);
        }
    });
};

// 取消
const cancelForm = () => {
    emit('cancel');
};
onMounted(() => {
    if (props.isEdit) {
        // 将传入的 itineraryData 复制到响应式对象 itinerary 中
        Object.assign(itinerary, props.itineraryData);
    }
})
</script>

<style scoped>
.detail-item {
    border: 1px solid #eee;
    padding: 10px;
    margin-bottom: 10px;
}
</style>