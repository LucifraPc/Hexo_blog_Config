class A{
    constructor(v){
        this.v=v
    }
}
class B extends A{
   constructor(v){
       super(v);
       this.v++;
   }
   f(){
       return this.v;14
   }

}
