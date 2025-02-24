<template>
    <div class="itinerary-detail-form">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-form-item label="类型">
                    <el-select v-model="localType" placeholder="请选择类型">
                        <el-option label="景点" value="attraction"></el-option>
                        <el-option label="酒店" value="hotel"></el-option>
                        <el-option label="交通" value="transport"></el-option>
                        <el-option label="餐厅" value="restaurant"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="项目ID">
                    <el-input v-model.number="localItemId" placeholder="请输入项目ID"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="天数">
                    <el-input-number v-model.number="localDay" :min="1" placeholder="请输入天数"></el-input-number>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-form-item label="开始时间">
                    <el-time-picker v-model="localStartTime" placeholder="选择开始时间" value-format="HH:mm"></el-time-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="结束时间">
                    <el-time-picker v-model="localEndTime" placeholder="选择结束时间" value-format="HH:mm"></el-time-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-button type="danger" size="small" @click="emitRemove">删除</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="备注">
                    <el-input v-model="localNotes" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue';
// 使用计算属性处理 v-model
const props = defineProps({
    type: String,
    itemId: Number,
    day: Number,
    startTime: String,
    endTime: String,
    notes: String,
});

const emit = defineEmits(['remove', 'update:type', 'update:itemId', 'update:day', 'update:startTime', 'update:endTime', 'update:notes']);

// 使用计算属性创建本地响应式副本
const localType = computed({
    get: () => props.type,
    set: (value) => emit('update:type', value) // 使用 'update:propName' 格式触发事件
});

const localItemId = computed({
    get: () => props.itemId,
    set: value => emit('update:itemId', value)
})
const localDay = computed({
    get: () => props.day,
    set: value => emit('update:day', value)
})
const localStartTime = computed({
    get: () => props.startTime,
    set: value => emit('update:startTime', value)
})
const localEndTime = computed({
    get: () => props.endTime,
    set: value => emit('update:endTime', value)
})
const localNotes = computed({
    get: () => props.notes,
    set: value => emit('update:notes', value)
})

const emitRemove = () => {
    emit('remove');
};
</script>

<style scoped>
/* 添加一些样式 */
</style>