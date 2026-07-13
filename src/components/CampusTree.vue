<script setup lang="ts">
import { computed, ref } from 'vue'
import { Building2, Search } from '@/icons/lucide'
import { useSecurityStore } from '@/stores/security'

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
}

const store = useSecurityStore()
const keyword = ref('')
const defaultExpanded = ['park', 'building-1-node', 'external-node']

const treeData: TreeNode[] = [
  {
    id: 'park',
    label: 'WinPoint科技园区',
    children: [
      {
        id: 'building-1-node',
        label: '1号办公楼',
        children: [
          { id: 'floor-1', label: '1层' },
          { id: 'floor-2', label: '2层' },
          { id: 'floor-3', label: '3层' },
          { id: 'floor-4', label: '4层' },
        ],
      },
      { id: 'building-2', label: '2号研发楼' },
      { id: 'building-3', label: '3号宿舍楼' },
      { id: 'building-4', label: '4号仓库' },
      { id: 'guard', label: '5号门卫室' },
      {
        id: 'external-node',
        label: '外部区域',
        children: [
          { id: 'parking', label: '停车场' },
          { id: 'perimeter', label: '围墙周界' },
          { id: 'gate', label: '大门入口' },
        ],
      },
    ],
  },
]

const filteredData = computed(() => {
  if (!keyword.value.trim()) return treeData
  const match = (node: TreeNode): TreeNode | null => {
    const children = node.children?.map(match).filter((item): item is TreeNode => Boolean(item))
    if (node.label.includes(keyword.value.trim()) || (children && children.length > 0)) {
      return { ...node, children }
    }
    return null
  }
  return treeData.map(match).filter((item): item is TreeNode => Boolean(item))
})

const handleNodeClick = (node: TreeNode) => {
  const directMap: Record<string, string> = {
    'building-1-node': 'building-1',
    park: 'building-1',
    'external-node': 'parking',
    'floor-2': 'building-1',
    'floor-3': 'building-1',
    'floor-4': 'building-1',
  }
  store.selectArea(directMap[node.id] ?? node.id)
}
</script>

<template>
  <section class="campus-tree panel">
    <div class="panel-title">
      <span>园区/建筑</span>
      <Building2 :size="18" />
    </div>

    <div class="search-box">
      <Search :size="16" />
      <input v-model="keyword" type="text" placeholder="搜索园区或建筑" />
    </div>

    <el-tree
      class="tree"
      node-key="id"
      :data="filteredData"
      :default-expanded-keys="defaultExpanded"
      :props="{ label: 'label', children: 'children' }"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <span class="tree-node" :class="{ selected: store.selectedAreaId === data.id || (data.id === 'building-1-node' && store.selectedAreaId === 'building-1') }">
          {{ data.label }}
        </span>
      </template>
    </el-tree>
  </section>
</template>

<style scoped lang="scss">
.campus-tree {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  padding: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  margin: 16px 0;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(4, 12, 23, 0.6);
  color: var(--text-secondary);
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
}

.search-box input::placeholder {
  color: #6e7e91;
}

.tree {
  flex: 1;
  overflow: auto;
  background: transparent;
  color: var(--text-secondary);
  --el-tree-node-hover-bg-color: rgba(22, 119, 255, 0.12);
}

:deep(.el-tree-node__content) {
  height: 34px;
  border-radius: 7px;
}

:deep(.el-tree-node__expand-icon) {
  color: #72839a;
}

.tree-node {
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border-radius: 7px;
}

.tree-node.selected {
  background: rgba(22, 119, 255, 0.22);
  color: #dbefff;
}
</style>
