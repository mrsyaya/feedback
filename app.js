const http=require('http');
const fs=require('fs');
const template=require('art-template');
const url=require('url')
const moment=require('moment')
const comments=[
  {name:'小明',title:'very good',sex:0,date:'2020-02-04'},
  {name:'小王',title:'太棒了',sex:0,date:'2021-03-04'},
  {name:'小红',title:'林墨加油!',sex:1,date:'2021-04-01'},
]
http.createServer((function(req,res){
  const urlPath=req.url;
  const path=url.parse(req.url,true);
  const pathName=path.pathname;
  res.setHeader('Access-Control-Allow-Origin','*')
  if(pathName==='/'){
    res.setHeader('Content-Type','text/html;charset:utf-8')
    fs.readFile('./feedback.html',(err,data)=>{
      if(err){
       console.log('文件读取失败')
      }else{
        let newData=template.render(data.toString(),{
          comments:comments
        })
        res.end(newData)  
      }
    })
  }else if(pathName==="/post"){
    fs.readFile('./post.html',(err,data)=>{
      if(err){
       return res.end('404 no found')
      }else{
        res.end(data)  
      }
    })
  }else if(pathName.indexOf('/public/')===0){
    // 静态资源
    fs.readFile('.'+pathName,(err,data)=>{
      if(err){
       console.log('文件读取失败')
      }
      res.end(data) 
    })
  }else if(pathName.indexOf('/pinglun')===0 || pathName.indexOf('/add')===0){
    res.setHeader('Content-Type','text/plain;charset=utf-8')
    // res.end(JSON.stringify(path.query))
    // 重定向
    res.statusCode=302;
    res.setHeader('Location','/')
    comments.unshift({name:'匿名',...path.query,sex:(Math.random()*10 <5) ? 0 :1,date:moment().format('YYYY-MM-DD')});
    res.end()
  }else{
    res.setHeader('Content-Type','text/html;charset:utf-8')
    fs.readFile('./404.html',(err,data)=>{
      if(err){
       return res.end('404 no found')
      }else{
        res.end(data)  
      }
    })
  }

})).listen(8001,function(){
  console.log('running')
})