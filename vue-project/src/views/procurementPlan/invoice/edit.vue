<template>
  <div class="">
    <tool-bar @add-item="addItem">
      <template slot="tooltip">
        <pu-button
          @click="deleteItems"
          size="mini"
        >
          <i class="el-icon-plus"></i>
          <span>save</span>
        </pu-button>
        <pu-button
          @click="deleteItems"
          size="mini"
          disabled
        >
          <i class="el-icon-delete"></i>
          <span>delete</span>
        </pu-button>
      </template>
    </tool-bar>
    <div class="info-container">
      <el-form label-width="70px" label-position="left" size="mini">
        <pu-collapse
          v-model="activeNames"
        >
          <pu-collapse-item
            title="一致性 Consistency"
            name="1"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="发票编号" prop="name">
                  <el-input></el-input>
                  <el-input></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </pu-collapse-item>
          <pu-collapse-item
            title="反馈 Feedback"
            name="2"
          >
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </pu-collapse-item>
          <pu-collapse-item
            title="效率 Efficiency"
            name="3"
          >
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </pu-collapse-item>
          <pu-collapse-item
            title="可控 Controllability"
            name="4"
          >
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </pu-collapse-item>
        </pu-collapse>
      </el-form>
    </div>
    <!-- <div class="table-container">
      <eff-table
        ref="table"
        v-model="columns"
        :data="data"
        :height="560"
        drag
        border
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        @selection-change="handleSelectionChange"
      >
      </eff-table>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      data: [],
      activeNames: ['1'],
      editStop: false,
      columns: [
        {
          show: true,
          type: "selection",
          width: 60,
          fixed: "left"
        },
        {
          show: true,
          prop: "companyCode",
          width: 120,
          title: "公司编码"
        },
        {
          show: true,
          prop: "companyName",
          width: 180,
          title: "公司描述"
        },
        {
          show: true,
          prop: "whCode",
          width: 100,
          title: "仓库编号"
        },
        {
          show: true,
          prop: "whDesc",
          width: 100,
          title: "仓库描述"
        },
        {
          show: true,
          prop: "whType",
          width: 100,
          title: "仓库类型"
        },
        {
          show: true,
          prop: "whTypeName",
          width: 160,
          title: "类型描述"
        },
        {
          show: true,
          prop: "statusName",
          width: 80,
          title: "状态"
        },
        {
          show: true,
          prop: "grade",
          width: 80,
          title: "优先级"
        },
        {
          show: true,
          prop: "pickPointName",
          width: 160,
          title: "拣配点"
        },
        {
          show: true,
          prop: "shippingPointName",
          width: 160,
          title: "装运点"
        },
        {
          show: true,
          prop: "capacityManage",
          width: 120,
          title: "启用库容管理"
        },
        {
          show: true,
          prop: "batchManage",
          width: 120,
          title: "启用批次管理"
        },
        {
          show: true,
          prop: "startMedium",
          width: 120,
          title: "启用容器管理"
        },
        {
          show: true,
          prop: "compulsory",
          width: 120,
          title: "是否强制"
        },
        {
          show: true,
          prop: "remark",
          width: 160,
          title: "备注说明"
        },
        {
          show: true,
          width: 60,
          title: "操作",
          cellRender: (h, { row, prop }) => {
            return <el-button type="text">编辑</el-button>;
          },
          fixed: "right"
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let codeList = (await this.$http.post(
        "/api/material/wh_info/query_wh_info_list",
        {
          pageNum: 1,
          pageSize: 10
        }
      )).data.list;
      this.data.splice(0, this.data.length, ...codeList);
    },
    changeCell(val, prop, row) {
      row[prop] = val;
      if (!row.type) {
        row["type"] = "edit";
        let _index = this.editList.findIndex(item => {
          return item.id === row.id;
        });
        if (_index < 0) {
          this.editList.push(row);
        }
      }
    },
    rowClassName({ row, rowIndex }) {
      if (row.type) {
        switch (row.type) {
          case "add":
            return "row-add";
          case "edit":
            return "row-edit";
          case "delete":
            return "row-delete";
        }
      }
      return "";
    },
    visibleChange(val) {
      this.editStop = val;
    },
    addItem() {
      this.data.push({
        type: "add",
        codeRule: "",
        codeLength: "",
        startCode: "",
        endCode: "",
        enterStyle: "",
        remark: ""
      });
      this.$refs.table.focus(this.data.length - 1);
    },
    editColumnLastToNext({ placement, rowIndex }) {
      if (placement === "right") {
        this.data[rowIndex + 1] && this.$refs.table.focus(rowIndex + 1);
      }
    },
    focus() {
      this.$refs.table.focus(9);
    },
    summary({ colums, data }) {
      console.log(colums, data);
    },
    cellClassName({ column }) {
      if (column.prop == "whCode") return "gray";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteItems() {
      if (!this.data.length) return;
      if (!this.multipleSelection.length) {
        this.$message.error("请先选择要删除的数据！");
        return;
      }
      let filterList = this.data.filter(item => {
        return !this.multipleSelection.includes(item);
      });
      this.data.splice(0, this.data.length, ...filterList);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>