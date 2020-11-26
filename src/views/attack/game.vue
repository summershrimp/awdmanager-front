<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addDialogVisible=true">
        Add
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="importDialogVisible=true">
        Batch import
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Name" prop="name" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center">
        <template slot-scope="{row}">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Current exploit" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Attack Count" class-name="status-col" width="120">
        <template slot-scope="{row}">
          {{ row.attack_count || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row.name)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Confirm" :visible.sync="dialogVisible">
      Sure delete this game?
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doDelete()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Add Game" :close-on-click-modal="false" :visible.sync="addDialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width: 80%; margin-left:50px;">
        <el-form-item label="Game Name" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Description" prop="desc">
          <el-input v-model="temp.desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="addGame()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style>
.commander .el-dialog {
    margin-top: 10vh !important;
}
</style>
<script>
import { listGame, addGame, deleteGame } from '@/api/game'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

export default {
  name: 'ShellList',
  components: { },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        online: 'success',
        unknown: 'info',
        offline: 'danger'
      }
      return statusMap[status]
    },
    historyExpander(history) {
      let data = ''
      for (var i in history) {
        data += history[i]
        data += '\n'
      }
      return data
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      timer: 0,
      listLoading: true,
      importDialogVisible: false,
      dialogVisible: false,
      deleteId: '',
      consoleVisble: false,
      curConsoleId: '',
      consoleHistory: {},
      cmdline: '',
      addDialogVisible: false,
      temp: {
        name: '',
        desc: ''
      }
    }
  },
  created() {
    this.getList()
  },
  updated() {
    var elem = this.$el.querySelector('#console')
    if (elem) {
      elem.scrollTop = elem.clientHeight
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      listGame().then(response => {
        this.list = response.data
        this.total = this.list.length

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleDelete(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    doDelete() {
      deleteGame({ name: this.deleteId }).then(() => {
        this.dialogVisible = false
        this.deleteId = ''
        this.getList()
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    batchImport() {

    },
    addGame() {
      addGame(this.temp).then(() => {
        this.addDialogVisible = false
        this.getList()
      })
    }
  }
}
</script>
