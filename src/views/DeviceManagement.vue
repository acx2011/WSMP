<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { RefreshCcw, RadioTower } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

interface Device {
  id: string
  name: string
  area: string
  type: string
  status: 'online' | 'offline' | 'fault'
  address: string
}

const devices = ref<Device[]>([
  { id: 'D-001', name: '办公楼报警主机', area: '1号办公楼', type: '报警主机', status: 'online', address: '192.168.10.21' },
  { id: 'D-014', name: '研发楼烟感回路', area: '2号研发楼', type: '防区模块', status: 'fault', address: '192.168.10.35' },
  { id: 'D-033', name: '宿舍楼红外探测器', area: '3号宿舍楼', type: '探测器', status: 'online', address: 'Bus-03-18' },
  { id: 'D-041', name: '门卫室通讯模块', area: '5号门卫室', type: '通讯模块', status: 'offline', address: '192.168.10.62' },
])

const statusText: Record<Device['status'], string> = {
  online: '在线',
  offline: '离线',
  fault: '故障',
}
</script>

<template>
  <PlatformLayout>
    <div class="module-page">
      <section class="module-hero panel">
        <div>
          <span>Device Inventory</span>
          <h1>设备管理</h1>
        </div>
        <div class="hero-actions">
          <button type="button" @click="ElMessage.success('设备状态已刷新')">
            <RefreshCcw :size="17" />
            刷新状态
          </button>
        </div>
      </section>

      <section class="panel module-table">
        <div class="table-row table-head">
          <span>设备编号</span>
          <span>设备名称</span>
          <span>区域</span>
          <span>类型</span>
          <span>状态</span>
          <span>地址</span>
        </div>
        <div v-for="device in devices" :key="device.id" class="table-row">
          <strong>{{ device.id }}</strong>
          <span><RadioTower :size="15" /> {{ device.name }}</span>
          <span>{{ device.area }}</span>
          <span>{{ device.type }}</span>
          <span :class="['status-pill', device.status]">{{ statusText[device.status] }}</span>
          <span>{{ device.address }}</span>
        </div>
      </section>
    </div>
  </PlatformLayout>
</template>
