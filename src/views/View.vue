<template>
  <div class="c-body" id="markdownView">
    <main class="c-main">
      <div class="container-fluid">
        <div class="fade-in">
          <div class="card">
            <div class="card-header">
              <div v-if="!edit" style="display:inline-block">{{title}}</div>
              <div
                id="title"
                v-if="edit"
                style="display:inline-block"
                contenteditable="true"
              >{{title}}</div>
              <div class="card-header-actions" contenteditable="false">
                <div
                  class="card-header-action"
                  v-on:click="saveMarkdown()"
                  v-if="edit"
                  style="display: inline-block; cursor: pointer;"
                >
                  <small class="text-muted">保存</small>
                </div>
                <div
                  class="card-header-action"
                  v-on:click="cancelMarkdown()"
                  v-if="edit"
                  style="display: inline-block;cursor: pointer;"
                >
                  <small class="text-muted">取消</small>
                </div>
                <div
                  class="card-header-action"
                  v-on:click="editMarkdown()"
                  v-if="!edit"
                  style="display: inline-block;cursor: pointer;"
                >
                  <small class="text-muted">编辑</small>
                </div>
              </div>
            </div>
            <div class="card-body">
              <mavon-editor class="my-mavon-editor" v-model="context" v-show="edit" :ishljs = "true"></mavon-editor>
              <div
                class="scrollspy-example2"
                style="display:inline-block;width: 100%;"
                v-show="!edit"
              >
                <div
                  id="spy-example1"
                  data-spy="scroll"
                  data-target="#navbar-example1"
                  data-offset="65"
                  style="position: relative; height: 500px; overflow: auto; margin-top: .5rem; overflow-y: scroll;"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import showdown from "showdown"
import config from './config/config'

let _classEditor = null
let query = null
const compile = function (target){
    var converter = new showdown.Converter();
    var html = converter.makeHtml(target);
    document.getElementById("spy-example1").innerHTML = html;
}
export default {
  inject: ['reload'],
  name: 'markdownView',
  data: function() {
    query = this.$route.query
    return {
        markdown: {},
        title: "",
        context: "",
        edit: false,
    }
  },
  mounted: function() {
    if (query.id !== null) {
        this.getMarkdown(query.id)
    }
    if (query.edit === '1') {
        this.editMarkdown()
    }
  },
  methods: {
    editMarkdown:function() {
      this.edit = true
    },
    cancelMarkdown:function() {
      this.edit = false
    },
    saveMarkdown:function(){
      let title = document.getElementById("title").innerHTML
      if (title == '') {
        window.alert("标题不能为空！");
        return false;
      }
      var createUrl = config.serverPath + config.createMarkdown
      var params = new URLSearchParams()
      if (query.id !== undefined) {
        params.append('id', query.id)
      } else {
        params.append('id', '')
      }
      params.append('title', title)
      params.append('context', this.context)
      this.$http.post(createUrl, params)
        .then((res) => {
          this.$router.push({
            path: '/markdownView?id=' + res.data
          })
          this.reload()
        }).catch((e) => { 
          console.log(e) 
        })
    },
    getMarkdown:function(id) {
      var url = config.serverPath + config.viewDetailUrl
      url = url + '?id=' + query.id
      let vm = this
      this.$http.get(url)
      .then((res) => {
        vm.markdown = res.data
        vm.context = vm.markdown.mkContext
        vm.title = vm.markdown.title
        compile(vm.markdown.mkContext)
      }).catch((e) => { 
        console.log(e) 
      })
    }
  }
}
</script>

<style>
.my-mavon-editor {
  height: 470px;
}
</style>