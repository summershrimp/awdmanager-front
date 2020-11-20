<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addDialogVisible=true">
        Add
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="batchImport">
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Address" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status || "Online" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleConnect(row.id)">
            Console
          </el-button>
          <el-button size="mini" type="danger" @click="handleDisconnect(row.id)">
            Disconnect
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="Confirm" :visible.sync="dialogVisible">
      Sure Disconnect this shell?
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doDisconnect(dialogStatus)">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog class="commander" width="80vw" :close-on-click-modal="false" :title="'Console for ' + curConsoleId" :visible.sync="consoleVisble">
      <el-row id="console" style="height: 60vh; overflow-y: scroll; margin-bottom: 1vh; background-color: gainsboro; padding: 1vh">
        <el-col :span="24">
          <code style="white-space: pre-wrap;">{{ consoleHistory[curConsoleId]| historyExpander }}</code>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input v-model="cmdline" placeholder="command" @keyup.enter.native="doCommand(curConsoleId, cmdline)" />
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="doCommand(curConsoleId, cmdline)">
            Execute
          </el-button>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="consoleVisble = false">
          Close
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Add Host" :close-on-click-modal="false" :visible.sync="addDialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
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
        <el-button type="primary" @click="addHost()">
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
import { listShells, executeCommand, disconnectShell, addHost } from '@/api/shell'
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
      statusOptions: ['published', 'draft', 'deleted'],
      dialogVisible: false,
      dialogStatus: '',
      consoleVisble: false,
      curConsoleId: '',
      consoleHistory: {},
      cmdline: '',
      addDialogVisible: false,
      temp: {
        name: '',
        host: '',
        port: 0
      }
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getList()
    }, 5000)
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
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    getList() {
      this.listLoading = true
      listShells().then(response => {
        this.list = response.data
        this.total = this.list.length

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleConnect(id) {
      this.consoleVisble = true
      this.curConsoleId = id
    },
    handleDisconnect(id) {
      this.dialogVisible = true
      this.dialogStatus = id
    },
    doDisconnect(id) {
      disconnectShell({ id: id })
      this.dialogVisible = false
      this.dialogStatus = ''
      this.getList()
    },
    doCommand(id, cmd) {
      if (!(id in this.consoleHistory)) {
        this.consoleHistory[id] = []
      }
      this.consoleHistory[id].push('sh # ' + cmd)
      executeCommand({ id: id, command: cmd }).then(data => {
        this.consoleHistory[id].push(data.data)
        this.cmdline = ''
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
    addHost() {
      this.temp.port = parseInt(this.temp.port)
      addHost(this.temp).then(() => {
        this.addDialogVisible = false
      })
    }
  }
}
</script>
