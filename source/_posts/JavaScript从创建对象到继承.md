---
title: JavaScript从创建对象到继承
date: 2017-07-14 
categories: 前端
tags:
     - 黑魔法
     - 奇淫技巧
---
## 创建对象
在js的继承之前，先创建一下js对象。JavaScript高级程序设计里面介绍了两种创建自定义单个对象的方法：
创建一个 Object() 实例
```js
var person = new Object()
// 创建变量
person.name = "Nick"
person.age = 29
person.job = "FrontEnd Engineer"
// 创建方法
person.sayName = function() {
 console.log(this.name)
}
对象字面量的方式
var person = {
 // 创建变量
 name: "Nick",
 age: 29,
 job: "FrontEnd Engineer",
 // 创建方法
 sayName: function() {
  console.log(this.name)
 }
}
```
以上两种方法都创建了单个person对象，这两个person对象都是一样的。我们可以通过“ . ”操作符访问到对象的属性，例如：person.name 的值为 "Nick"。

如果我们现在要创建另一个person对象，假设为person2，我们依然可以按照上面的两种方式创建person2，于是我们又为person2设置name,age...这些属性。那么问题来了，世界上有辣么多人，我们总不能一直按照这种方式创建下去吧。

这个时候我们希望有这么一个函数，当我们输入name，age，job等一些具有标识性的属性之后，它会返回一个我需要的对象给我，于是我们再也不用手动去写那么多重复的代码创建相似对象的代码了，因为这个函数可以复用啊。

这就是以工厂模式成批创建对象：

```js
    // 工厂函数
    function createPerson(name, age, job) {
      var obj = new Object()
      obj.name = name
      obj.age = age
      obj.job = job
      obj.sayName = function() {
        console.log(this.name)
      }
      return obj
    }
    var person1 = createPerson("张三", 33, "搬砖的")
    person1.sayName() // "张三"
    var person2 = createPerson("李四", 23, "杀猪的")
    person2.sayName() // "李四"    
```
    
可以看到，工厂模式虽然解决了不用写重复代码的问题，但是却没有解决对象识别问题，即不知道person1和person2是属于什么对象类型（在java中就是它们不知道是属于什么类）。
随着JavaScript的发展，又一种新的模式出现了，就是构造函数模式

```js
    // 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性，显式赋给this对象，this指向Person构造函数
      this.name = name
      this.age = age
      this.job = job
      // 创建方法
      this.sayName = function() {
        console.log(this.name)
      }
    }

    var person1 = new Person("张三", 33, "搬砖的")
    person1.sayName() // "张三"
    var person2 = new Person("李四", 23, "杀猪的")
    person2.sayName() // "李四"
```

构造函数模式使用new操作符创建对象实例，对象实例还是对象，它的创建过程有四个步骤：
* 创建一个空对象：var person1 = {}
* 把Person构造函数的作用域赋给person1： 构造函数的this指向person1
* 执行构造函数内的代码（this.name = name...）: 为person1对象添加属性或方法
* 返回新的对象person1（经过2，3步骤加工的）

通过构造函数模式，我们创建的person1，person2有了一个明确的归类，即属于“Person类”。解决了工厂模式的对象识别问题。
然而，通过构造函数模式，我们每创建一个person实例，就会执行一次步骤三，即执行赋值属性给this对象，name,age等需要区分的属性确实需要执行，但每个person都有sayName方法，创建一个函数是需要消耗内存的，这里创建了两次，所以要想办法只创建一次，于是我们可以预先创建一个函数，创建实例的时候引用一下就可以了：



```js
    // 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性，显式赋给this对象，this指向Person构造函数
      this.name = name
      this.age = age
      this.job = job
      // 创建方法
      this.sayName = sayName
    }

    function sayName() {
      console.log(this.name)
    }
```
以上代码在全局作用域创建了一次sayName函数，以后每次引用一下就可以了，就可以不用每次创建了，好像目的已经达到了。可可可可可是，这就没有封装性可言了，而且还会造成全局变量污染。

那有什么办法可以解决这个问题呢？有，在构造函数的原型对象上定义：
```js
    // 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性
      this.name = name
      this.age = age
      this.job = job      
    }

    // 在原型对象上定义方法
    Person.prototype.sayName = function() {
      console.log(this.name)
    }

    var person1 = new Person("张三", 33, "搬砖的")
    person1.sayName() // "张三"
    var person2 = new Person("李四", 23, "杀猪的")
    person2.sayName() // "李四"
```

这里简要介绍一下原型对象。
无论什么时候，只要创建了一个函数，这个函数就会拥有一个属性prototype，这个prototype指向函数的原型对象，即
```js
    function Person(name, age, job) {
      // 默认属性
      this.prototype = 当前函数的原型对象
      // 创建属性
      this.name = name
      this.age = age
      this.job = job      
    }
```

自定义构造函数的原型对象上（比如本文的Person构造函数）默认只有一个constructor属性，这个constructor属性指向Person()。至于还有一些其他方法都是从Object继承过来的，这里就不扯那么多了。

对于在函数原型对象上定义的属性，这里只讲两点：（更多内容应该去看高级程序设计）

函数原型对象上的属性和方法都是所有实例共享的，值类型可以覆盖，但不能重写：
```js
function Person(name, age) {
   // 创建属性
   this.name = name
   this.age = age   
 }

 Person.prototype.job = "搬砖"

 var person1 = new Person("张三", 33)
 console.log(person1.job) // "搬砖"
 // 覆盖
 person1.job = "颠勺"
 console.log(person1.job) // "颠勺"

 var person2 = new Person("李四", 43)
 // 未被重写
 console.log(person2.job) // "搬砖"
```

对于在原型对象上定义的引用类型的值，却是可以修改的：
```js
function Person(name, age) {
   // 创建属性
   this.name = name
   this.age = age   
 }

 Person.prototype.job = ["搬砖", "颠勺", "web前端"]

 var person1 = new Person("张三", 33)
 console.log(person1.job) // ["搬砖", "颠勺", "web前端"]
 // 修改
 person1.job.shift()
 console.log(person1.job) // ["搬砖", "颠勺"]

 var person2 = new Person("李四", 43)
 // 被修改了
 console.log(person2.job) // ["搬砖", "颠勺"]
```

在Person函数的原型对象上定义sayName方法后，实例person1和person2都可以访问到sayName()，而且访问到的是同一个sayName()，这就解决了sayName()会被创建两次的问题了。
JavaScript高级程序设计里还有几种创建对象方式以及对原型对象的详细描述，这里就不提及了，有需要的可以去看看。下面我们正式来聊聊JavaScript的继承。

## 继承

JavaScript的继承是实现继承，即继承实际的方法。是基于原型链的。

JavaScript为什么需要继承？

回顾一下上文讲的构造函数Person:
```js
    // 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性
      this.name = name
      this.age = age
      this.job = job      
    }
    // 在原型对象上定义方法
    Person.prototype.sayName = function() {
      console.log(this.name)
    }
    var person1 = new Person("张三", 33, "搬砖的")
    person1.sayName() // "张三"
    person1.age // 33
    person1.job // "搬砖的"
```


假设现在我需要创建多个相似的man对象，需要通过Man()构造函数创建，这个Man()构造函数拥有Person构造函数的全部属性和方法，同时还要拥有属于自己的属性以及方法。
这个时候，我们为了不写重复的代码（按照Person构造函数实现一遍Man），根据许多OO语言的经验，想到了如果可以继承Person定义的属性和方法该多好啊。
那么该怎么实现对象的继承呢？
用JavaScript特色原型链的方式
## 1. 组合继承（伪经典继承）

实例对象person1拥有Person内部及原型上定义的所有属性和方法，如果让Man()构造函数的原型对象等于person1会发生什么呢？

对，没错！Man()的原型对象上就会拥有Person原型对象上的所有属性和方法，看代码：
```js
    // 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性
      this.name = name
      this.age = age
      this.job = job      
    }

    // 在原型对象上定义方法
    Person.prototype.sayName = function() {
      console.log(this.name)
    }

    var person1 = new Person()

    // Man构造函数
    function Man() {
      // 定义自己的私有属性
      this.name = "ironman"
    }

    // 还记得每创建一个函数，函数内部都会有一个prototype属性指向当前函数的原型对象吗
    // 现在将Man的prototype属性更改默认的指向，指向实例对象person1
    Man.prototype = person1

    var man1 = new Man()
    // 实例对象就能访问Man原型对象上的sayName方法了
    // 注意此时sayName()内部的this指向man1，因为this指向是根据被调用的时候来确定的，此处调用sayName的是实例对象man1
    man1.sayName() // ironman
    console.log(person1.age) // undefined
    console.log(person1.job) // undefined
```

以上代码中Man()继承了Person()原型上的sayName方法，但并没有继承Person()内部的私有属性（name, age, job）。因为这些属性不能被共享，也就不能定义在原型对象上，那该怎么去继承得到呢。

我们知道，构造函数也是函数，也可以被调用，只不过构造函数还可以用来创建对象罢了。所以我们尝试在Man()内部调用一下Person()看看：
```js
// 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性
      this.name = name
      this.age = age
      this.job = job      
    }

    // 在原型对象上定义方法
    Person.prototype.sayName = function() {
      console.log(this.name)
    }

    var person1 = new Person()

    // Man构造函数
    function Man(name, age, job) {
      // 调用Person()，把Person()的this对象换成Man(),并传入三个参数
      Person.call(this, name, age, job)
      // 定义自己的私有属性
      this.hobby= "play ironman"
    }

    // 还记得每创建一个函数，函数内部都会有一个prototype属性指向当前函数的原型对象吗
    // 现在将Man的prototype属性更改默认的指向，指向实例对象person1
    Man.prototype = person1

    var man1 = new Man("尼古拉斯", 23, "赵四")

    man1.sayName() // "尼古拉斯"
    console.log(person1.age) // 23
    console.log(person1.job) // 赵四
```

以上代码我们让Man()接受参数，并把参数传入Person()，我们惊喜的发现Man()内部拥有了name,age,job字段，所以也就继承了Person()内部的属性。这种在子类型构造函数内部调用父类型构造函数的方式叫借用构造函数

继承私有属性和定义在原型对象上的方法已经完成了，这里还有一个问题：还记得Person()原型对象上的constructor属性吗，它是指向Person()的。所以按理来说Man()原型对象上的constructor应该指向Man()!

理论不如实践，试着在Man()内部打印this.constructor，你会发现打印出来了Person()。

咋回事？道理很简单，Man()的原型对象改变了，现在是实例对象person1，所以Man()原型对象的constructor属性指向应该取决于person1的原型对象constructor指向。

由于person1是通过Person()创建的，所以person1的原型对象上的constructor指向Person()。这就很好地验证了前面打印出了Person()了。

既然指向出错了，就要指回来呗：
```js
    ...    
    // 还记得每创建一个函数，函数内部都会有一个prototype属性指向当前函数的原型对象吗
    // 现在将Man的prototype属性更改默认的指向，指向实例对象person1
    Man.prototype = person1
    // 把Man的原型对象上的constructor指回Man()
    Man.prototype.constructor = Man
    ...
```

以上完整代码如下：
```js
    // 按照规定，构造函数的首字母必须大写，以区分和普通函数的差别
    function Person(name, age, job) {
      // 创建属性
      this.name = name
      this.age = age
      this.job = job      
    }

    // 在原型对象上定义方法
    Person.prototype.sayName = function() {
      console.log(this.name)
    }

    var person1 = new Person()

    // Man构造函数
    function Man(name, age, job) {
      // 调用Person()，把Person()的this对象换成Man(),并传入三个参数
      Person.call(this, name, age, job)
      // 定义自己的私有属性
      this.hobby= "play ironman"
    }

    // 还记得每创建一个函数，函数内部都会有一个prototype属性指向当前函数的原型对象吗
    // 现在将Man的prototype属性更改默认的指向，指向实例对象person1
    Man.prototype = person1
    // 把Man的原型对象上的constructor指回Man()
    Man.prototype.constructor = Man

    // 在Man的新原型上定义方法
    Man.prototype.sayHobby = function() {
      console.log(this.hobby)
    }

    var man1 = new Man("王二麻子", 23, "打杂的")

    man1.sayName() // "王二麻子"
    man1.sayHobby() // "play ironman"
    console.log(person1.age) // 23
    console.log(person1.job) // 打杂的
```

通过上面的例子可以得出组合继承的一般形式：
```js
    // 父对象
    function Super (name) {
      this.name = name
      this.color = ['blue', 'red', 'yello']
    }
    Super.prototype.sayName = function () {
      console.log(this.name)
    }


    // 子对象
    function Sub (name, age) {
      // 调用父对象的构造函数，继承属性
      Super.call(this, name)
      this.age = age
    }

    // 子对象的原型指向父对象的实例，此时子对象的constructor属性指向父对象构造函数
    // 继承方法
    Sub.prototype = new Super()
    // 重新将子对象的constructor指回自身
    Sub.prototype.constructor = Sub

    // 在新原型上定义方法
    Sub.prototype.sayAge = function () {
      console.log(this.age)
    }

    // 创建子对象实例1，修改继承的引用类型属性
    var instance1 = new Sub('lol', 22)
    instance1.color.push('pink')
    console.log(instance1.color) // ['blue', 'red', 'yello','pink']
    instance1.sayName() // 'lol'
    instance1.sayAge() // 22

    // 创建子对象实例2，继承的引用类型属性不会因为实例1的修改而变化
    var instance2 = new Sub('oop', 33)
    console.log(instance2.color) // ['blue', 'red', 'yello']
    instance2.sayName() // 'oop'
    instance2.sayAge() // 33
```

## 2. 原型式继承 （值类型继承）

从本质上讲，原型式继承不考虑自定义构造函数，只是对父对象的一次浅复制
```js
    // 定义一个函数，接受一个需要被继承的父对象，返回一个子对象的实例
    function object (o) {
      // 定义一个构造函数F
      function F() {}
      // 修改F的原型对象为父对象
      F.prototype = o
      // 返回经过修改原型对象的构造函数F的实例
      return new F()
    }

    // 定义一个父对象
    var person = {
      name: 'seven',
      friends: ['blob', 'micelid', 'jerry']
    }

    // 子对象1
    var man1 = object(person)
    man1.friends.shift() // 修改引用类型的值
    console.log(man1.name) // 'seven'
    console.log(man1.friends) // ['blob', 'micelid', 'jerry']

    // 子对象2
    var man2 = object(person)    
    console.log(man1.name) // 'seven'
    console.log(man1.friends) // ['blob', 'micelid'] 因为子对象1修改了friends
```
  
原型式继承需要注意的是，父对象的引用类型会被不同的实例修改

es5 通过Object.create()函数规范了原型式继承,可以接受第二个参数
```js
    ...
    var man3 = Object.create(person)
    console.log(man3.name) // 'seven'
    console.log(man3.friends) // ['blob', 'micelid'] 因为子对象1修改了friends

    var man4 = Object.create(person, { 
      name: { 
        value: 'james' 
      } 
    })
    console.log(man4.name) // 'james'
    console.log(man4.friends) // ['blob', 'micelid'] 因为子对象1修改了friends
```

## 3. 寄生式继承 （值类型继承）

在主要考虑对象而不是自定义类型或构造函数的情况下使用，在原型式继承的思路上增强了对象（给子对象添加属性）
```js
    function createAnother (original) {
      // 克隆一个新对象
      var clone = Object(original)
      // 给新对象添加一个方法，增强属性
      clone.sayHi = function() {
        console.log('Hi')
      }
      return clone
    }
    var another = createAnother(person)
    another.sayHi() // 'Hi'
```

## 4. 寄生组合式继承 （引用类型继承最理想的继承范式）

组合继承模式中，每创建一个man实例，都会调用两次Person(),一次是在Man()的内部，一次实在指定子类型原型对象的时候：
```js
    ...
    // 子对象
    function Sub (name, age) {
      // 调用父对象的构造函数，继承属性
      Super.call(this, name) // -----------第二次调用SuperType
      this.age = age
    }

    // 子对象的原型指向父对象的实例，此时子对象的constructor属性指向父对象构造函数
    // 继承方法
    Sub.prototype = new Super() // --------------第二次调用SuperType
    // 重新将子对象的constructor指回自身
    Sub.prototype.constructor = Sub
    ...
```

寄生组合式继承借用构造函数继承属性，原型链的混成形式继承方法，解决组合继承需要调用两次构造函数的问题
```js
    // 专门定义一个函数来完成子类型原型对象的更改和原型上constructor属性的指回
    function inheritPrototype (SubType, SuperType) {

      // 克隆父对象的原型
      var prototype = Object(SuperType.prototype)

      // 把克隆对象的constructor属性指向子类型
      prototype.constructor = SubType

      // 子类型的原型指向克隆对象
      SubType.prototype = prototype
    }

    // 父对象
    function SuperType (name) {
      this.name = name
    }
    SuperType.prototype.sayName = function() {
      console.log(this.name)
    }

    // 子对象
    function SubType (name, age) {
      // 继承属性
      SuperType.call(this, name)
      this.age = age
    }    

    // 原型链混成形式继承父对象原型上的方法
    inheritPrototype(SubType, SuperType)

    // 在新原型上定义方法
    SubType.prototype.sayAge = function () {
      console.log(this.age)
    }

    var sub1 = new SubType('lee', 18)
    sub1.sayName() // ’lee'
    sub1.sayAge() // 18

    var sub2 = new SubType('liu', 28)
    sub2.sayName() // 'liu'
    sub2.sayAge() // 28
```
JavaScript的继承一共有四种方式。可以根据不同的需求使用。
仅仅考虑创建相似对象的情况下，继承值类型，建议使用原型式继承；还需要继承引用类型，建议使用寄生式继承
继承引用类型的完整继承范式应该是寄生组合式继承，因为相比组合继承寄生组合式继承比较高效（减少调用父类型构造函数的次数）
