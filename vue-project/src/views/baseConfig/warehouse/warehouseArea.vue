<template>
  <div class="table-page">
    <tool-bar @add-item="addItem">
      <template slot="tooltip">
        <el-tooltip
          class="tool-item"
          effect="dark"
          content="提示文字"
          placement="bottom-start"
        >
          <el-button @click="deleteItems" size="mini">delete</el-button>
        </el-tooltip>
      </template>
    </tool-bar>
    <div class="table-container">
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
    </div>
  </div>
</template>

<script>
import mock from 'mockjs'
export default {
  name: "about",
  data() {
    return {
      data: [],
      editStop: false,
      editList: [],
      addList: [],
      deleteList: [],
      columns: [
        {
          show: true,
          type: "selection",
          width: 60,
          fixed: "left"
        },
        {
          show: true,
          prop: "whCode",
          title: "仓库编号",
        },
        {
          show: true,
          prop: "whCodeDesc",
          title: "仓库描述",
        },
        {
          show: true,
          prop: "whAreaCode",
          title: "库区编号",
        },
        {
          show: true,
          prop: "whAreaDesc",
          title: "库区描述",
        },
        {
          show: true,
          prop: "gradeDesc",
          title: "优先级描述",
        },
        {
          show: true,
          prop: "remark",
          title: "备注说明",
        },
        {
          show: true,
          prop: "createTime",
          title: "创建时间",
        },
        {
          show: true,
          prop: "updatedTime",
          title: "更新时间",
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let codeList = (await this.$http.post("/api/material/wh_area/list", {
        pageNum: 1,
        pageSize: 10,
        webKey: "reservedTypeCodeRange"
      })).data.list;
      this.data.splice(0, this.data.length, ...codeList);
    },
    changeCell(val,prop,row) {
      row[prop] = val
      if(!row.type) {
        row["type"] = "edit";
        let _index = this.editList.findIndex(item => {
          return item.id === row.id
        })
        if(_index < 0) {
          this.editList.push(row)
        }
      }
    },
    rowClassName({row, rowIndex}) {
      if(row.type) {
        switch (row.type) {
          case "add":
            return "row-add"
          case "edit":
            return "row-edit"
          case "delete":
            return "row-delete"
        }
      }
      return ""
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