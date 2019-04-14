<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-input v-model="listQuery.mobile" placeholder="手机号" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-input v-model="listQuery.alipayAccount" placeholder="支付宝账号" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-button @click="getList">search</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="手机号" >
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付宝账号" align="center">
        <template slot-scope="scope">
          {{ scope.row.alipayAccount }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" align="center">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button :disabled = "scope.row.status === '确认'" type="primary" size="mini" @click="confirmWithDrawStatus(scope.row)">确认</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchWithDrawList, updateWithDrawStatus } from '@/api/withDraw'

// options components
import Pagination from '@/components/Pagination'

export default {
  name: 'WithDrawTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        alipayAccount: undefined,
        mobile: undefined,
        type: undefined
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchWithDrawList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.reverse().map(item => {
            item.amount = item.amount / 100
            item.status = item.status === 0 ? '待确认' : '已确认'
            return item
          })
          this.total = res.data.length
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    confirmWithDrawStatus(row) {
      updateWithDrawStatus(row.id).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            message: res.error,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style>
</style>

