<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="提交时间" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column label="支付宝账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status === '0' ? '待处理' : '已处理' }}
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
import { fetchWithDrawList } from '@/api/withDraw'

export default {
  name: 'WithdrawTable',
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
      fetchWithDrawList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
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

