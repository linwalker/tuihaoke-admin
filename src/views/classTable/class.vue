<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <FilenameOption v-model="filename" />
    <AutoWidthOption v-model="autoWidth" />
    <BookTypeOption v-model="bookType" />
    <div>
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">{{ $t('excel.export') }} Excel</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="标识" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="报名时间" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.applyMobile }}
        </template>
      </el-table-column>
      <el-table-column label="孩子姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="孩子年龄" align="center">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column label="英语学习时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.studyTime }}
        </template>
      </el-table-column>
      <el-table-column label="邀请人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.inviteMobile }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status === '0' ? '待确认' : '已确认' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button :disabled = "scope.row.status == 1" type="primary" size="mini" @click="handleUpdate(scope.row)">确认</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchClassList } from '@/api/class'
import { parseTime } from '@/utils'

// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'

export default {
  name: 'ClassTable',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchClassList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '标识', '报名时间', '报名电话', '孩子姓名', '孩子年龄', '英语学习时间', '邀请人电话', '状态']
        const filterVal = ['id', 'type', 'timestamp', 'applyMobile', 'name', 'age', 'studyTime', 'inviteMobile', 'status']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else if (j === 'status') {
          return v[j] === '0' ? '待确认' : '已确认'
        }
      }))
    },
    handleUpdate(row) {
      console.log(row)
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>

