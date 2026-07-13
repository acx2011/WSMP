import { createRouter, createWebHistory } from 'vue-router'
import AlarmMonitoring from '@/views/AlarmMonitoring.vue'
import ArmingManagement from '@/views/ArmingManagement.vue'
import AutoArmSchedule from '@/views/AutoArmSchedule.vue'
import CampusOverview from '@/views/CampusOverview.vue'
import DeviceManagement from '@/views/DeviceManagement.vue'
import EventRecords from '@/views/EventRecords.vue'
import MapOutlineEditor from '@/views/MapOutlineEditor.vue'
import SystemConfig from '@/views/SystemConfig.vue'
import UserPermissions from '@/views/UserPermissions.vue'
import VideoLinkage from '@/views/VideoLinkage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'CampusOverview',
      component: CampusOverview,
      meta: {
        title: '园区总览',
        parent: '首页',
      },
    },
    {
      path: '/alarm-monitoring',
      name: 'AlarmMonitoring',
      component: AlarmMonitoring,
      meta: { title: '报警监控', parent: '首页' },
    },
    {
      path: '/arming-management',
      name: 'ArmingManagement',
      component: ArmingManagement,
      meta: { title: '布防管理', parent: '首页' },
    },
    {
      path: '/device-management',
      name: 'DeviceManagement',
      component: DeviceManagement,
      meta: { title: '设备管理', parent: '首页' },
    },
    {
      path: '/auto-arm-schedule',
      name: 'AutoArmSchedule',
      component: AutoArmSchedule,
      meta: { title: '自动布防计划', parent: '首页' },
    },
    {
      path: '/event-records',
      name: 'EventRecords',
      component: EventRecords,
      meta: { title: '事件记录', parent: '首页' },
    },
    {
      path: '/video-linkage',
      name: 'VideoLinkage',
      component: VideoLinkage,
      meta: { title: '视频联动', parent: '首页' },
    },
    {
      path: '/users-permissions',
      name: 'UserPermissions',
      component: UserPermissions,
      meta: { title: '用户与权限', parent: '首页' },
    },
    {
      path: '/system/config',
      name: 'SystemConfig',
      component: SystemConfig,
      meta: { title: '系统参数', parent: '系统配置' },
    },
    {
      path: '/system/map-outline-editor',
      name: 'MapOutlineEditor',
      component: MapOutlineEditor,
      meta: {
        title: '地图轮廓编辑',
        parent: '系统配置',
      },
    },
  ],
})

export default router
