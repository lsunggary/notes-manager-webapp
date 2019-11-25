<template>
  <div class="animated fadeIn">
    <div class="search-div">
      <input style="width: 80%;" class="form-control" type="text" placeholder="查询内容" aria-label="查询内容" aria-describedby="btnGroupAddon" v-model="search">
      <button style="width: 20%;" class="btn btn-block btn-primary" type="button" v-on:click="goPages(1)">Search</button>
    </div>
    <div class="container-fluid">
      <div class="fade-in">
        <div class="row">
          <template v-for="markdown in markdownList">
            <div class="col-sm-12 col-xl-6" :key="markdown.id">
              <div class="card">
                <div class="card-header"> {{markdown.updateAt}}
                  <div class="card-header-actions">
                    <div class="card-header-action" v-on:click="deleteMD(markdown.id)" style="display: inline-block;cursor:pointer;"><small class="text-muted">删除</small></div>
                    <div class="card-header-action" v-on:click="edit(markdown.id)" style="display: inline-block;cursor:pointer;"><small class="text-muted">编辑</small></div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="jumbotron">
                    <h1 id="mkdownTitle" class="display-3">{{markdown.title}}</h1>
                    <p id="mkdownContext">{{markdown.mkContext}}</p>
                    <p class="lead"><button class="btn btn-primary btn-lg" role="button" v-on:click="view(markdown.id)">阅读</button></p>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
        </div>

        <div class="card">
          <div class="card-body">
            <nav aria-label="...">
              <ul class="pagination" style="width: 65%;">
                <li class="page-item" v-bind:class="priDisabled"><button class="page-link" tabindex="-1" v-on:click="goPages(currentPage-1)">上一页</button></li>
                <li class="page-item" v-if="currentPage > 2"><button class="page-link" v-on:click="goPages(currentPage-2)">{{currentPage-2}}</button></li>
                <li class="page-item" v-if="currentPage > 1"><button class="page-link" v-on:click="goPages(currentPage-1)">{{currentPage-1}}</button></li>
                <li class="page-item active"><button class="page-link">{{currentPage}}<span class="sr-only">(current)</span></button></li>
                <li class="page-item" v-if="pageinfo.totalPage > currentPage"><button class="page-link" v-on:click="goPages(currentPage+1)">{{currentPage+1}}</button></li>
                <li class="page-item" v-if="pageinfo.totalPage > currentPage+1"><button class="page-link" v-on:click="goPages(currentPage+2)">{{currentPage+2}}</button></li>
                <li class="page-item" v-bind:class="nextDisabled"><button class="page-link" v-on:click="goPages(currentPage+1)">下一页</button></li>
              </ul>
              <div style="display: flex;width: 35%;position: absolute;top: 20px;right: 20px;">
                <input style="width: 40%;" class="form-control" type="text" placeholder="输入页码" aria-label="输入页码" aria-describedby="btnGroupAddon" v-model="goPage">
                <p style="width: 20%;text-align: center;line-height: 30px;margin-bottom: 0px;">{{currentPage}}/{{pageinfo.totalPage}}</p>
                <button style="width: 40%;" class="btn btn-block btn-primary" type="button" v-on:click="goPages(goPage)">Go</button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
import { Callout } from '@coreui/vue'
import config from './config/config'

export default {
  name: 'dashboard',
  components: {
    Callout,
  },
  data: function () {
    let query = this.$route.query
    return {
        currentPage: query.page?parseInt(query.page):1,
        markdownList: {},
        pageinfo: {},
        goPage: '',
        search: query.search?query.search:'',
        priDisabled: 'disabled',
        nextDisabled: 'disabled',
    }
  },
  created: function() {
    this.getPageInfo()
  },
  mounted: function() {
    this.getMarkdowns(this.currentPage)
  },
  methods: {
    edit:function(id) {
      this.$router.push({
        path: '/markdownView?id=' + id + '&edit=1'
      })
    },
    view:function(id) {
      this.$router.push({
        path: '/markdownView?id=' + id
      })
    },
    getMarkdowns:function(currentPage) {
      if (!/^[0-9]+$/.test(currentPage)) {
          window.alert("页码只能为数字！")
          return false;
      }
      var url=config.serverPath+config.listUrl
      var page = currentPage?currentPage:1
      url = url+'?page='+page+'&size=10'+'&search='+this.search
      let vm = this
      this.$http.get(url)
      .then((res) => {
          vm.markdownList = res.data
      }).catch((e) => { 
          console.log(e) 
      })
    },
    goPages:function(page) {
      this.getMarkdowns(page)
    },
    getPageInfo:function() {
      var url=config.serverPath+config.pageinfo+'?search='+this.search
      let vm = this
      this.$http.get(url)
      .then((res) => {
          vm.pageinfo = res.data
          vm.priDisabled = vm.currentPage>1?'':'disabled'
          vm.nextDisabled = vm.pageinfo.totalPage>vm.currentPage?'':'disabled'
      }).catch((e) => { 
          console.log(e) 
      })
    },
    deleteMD:function(id) {
      var deleteUrl = config.serverPath+config.deleteMarkdown
      var params = new URLSearchParams()
      params.append('id', id)
      this.$http.post(deleteUrl, params)
      .then((res) => {
          this.getMarkdowns(1)
      }).catch((e) => { 
          console.log(e) 
      })
    }
  }
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
  .search-div {
    display: flex;
    width: 50%;
    position: fixed;
    top: 60px;
    right: 0px;
    z-index: 10000;
  }
</style>
