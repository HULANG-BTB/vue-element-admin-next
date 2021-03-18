<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Role</el-button>

    <el-table :data="roleList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template #default="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template #default="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialog.show" :title="dialog.mode === 2 ? 'Edit Role' : 'New Role'">
      <el-form :model="dialog.data.role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="dialog.data.role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input v-model="dialog.data.role.description" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="Role Description" />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="dialog.data.checkStrictly"
            :data="routesData"
            :props="{
              children: 'children',
              label: 'title'
            }"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialog.show = false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeMount, reactive, ref } from 'vue'
import { deepClone } from '@/utils'
import path from 'path'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default defineComponent({
  name: 'RolePermission',
  setup() {
    const dialog = reactive<any>({
      show: false,
      mode: 1,
      data: {}
    })

    let serviceRoutes: any = null

    const tree = ref<any>(null)

    const role = ref<any>(null)

    const roleList = ref<any[]>([])

    const routes = ref<any>([])

    const handleAddRole = () => {
      dialog.data.role = Object.assign({}, defaultRole)
      tree.value?.setCheckedNodes([])
      dialog.show = true
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCheckedNodes([])
      // }
      // this.dialogType = 'new'
      // this.dialogVisible = true
    }

    const onlyOneShowingChild = (children: any[] = [], parent: any) => {
      let onlyOneChild = null
      const showingChildren = children.filter((item) => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }

    const generateArr = (routes: any[]) => {
      let data: any = []
      routes.forEach((route: any) => {
        data.push(route)
        if (route.children) {
          const temp = generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    }

    const generateRoutes = (routes: any[], basePath = '/') => {
      const res: any[] = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneChild = onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneChild && !route.alwaysShow) {
          route = onlyOneChild
        }

        const data: any = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        // recursive child routes
        if (route.children) {
          data.children = generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    }

    const handleEdit = (scope: any) => {
      dialog.mode = 2
      dialog.data = {
        role: deepClone(scope.row),
        checkStrictly: true
      }
      dialog.show = true

      nextTick(() => {
        const routes = generateRoutes(scope.row.routes)
        tree.value?.setCheckedNodes(generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        dialog.data.checkStrictly = false
      })
    }

    const handleDelete = ({ $index, row }: any) => {
      ElMessageBox.confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row.key)
          roleList.value.splice($index, 1)
          ElMessage({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch((err) => {
          console.error(err)
        })
    }

    const generateTree = (routes: any[], basePath = '/', checkedKeys: any) => {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    }

    const confirmRole = async () => {
      const isEdit = dialog.mode === 2

      const checkedKeys = tree.value?.getCheckedKeys()
      dialog.data.role.routes = generateTree(deepClone(serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(dialog.data.role.key, dialog.data.role)
        for (let index = 0; index < roleList.value.length; index++) {
          if (roleList.value[index].key === dialog.data.role.key) {
            roleList.value.splice(index, 1, Object.assign({}, dialog.data.role))
            break
          }
        }
      } else {
        const { data } = await addRole(dialog.data.role)
        dialog.data.role.key = data.key
        roleList.value.push(dialog.data.role)
      }

      const { description, key, name } = dialog.data.role
      dialog.show = false
      ElNotification({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }

    const routesData = computed(() => {
      return routes.value
    })

    const getRoute = async () => {
      const res: any = await getRoutes()
      serviceRoutes = res.data
      routes.value.splice(0, routes.value.length, ...generateRoutes(res.data))
    }

    const getRoleList = async () => {
      const res: any = await getRoles()
      roleList.value.splice(0, roleList.value.length, ...res.data)
    }

    onBeforeMount(() => {
      getRoleList()
      getRoute()
    })

    return {
      role,
      handleAddRole,
      dialog,
      roleList,
      handleEdit,
      handleDelete,
      tree,
      confirmRole,
      routesData,
      routes
    }
  }
})
</script>

<style lang="scss"></style>
