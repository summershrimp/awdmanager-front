<template>
  <div class="container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addDialogVisible=true">
        Add
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-files" @click="importDialogVisible=true">
        Batch import
      </el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="ID"
        width="65"
        element-loading-text="Loading..."
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Game" width="95">
        <template slot-scope="{row}">
          <span>{{ row.game }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="Address" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" align="center" label="Description">
        <template slot-scope="{row}">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handleRemove(row.id)">
            Remove
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Add Target" :close-on-click-modal="false" :visible.sync="addDialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Name" prop="title">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Host" prop="title">
          <el-input v-model="temp.host" />
        </el-form-item>
        <el-form-item label="Port" prop="title">
          <el-input v-model="temp.port" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="addTarget(type)">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Batch Import" :close-on-click-modal="false" :visible.sync="importDialogVisible">
      <el-form ref="dataForm" :model="batchText" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="CSV" prop="content">
          <el-input v-model="batchText" type="textarea" :rows="24" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="batchAddTarget(type)">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Confirm" :visible.sync="removeConfirmVisible">
      Sure Delete this target?
      <div slot="footer" class="dialog-footer">
        <el-button @click="removeConfirmVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doRemove()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTarget, addTarget, batchAdd, deleteTarget } from '@/api/target'
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      list: null,
      temp: {
        host: '',
        port: undefined,
        desc: ''
      },
      batchText: '',
      loading: false,
      addDialogVisible: false,
      importDialogVisible: false,
      removeConfirmVisible: false,
      removeId: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      listTarget(this.type).then(response => {
        this.list = response.data
        this.loading = false
      })
    },
    addTarget(type) {
      addTarget(type, this.temp).then(() => {
        this.addDialogVisible = false
      })
    },
    batchAddTarget(type) {
      batchAdd(type, { content: this.batchText }).then(() => {
        this.getList()
        this.importDialogVisible = false
      })
    },
    handleRemove(id) {
      this.removeId = id
      this.removeConfirmVisible = true
    },
    doRemove() {
      deleteTarget({ id: parseInt(this.removeId) }).then(() => {
        this.getList()
        this.removeConfirmVisible = false
      })
    }
  }
}
</script>

