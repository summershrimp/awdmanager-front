<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <tab-pane v-if="activeName==item.key" :type="item.key" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/HostPane'
import { listGame } from '@/api/game'
export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
      ],
      activeName: ''
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  beforeCreate() {
    return listGame().then((data) => {
      this.tabMapOptions = []
      if (data.data.length === 0) {
        data.data.push({ name: 'None' })
        this.activeName = 'None'
        return
      }
      this.activeName = ''
      for (var i in data.data) {
        if (this.activeName === '') {
          this.activeName = data.data[i].name
        }
        this.tabMapOptions.push({ label: data.data[i].name, key: data.data[i].name })
      }
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
