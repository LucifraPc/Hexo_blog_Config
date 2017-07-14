---
title: Vue的黑魔法
date: 2016-09-23 
categories: 前端
tags:
     - 黑魔法
     - 奇淫技巧
---
### vue发送http请求
* vue发送http请求，建议使用vue-resource插件。
* vue-resource作者尤雨溪、Steffans合作完成
* vue-resource优点是特别的小，压缩后才15kb
### 使用vue-resource
文档地址
https://github.com/pagekit/vue-resource/blob/develop/docs/http.md

1.下载 npm i vue-resource

2.引入页面
  <script src="./vue.js"></script>
  <script src="./vue-resource.js"></script>
3. 编写请求方法
- 全局中发送http请求

```javascript
   Vue.http.get('/userList',{params:{"a":"b"}})
    .then(function(res){
      console.log(res);
    }, function(res){
      console.log(res);
   });
  //1.路径 2.body 3.options
   Vue.http.post('/userList',{"foo":"a"},{params:{"a":"b"}})
  .then(function(res){
     console.log(res);
  }, function(res){
     console.log(res);
  });
``` 
- 实例中调用http方法
```javascript
var demo = new Vue({
				el: '#app',
				data: {
						apiUrl: '/userList'
				},
        create: function() {
          this.getdata();
        },
				methods: {
					getdata: function() {
						this.$http.get(this.apiUrl,{params:{"a":"b"}})
							.then((response) => {
                 console.log(response.data);
							})
							.catch(function(response) {
								console.log(response)
							})
					}
				}
			})
```   		
           

4.将页面放入服务器,验证 
 <div id="app">
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>地址</th>
        </tr>
      </thead>
      <!-- 如果列表有数据，直接输出表格数据，没有数据提示用户没有数据 -->
      <tbody v-if="UserList.length > 0"> 
        <tr v-for="item in UserList" >
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.address }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr><td colspan="3">没有数据奥！</td></tr>
      </tbody>
    </table>
  </div>
 <script>
    var foo = new Vue({         
      el: '#app',               
      data: {  
       UserList:[]
      }
    });
   setInterval(function(){
      foo.UserList.push({"name":"zyc","age":88,"address":"七浦路"});
   },1000)
 </script>


异步流程控制 promise
异步方法想要有执行顺便必须嵌套，回调的地狱.then()


```javascript 
//读文件
var fs = require('fs');
var rf = function(fileName) {
  //构建一个 Promise 对象
  //resolve成功的方法
  //reject失败的方法
    return new Promise(function(resolve, reject) {
        fs.readFile(fileName, function(error, data) {
            if (error) {
                reject(error);
            } 
            else{
              resolve(data.toString());
            }  
        }); 
    }); 
};  
rf('1.txt')
.then(function(data) {
    console.log(data);
      return new Promise(function(resolve, reject) {
        fs.readFile('1.txt', function(error, data) {
            if (error) {
                console.log(1231231232);
                reject(error);
            } 
            else{
              resolve(data.toString());
            }  
        }); 
    }); 
}).then(function(data) {
    console.log(data);
      return new Promise(function(resolve, reject) {
        fs.readFile('1.txt', function(error, data) {
            if (error) {
                reject(error);
            } 
            else{
              resolve(data.toString());
            }  
        }); 
    }); 
}); 
```


## vue组件
组件系统是Vue.js其中一个重要的概念，
它提供了一种抽象，让我们可以使用独立可复用的小组件来构建大型应用，
任意类型的应用界面都可以抽象为一个组件树：
### 定义全局的组件
    <div id="app">
        <!-- 3. #app是Vue实例挂载的元素，应该在挂载元素范围内使用组件-->
        <my-component></my-component>
    </div>
    <script>
        // 1.创建一个组件构造器，定义一个组件
        var myComponent = Vue.extend({
          //template用来定义html部分
            template: '<div>囧囧</div>'
        })
        // 2.注册组件 第一个参数是组件的名称，第二个是构造后的组件
        //全局注册，在当前页面中所有的被Vue控制的页面元素随意使用
        Vue.component('my-component', myComponent)
        
        new Vue({
            el: '#app'
        });
    </script>

总结
* Vue.extend()是Vue构造器的扩展，调用Vue.extend()创建的是一个组件构造器。 
* Vue.extend()构造器有一个选项对象，选项对象的template属性用于定义组件要渲染的HTML。 
* 使用Vue.component()注册组件时，需要提供2个参数，第1个参数时组件的标签，第2个参数是组件构造器。 
* 组件应该挂载到某个Vue实例下，否则它不会生效。

注意点：
 可以使用
	  <div id="app">
			<my-component></my-component>
		</div>  
单独写，在非vue控制区不可以使用
    <my-component></my-component> 
可以替代自定义指令
### 定义局部组件 只把组件注册给了demo1这个实例

	var myComponent = Vue.extend({
			template: '<div>囧囧!</div>'
		})

	var demo1=new Vue({
			el: '#app',
			components: {
				// 将myComponent组件注册到Vue实例下
				'my-component': myComponent
			}
		});

注意点:如果在建一个实例没有注册my-component则不能使用
### 组件的互相调用

        <div id="app">
            <parent-component>
            </parent-component>
        </div>
    <script>
        var Child = Vue.extend({
            template: '<p>儿子</p>'
        })
        
        var Parent = Vue.extend({
            //child-component调用儿子组件
            template :'<p>父亲</p><child-component></child-component>',
            components: {
              //注册儿子
                'child-component': Child
            }
        })
        // 全局注册Parent组件
        Vue.component('parent-component', Parent)
        
        new Vue({
            el: '#app'
        })
    </script>
       
注意点:template不支持添加多个dom节点，只能有一个根元素

语法糖：
    var child={
         template:"<p>儿子</p>"
       }
       替代
    var Child = Vue.extend({
            template: '<p>儿子</p>'
    })


组件的嵌套写法
### 组件的互相调用

        <div id="app">
            <parent-component>
            </parent-component>
        </div>
    <script>
        var Parent = Vue.extend({
            //child-component调用儿子组件
            template :'<div><p>父亲</p><child-component></child-component></div>',
            components: {
              //注册儿子
                'child-component': Vue.extend({
                 template: '<p>儿子</p>'
              })
            }
        })
        // 全局注册Parent组件
        Vue.component('parent-component', Parent)
        
        new Vue({
            el: '#app'
        })
 
### 组件之间传值
使用prop传递数据
组件实例的作用域是孤立的，这意味着不能并且也不应该在
子组件的模板内直接引用父组件的数据。可以使用props把数据传递过去。

        <div id="app">
            <parent-component>
            </parent-component>
        </div>
    <script>
        var Child = Vue.extend({
            props:['myMsg'],
            template: '<p>{{myMsg}}</p>'
        })
        var Parent = Vue.extend({
            //child-component调用儿子组件
            //在标签里面不支持驼峰，修改成-连接两单词
            template :'<p>父亲</p><child-component my-msg="foo" ></child-component>',
            components: {
              //注册儿子
                'child-component': Child
            }
        })
        // 全局注册Parent组件
        Vue.component('parent-component', Parent)
        
        new Vue({
            el: '#app'
        })

动态prop 


        <div id="app">
            <parent-component>
            </parent-component>
        </div>
    <script>
        var Child = Vue.extend({
            props:['myMsg'],
            template: '<p>{{myMsg}}</p>'
        })
        var Parent = Vue.extend({
            //child-component调用儿子组件
            //在标签里面不支持驼峰，修改成-连接两单词
            template :'<input v-model="parentMsg"><child-component :my-msg="parentMsg" ></child-component>',
            components: {
              //注册儿子
                'child-component': Child
            },
            data:function(){
              return {"parentMsg":""}
            }
        })
        // 全局注册Parent组件
        Vue.component('parent-component', Parent)
        
        new Vue({
            el: '#app'
            data:{

            }
        })
# webpack
## webpack
### 网站
官网http://webpack.github.io/
1.X官方文档http://webpack.github.io/docs/
### 什么是webpack？
webpack is a module bundler.
webpack是一个模块化的打包工具。---->先抛开node.js
sea.js+符合CMD规范开发的js文件---------->一起引入html进行执行
符合CMD规范开发的js文件---通过webpack的解析---->合并成一个js文件--->引入html进行执行

### webpack所支持的规范
CMD、AMD、CommonJS、ES2015 module
### webpack的使用
安装命令
npm i webpack -g
使用命令
webpack ./app.js app.bundle.js
### webpack配置文件
1. 文件名--->webpack.config.js
2. 配置文件,使用module.exports曝露出对象
3. 通过对对象属性的设置进而设置webpack的任务
```javascript
 module.exports = {
     entry: './src/app.js',
     output: {
         path: './bin',
         filename: 'app.bundle.js',
     }
 }
```
entry属性：用来配置要打包的入口文件
值可以是

1. 字符串  entry: './src/app.js'

2. 数组  entry: ['./src/app1.js','./src/app2.js']

3. 对象  对象的键名这里称之为块名（代码块的意思），块名可以在output属性中使用
```javascript
entry: { 
    app1:"./src/app1.js",
    app2:"./src/app2.js",
}
 output: {
    path: './bin',
    filename: '[name].bundle.js',
}
```