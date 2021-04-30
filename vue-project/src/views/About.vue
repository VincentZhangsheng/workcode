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
          <el-button @click="deleteItems" size="mini" type="primary">delete</el-button>
        </el-tooltip>
      </template>
    </tool-bar>
    <div class="table-container">
      <eff-table
        ref="table"
        v-model="columns"
        :data="data"
        :edit-stop="editStop"
        :height="560"
        drag
        edit
        border
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        :show-summary="true"
        sum-text="合计"
        @editColumnLastToNext="editColumnLastToNext"
        @selection-change="handleSelectionChange"
      >
        <!-- <div slot="toolbar">
          <el-button
            @click="add"
            size="mini"
          >新增</el-button>
          <el-button
            @click="deleteItems"
            size="mini"
          >删除</el-button>
        </div> -->
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
          prop: "codeRule",
          title: "号码段编号",
          cellRender: (h, { row, prop }) => {
            // const typeItem = this.whTypeOptions.find(item => {
            //   return item.value == row[prop]
            // })
            return row[prop];
          },
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "codeLength",
          title: "编号长度",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            },
            skip: ({ row }) => !row.switch
          }
        },
        {
          show: true,
          prop: "startCode",
          title: "起始编号",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        // {
        //   show: true,
        //   prop: "endCode",
        //   title: "公司代码",
        //   edit: {
        //     render: (h, { prop, row }) => {
        //       return (
        //         <el-select
        //           {...{
        //             attrs: {
        //               value: row[prop],
        //               automaticDropdown: true,
        //               filterable: true,
        //               defaultFirstOption: true
        //             },
        //             on: {
        //               "visible-change": this.visibleChange,
        //               change: val => (row[prop] = val)
        //             }
        //           }}
        //         >
        //           {this.whCompany.map(item => {
        //             return (
        //               <el-option
        //                 key={item.value}
        //                 title={item.lable}
        //                 value={item.value}
        //               />
        //             );
        //           })}
        //         </el-select>
        //       );
        //     }
        //   }
        // },
        {
          show: true,
          prop: "endCode",
          title: "截止编号",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (this.changeCell(val,prop,row))}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "enterStyle",
          title: "自动录入",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-switch
                  value={row[prop]}
                  active-value="Y"
                  inactive-value="N"
                  on-change={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "remark",
          title: "备注说明",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            }
          }
        },
      ],
    };
  },
  created() {
    this.getCodeList();
  },
  methods: {
    async getCodeList() {
      let codeList = (await this.$http.post("/api/material/code_range/page", {
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
      this.multipleSelection.forEach(item => {
        item.type = "delete"
        let _index = this.data.findIndex(row => {
          return row.id == item.id;
        })
        this.data.splice(_index, 1, item);
        // let rowItem = this.data.find(row => {
        //   return row.id == item.id;
        // })
        // rowItem["type"] = "delete"
      })
      this.deleteList.push(...this.multipleSelection)
      this.deleteList = [...new Set(this.deleteList)]
      console.log(this.deleteList)
      this.multipleSelection.splice(0,this.multipleSelection.length)
      // let filterList = this.data.filter(item => {
      //   return !this.multipleSelection.includes(item);
      // });
      // this.data.splice(0, this.data.length, ...filterList);
    }
  }
};
</script>
<style lang="scss" scoped>

</style>