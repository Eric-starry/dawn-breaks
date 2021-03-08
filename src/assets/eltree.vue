<template>
  <div class="fui-tree-select">
    <el-popover
      ref="popover"
      v-model="visible"
      :visible-arrow="false"
      :width="popoverWidth"
      :popper-class="customClass"
      :listener-options="listenerOptions"
      placement="bottom"
      trigger="click"
      @show="popoverShow"
      @hide="iconDown = true">
      <el-input
        v-if="filterShow"
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        style="margin-top: -1px;"/>
      <div class="fui-tree-select-box">
        <el-tree
          v-if="!single"
          ref="tree"
          :default-expand-all="defaultExpandAll"
          :show-checkbox="!single"
          :props="props"
          :node-key="nodeKey"
          :highlight-current="currentHighlight"
          :data="data"
          :default-checked-keys="value"
          :filter-node-method="filterNode"
          :has-triangle="hasTriangle"
          :default-expanded-keys="defaultExpandedKeys"
          :check-on-click-node="checkOnClickNode"
          @check="onCheckChangeOnce"
        />
        <el-tree
          v-if="single"
          ref="treeSingle"
          :expand-on-click-node="false"
          :data="data"
          :props="props"
          :default-expand-all="defaultExpandAll"
          :has-triangle="hasTriangle"
          :filter-node-method="filterNode"
          @node-click="onNodeClick"
        />
        <!--</fui-scrollbar>-->
      </div>
    </el-popover>
    <div v-popover:popover class="fui-tree-select__label">
      <span class="fui-tree-select__text-box">
        <span v-show="selectVal && showSelected" :title="selectVal">{{ selectVal }}</span>
        <span v-show="!selectVal || !showSelected" :title="placeholder" style="opacity: 0.3;color: #1f2d3d">{{ placeholder }}</span>
      </span>
      <span class="fui-tree-select__icon">
        <i :class="{'el-icon-arrow-up fui-icon--Sort-up': !iconDown, 'el-icon-arrow-down fui-icon--Sort-down': iconDown}"/>
      </span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ElTreeSelect',
    components: {
      
    },
    props: {
      value: {
        type: [Array, String, Number],
        default: undefined
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      defaultExpandAll: {
        type: Boolean,
        default: true
      },
      showSelected: {
        type: Boolean,
        default: true
      },
      defaultExpandedKeys: {
        type: Array,
        default: undefined
      },
      checkOnClickNode: {
        type: Boolean,
        default: false
      },
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            children: 'children',
            disabled: 'disabled'
          };
        }
      },
      nodeKey: {
        type: String,
        default: 'id'
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      filter: {
        type: Boolean,
        default: undefined
      }, // 可过滤
      filterLength: {
        type: Number,
        default: 10
      },
      single: {
        type: Boolean,
        default: undefined
      }, // 下拉单选
      leafOnly: {
        type: Boolean,
        default: undefined
      }, // 只选叶子节点
      hasTriangle: {
        type: Boolean,
        default: undefined
      }, // 是否显示下拉三角图标
      filterIds: {
        type: Array,
        default () {
          return [];
        }
      },
      popperClass: {
        type: String,
        default: undefined
      },
      combination: {
        type: Boolean,
        default: undefined
      },
      combinationFilterKeys: {
        type: Array,
        default () {
          return [];
        }
      },
      listenerOptions: {
        type: Object,
        default () {
          return {
            capture: false,
            bubbling: false,
            once: false
          };
        }
      },
      forbidCancel: {
        type: Boolean,
        default: undefined
      } // 第二次点击是否可取消
    },
    data () {
      return {
        visible: false,
        iconDown: true,
        selectVal: '',
        filterText: '',
        checkedKeys: [],
        checkedIds: [],
        currentSingleId: '',
        currentHighlight: false,
        popoverWidth: 240
      };
    },
    computed: {
      customClass () {
        let result = ['tree-select-popper'];
        this.popperClass && result.push(this.popperClass);
        return result.join(' ');
      },
      filterShow () {
        let len = getLeafNum(this.data);
        return this.filter || len > this.filterLength;
      }
    },
    watch: {
      filterText (val) {
        let type = this.single ? 'treeSingle' : 'tree';
        this.$refs[type].filter(val);
      },
      '$refs.popover': {
        deep: true,
        handler (val, oldVal) {
        }
      },
      'value': {
        deep: true,
        handler (nValue, old) {
          setTimeout(() => {
            this.single || this.setSelectLabel(null, 'fromWatch');
            this.single && this.setSingleLabel();
          }, 0);
        }
      },
      'data': {
        deep: true,
        handler () {
          setTimeout(() => {
            this.single || this.setCheckedKeys(this.value);
            this.single && this.setSingleLabel();
          }, 0);
        }
      }
    },
    created () {
      this.currentHighlight = !!this.single;
    },
    mounted () {
      this.$nextTick(() => {
        this.init();
      });
    },
    methods: {
      popoverShow () {
        this.filterText = '';
        this.iconDown = false;
        this.popoverWidth = this.$el.clientWidth;
      },
      labelClick () {
        this.visible = !this.visible;
        this.iconDown = !this.iconDown;
      },
      setSelectLabel (selectCheckedNodes) { // 设置tree显示的已勾选字段/内容
        let checkedNodes = selectCheckedNodes || this.getSelectCheckedNodes(this.leafOnly) || [];
        let arr = [];
        let checkedIds = [];
        let filterIds = this.filterIds.map(v => '' + v);
        checkedNodes.forEach(item => {
          if (!filterIds.includes('' + item.id)) {
            arr.push(item.label);
            checkedIds.push(item.id);
          }
        });
        let leafNodes = this.getSelectCheckedNodes(true);
        let leafIds = [];
        leafNodes.forEach(item => {
          leafIds.push(item.id);
        });
        this.selectVal = arr.join(',');
        if (this.combination) this.selectVal = parseLabel(this.data, leafIds, this.combinationFilterKeys);
        this.checkedIds = checkedIds;
      },
      emitInput () {
        this.$emit('input', this.checkedIds);
      },
      setCheckedKeys (keys, leafOnly) {
        if (!Array.isArray(keys)) throw new Error('[Tree] keys is required an Array type in setCheckedKeys');
        this.$refs.tree.setCheckedKeys(keys);
        this.setSelectLabel();
        this.emitInput();
      },
      setDisableKeys (keys) {
        if (!Array.isArray(keys)) throw new Error('[Tree] keys is required an Array type in setDisableKeys');
        this.$refs.tree.setDisableKeys(keys);
        this.setCheckedKeys(this.value);
      },
      getSelectCheckedNodes (leafOnly) {
        return this.$refs.tree.getCheckedNodes(leafOnly);
      },
      onCheckChangeOnce (...args) {
        this.$nextTick(() => {
          this.setSelectLabel();
          this.emitInput();
          this.$emit('on-check-change-once', ...args);
        });
      },
      onNodeClick (node) {
        if (this.leafOnly && node.children) return;
        let id = node[this.nodeKey];
        if ('' + this.currentSingleId === '' + id) {
          if (this.forbidCancel) return;
          this.currentSingleId = this.selectVal = '';
          this.currentHighlight = false;
        } else {
          this.currentHighlight = true;
          this.currentSingleId = id;
          this.selectVal = this.combination ? parseLabel(this.data, [id], this.combinationFilterKeys) : node[this.props.label];
        }
        this.$emit('input', id);
        this.$emit('on-node-click', node);
        this.labelClick();
      },
      filterNode (value, data) {
        if (!value) return true;
        return data.label.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1;
      },
      getAllNodesStatus () {
        let nodes = this.$refs.treeSingle.getAllNodesStatus();
        return nodes;
      },
      setSingleLabel () {
        let nodes = this.getAllNodesStatus() || [];
        let node = nodes.find(item => '' + item.id === '' + this.value);
        if (!node) {
          this.selectVal = '';
          return;
        }
        if (this.leafOnly) {
          if (node.hasChild) return;
          this.selectVal = this.combination ? parseLabel(this.data, [this.value], this.combinationFilterKeys) : node.label;
        } else {
          this.selectVal = this.combination ? parseLabel(this.data, [this.value], this.combinationFilterKeys) : node.label;
        }
      },
      init () {
        if (!this.single) {
          if (!Array.isArray(this.value)) throw new Error('v-model in TreeSelect with multiple requires an Array type');
          this.setSelectLabel();
        } else {
          this.setSingleLabel();
        }
      }
    }
  };
function treeToLine (tree) {
  let result = [];
  tree = JSON.parse(JSON.stringify(tree));
  function fn (nodes, parentId) {
    if (!nodes.length) return;
    for (let item of nodes) {
      let obj = {};
      obj.parent = parentId || null;
      for (let key in item) {
        if (key !== 'children') {
          obj[key] = item[key];
        }
      }
      result.push(obj);
      if (!item.children) continue;
      fn(item.children, item.id);
    }
  }
  fn(tree, null);
  return result;
}
function parseLabel (data, targetId, filterKeys) {
  let arr = [];
  let lineData = treeToLine(data, 'id') || [];
  function reverse (lineData, id) {
    let result = [];
    function fn (id) {
      let obj = lineData.find(item => '' + item.id === '' + id);
      if (!obj) return result;
      !filterKeys.includes(obj.id) && result.unshift(obj.label);
      if (obj.parent) fn(obj.parent);
    }
    fn(id);
    return result;
  }
  targetId.forEach(id => {
    arr.push(reverse(lineData, id));
  });
  let strArr = arr.map(item => item.join('-'));
  return strArr.join(',');
}
function getLeafNum (data) {
  if (!data || !data.length) return 0;
  let lineData = treeToLine(data, 'id') || [];
  let result = [];
  lineData.forEach(item => {
    if (!lineData.find(v => v.parent === item.id)) result.push(item.id);
  });
  return result.length;
}
</script>
