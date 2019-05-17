<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <FilenameOption v-model="filename" />
    <BookTypeOption v-model="bookType" />
    <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">{{ $t('excel.export') }} Excel</el-button>
    <div style="margin-bottom: 20px">
      <el-input v-model="listQuery.inviteMobile" placeholder="邀请好友电话" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-input v-model="listQuery.enrollMobile" placeholder="邀请报名电话" style="width: 200px;" @keyup.enter.native="getList"/>
      <el-button @click="getList">search</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="标识" align="center">
        <template slot-scope="scope">
          {{ scope.row.uid }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="200" label="报名时间" >
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.parentMobile }}
        </template>
      </el-table-column>
      <el-table-column label="孩子姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.childName }}
        </template>
      </el-table-column>
      <el-table-column label="孩子年龄" align="center">
        <template slot-scope="scope">
          {{ scope.row.childAge }}
        </template>
      </el-table-column>
      <el-table-column label="英语学习时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.studyInterval }}
        </template>
      </el-table-column>
      <el-table-column label="邀请好友电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.inviteMobile }}
        </template>
      </el-table-column>
      <el-table-column label="邀请报名电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.enrollMobile }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-if="scope.row.status === '待确认'" slot-scope="scope" >
          <el-button type="primary" size="mini" @click="confirmClassStatusSuccess(scope.row)">成功</el-button>
          <el-button type="primary" size="mini" @click="openFailureDialog(scope.row.id)">失败</el-button>
        </template>
        <template v-if="scope.row.status !== '待确认'" slot-scope="scope" >
          <el-button type="primary" size="mini" @click="cancelAction(scope.row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 500px; margin-left:50px;">
        <el-form-item label="失败原因" prop="reason">
          <el-input :autosize="{ minRows: 6, maxRows: 8}" v-model="temp.reason" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendFailureReason">确定</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchClassList, updateClassStatusSuccess, updateClassStatusFailure, cancel } from '@/api/class'

// options components
import FilenameOption from './components/FilenameOption'
import BookTypeOption from './components/BookTypeOption'
import Pagination from '@/components/Pagination'

export default {
  name: 'ClassTable',
  components: { FilenameOption, BookTypeOption, Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      childAge: ['4岁', '5岁', '6岁', '7岁', '8岁', '9岁', '10岁', '11岁', '12岁'],
      studyInterval: ['没有英语学习经历', '小于半年', '一年', '超过一年'],
      listQuery: {
        page: 1,
        size: 20,
        enrollMobile: undefined,
        inviteMobile: undefined,
        type: undefined
      },
      total: 0,
      dialogFormVisible: false,
      temp: {
        reason: ''
      },
      failureEditId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchClassList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.list = res.data.reverse().map(item => {
            item.childAge = this.childAge[item.childAge]
            item.studyInterval = this.studyInterval[item.studyInterval]
            item.status = item.status === 0 ? '待确认' : item.status === 1 ? '已确认' : '失败'
            return item
          })
          this.total = res.data.length
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['编号', '标识', '报名时间', '报名电话', '孩子姓名', '孩子年龄', '英语学习时间', '状态']
        const filterVal = ['id', 'uid', 'createdTime', 'parentMobile', 'childName', 'childAge', 'studyInterval', 'status']
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
        return v[j]
      }))
    },
    cancelAction(id) {
      cancel(id).then(res => {
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
    },
    confirmClassStatusSuccess(row) {
      updateClassStatusSuccess(row.id).then(res => {
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
    },
    openFailureDialog(id) {
      this.dialogFormVisible = true
      this.failureEditId = id
    },
    sendFailureReason() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateClassStatusFailure(this.failureEditId, this.temp.reason)
          this.dialogFormVisible = false
        }
      })
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

