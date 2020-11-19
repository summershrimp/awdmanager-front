<template>
  <div class="app-container">
    <el-row id="console" style="height: 80vh; overflow-y: scroll; margin-bottom: 1vh; background-color: gainsboro; padding: 1vh">
      <el-col :span="24">
        <code style="white-space: pre-wrap;">{{ consoleHistory | historyExpander }}</code>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="20">
        <el-input v-model="cmdline" placeholder="command" @keyup.enter.native="prompt()" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="prompt()">
          Execute
        </el-button>
      </el-col>
    </el-row>

    <el-dialog title="Confirm" :visible.sync="dialogVisible">
      Are you sure batch this command:
      <br>
      {{ cmdline }}
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="doCommand(cmdline)">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { batchCommand } from '@/api/shell'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
export default {
  name: 'ShellBatch',
  components: { },
  directives: { waves },
  filters: {
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
      dialogVisible: false,
      dialogStatus: '',
      consoleVisble: false,
      curConsoleId: '',
      consoleHistory: [],
      cmdline: ''
    }
  },
  updated() {
    var elem = this.$el.querySelector('#console')
    if (elem) {
      elem.scrollTop = elem.clientHeight
    }
  },
  methods: {
    prompt() {
      this.dialogVisible = true
    },
    doCommand(cmd) {
      batchCommand({ command: cmd }).then(resp => {
        if (resp.data.length === 0) {
          this.consoleHistory.push('No host available!')
        } else {
          for (var i in resp.data) {
            this.consoleHistory.push(resp.data[i].host + ' # ' + cmd)
            this.consoleHistory.push(resp.data[i].data)
            this.consoleHistory.push('')
          }
        }
        this.cmdline = ''
        this.dialogVisible = false
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
    }
  }
}
</script>
