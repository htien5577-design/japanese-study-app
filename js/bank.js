/* Ngân hàng câu hỏi SWT301 / JPD133: làm bài, thống kê, tạo bài kiểm tra */
var BANK=window.QUIZ_DATA;
var bk={m:"swt",view:"quiz",list:[],i:0,sel:[],done:false,ok:0,n:0,tried:[],elim:[],clean:true,msg:"",mc:"",ai:"",aiBusy:false,wrong:{swt:[],jpd:[]}};
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
bk.ts={sel:"",n:""};bk.ord="rand";
function attr(s){return esc(s).replace(/'/g,"&#39;")}
function parseSel(s,max){
  var set={};s=(s||"").replace(/\s*[-–~]\s*/g,"-").trim();
  if(!s){for(var i=1;i<=max;i++)set[i]=1}
  else s.split(/[,;\s]+/).forEach(function(tk){
    var m=tk.match(/^(\d+)(?:-(\d+))?$/);if(!m)return;
    var a=+m[1],b=m[2]?+m[2]:a;if(a>b){var z=a;a=b;b=z}
    for(var i=Math.max(1,a);i<=Math.min(max,b);i++)set[i]=1;
  });
  return Object.keys(set).map(Number).sort(function(x,y){return x-y});
}
function tsInfo(){
  var max=BANK[bk.m].length,pool=parseSel(bk.ts.sel,max);
  if(!pool.length)return "Chưa chọn được câu nào, hãy kiểm tra cách nhập (vd: 1-30, 45).";
  var n=Math.min(pool.length,parseInt(bk.ts.n,10)||pool.length);
  return "Vùng chọn: "+pool.length+" câu · Bài kiểm tra: "+n+" câu ("+(bk.ord==="rand"?"ngẫu nhiên trong vùng":"theo thứ tự số câu")+")";
}
function setupHtml(){
  var max=BANK[bk.m].length;
  return "<div class='panel' style='text-align:left'><h3 style='margin:0 0 12px'>Tạo bài kiểm tra "+(bk.m==="swt"?"SWT301":"JPD133")+"</h3>"
  +"<div class='score'>Vùng câu hỏi (theo số thứ tự ở mục Xem tất cả, từ 1 đến "+max+")</div>"
  +"<input type='text' id='tsSel' value='"+attr(bk.ts.sel)+"' placeholder='vd: 1-30, 45, 60-80 (để trống = tất cả)' style='width:100%;margin:6px 0 14px'>"
  +"<div class='score'>Số câu muốn làm</div>"
  +"<input type='text' inputmode='numeric' id='tsN' value='"+attr(bk.ts.n)+"' placeholder='để trống = tất cả câu trong vùng' style='width:100%;margin:6px 0 14px'>"
  +"<div class='score'>Cách chọn câu</div>"
  +"<div class='opts' style='margin-top:6px'><button data-ord='rand' class='"+(bk.ord==="rand"?"on":"")+"'>\ud83d\udd00 Ngẫu nhiên trong vùng</button><button data-ord='seq' class='"+(bk.ord==="seq"?"on":"")+"'>\ud83d\udd22 Theo thứ tự số câu</button></div>"
  +"<div id='tsInfo' class='msg'>"+tsInfo()+"</div><button data-act='mk' class='on'>Bắt đầu làm bài</button></div>";
}
function startList(list){bk.list=list;bk.i=0;resetQ();bk.ok=0;bk.n=0;bk.view="quiz";drawBank()}
function makeTest(){
  var max=BANK[bk.m].length,pool=parseSel(bk.ts.sel,max);
  if(!pool.length){$("tsInfo").textContent=tsInfo();return}
  var n=Math.min(pool.length,parseInt(bk.ts.n,10)||pool.length),idx=pool.slice();
  if(bk.ord==="rand")idx.sort(function(){return Math.random()-.5});
  startList(idx.slice(0,n).map(function(i){return BANK[bk.m][i-1]}));
}
function startBank(m,wrongOnly){
  if(m){if(m!==bk.m)bk.ts={sel:"",n:""};bk.m=m}
  var src=wrongOnly?bk.wrong[bk.m]:BANK[bk.m];
  bk.list=src.slice().sort(function(){return Math.random()-.5});
  if(wrongOnly)bk.wrong[bk.m]=[];
  bk.i=0;resetQ();bk.ok=0;bk.n=0;bk.view="quiz";drawBank();
}
function resetQ(){bk.sel=[];bk.done=false;bk.tried=[];bk.elim=[];bk.clean=true;bk.msg="";bk.mc="";bk.ai="";bk.aiBusy=false}
function grade(){
  var q=bk.list[bk.i],good=bk.sel.slice().sort().join("")===q.a;
  if(good){
    bk.done=true;bk.n++;
    if(bk.clean){bk.ok++;bk.msg="Đúng!"}
    else{bk.msg="Đúng rồi! Câu này đã được thêm vào mục Ôn câu sai.";if(bk.wrong[bk.m].indexOf(q)<0)bk.wrong[bk.m].push(q)}
    bk.mc="ok";
  }else{
    bk.clean=false;
    if(q.a.length===1&&bk.tried.indexOf(bk.sel[0])<0)bk.tried.push(bk.sel[0]);
    bk.sel=[];bk.msg="Sai rồi, hãy chọn lại!";bk.mc="bad";
  }
}
function hint(){
  var q=bk.list[bk.i];
  var c=Object.keys(q.o).filter(function(k){return q.a.indexOf(k)<0&&bk.elim.indexOf(k)<0&&bk.tried.indexOf(k)<0});
  if(!c.length){bk.msg="Hết gợi ý: chỉ còn đáp án đúng.";bk.mc="";return}
  var k=c[Math.floor(Math.random()*c.length)];
  bk.elim.push(k);bk.clean=false;
  bk.sel=bk.sel.filter(function(x){return x!==k});
  bk.msg="Gợi ý: đã loại 1 đáp án sai ("+k+").";bk.mc="";
}
function listHtml(kw){
  var h="",k=(kw||"").toLowerCase();
  BANK[bk.m].forEach(function(q,i){
    var t=q.q+" "+Object.keys(q.o).map(function(x){return q.o[x]}).join(" ");
    if(k&&t.toLowerCase().indexOf(k)<0)return;
    h+="<div class='qi'><p><b>"+(i+1)+".</b> "+esc(q.q)+"</p>";
    Object.keys(q.o).forEach(function(x){h+="<div"+(q.a.indexOf(x)>=0?" class='ans'":"")+">"+x+". "+esc(q.o[x])+"</div>"});
    h+="</div>";
  });
  return h||"<p class='score'>Không có kết quả.</p>";
}
function drawBank(){
  var B=BANK[bk.m],w=bk.wrong[bk.m].length;
  var h="<div class='opts'><button data-v='quiz' class='"+(bk.view==="quiz"?"on":"")+"'>Làm bài ngẫu nhiên</button><button data-v='list' class='"+(bk.view==="list"?"on":"")+"'>Xem tất cả ("+B.length+")</button><button data-v='wrong'>Ôn câu sai ("+w+")</button><button data-v='setup' class='"+(bk.view==="setup"?"on":"")+"'>⚙️ Tạo bài kiểm tra</button></div>";
  if(bk.view==="setup"){h+=setupHtml()}
  else if(bk.view==="list"){
    h+="<input type='text' id='bkSearch' placeholder='Tìm câu hỏi...' style='width:100%;margin-bottom:4px'><div id='bkList'>"+listHtml("")+"</div>";
  }else{
    var q=bk.list[bk.i];
    if(!q){var bad=bk.n-bk.ok;h+="<div class='panel'><div class='big' style='font-size:2.2rem'>"+bk.ok+"/"+bk.list.length+"</div><p>Đúng: <b class='ok'>"+bk.ok+"</b> · Sai: <b class='bad'>"+bad+"</b> · Còn lại: <b>"+(bk.list.length-bk.n)+"</b><br><span class='score'>"+Math.round(bk.ok*100/Math.max(1,bk.list.length))+"% đúng ngay lần đầu, không dùng gợi ý</span></p><button data-act='restart'>Làm lại</button> "+(w?"<button data-v='wrong'>Ôn "+w+" câu sai</button>":"")+"</div>"}
    else{
      var multi=q.a.length>1;
      h+="<div class='panel' style='text-align:left'><div class='score' style='margin:0 0 8px'>Câu "+(bk.i+1)+"/"+bk.list.length+" (số "+(BANK[bk.m].indexOf(q)+1)+") · Đúng "+bk.ok+" · Sai "+(bk.n-bk.ok)+" · Còn lại "+(bk.list.length-bk.n)+(multi?" · chọn nhiều đáp án":"")+"</div><p style='font-size:1.15rem;margin:0 0 6px'>"+esc(q.q)+"</p><div class='choices' style='grid-template-columns:1fr'>";
      Object.keys(q.o).forEach(function(k){
        var c="",dis="";
        if(bk.done){if(q.a.indexOf(k)>=0)c="ok-b"}
        else if(bk.tried.indexOf(k)>=0){c="bad-b";dis=" disabled"}
        else if(bk.elim.indexOf(k)>=0){c="gone";dis=" disabled"}
        else if(bk.sel.indexOf(k)>=0)c="on";
        h+="<div data-o='"+k+"' class='opt "+c+(dis?" off":"")+"'>"+k+". "+esc(q.o[k])+"</div>";
      });
      h+="</div>";
      if(!bk.done)h+="<p>"+(multi?"<button data-act='check'>Kiểm tra</button> ":"")+"<button data-act='hint'>💡 Gợi ý</button>"+(SAMPLE?" <button data-act='ai'>🤖 AI gợi ý</button>":"")+"</p>";
      if(bk.msg)h+="<div class='msg "+bk.mc+"'>"+esc(bk.msg)+"</div>";
      if(bk.ai)h+="<div class='qi' style='white-space:pre-wrap'>🤖 "+esc(bk.ai)+"</div>";
      if(bk.done)h+="<button data-act='next'>Câu tiếp</button> ";
      h+="<p style='margin-top:12px'><button data-act='finish'>Kết thúc và xem kết quả</button></p>";
      h+="</div>";
    }
  }
  $("bank").innerHTML=h;
}
$("bank").addEventListener("click",function(e){
  var t=e.target.closest("button,.opt");if(!t)return;if(t.classList.contains("opt")&&(t.classList.contains("off")||String(window.getSelection()).trim()))return;
  if(t.dataset.v){
    if(t.dataset.v==="wrong"){if(bk.wrong[bk.m].length)startBank(null,true);return}
    if(t.dataset.v==="quiz"){startBank();return}
    bk.view=t.dataset.v;drawBank();return;
  }
  var q=bk.list[bk.i];
  if(t.dataset.o&&q&&!bk.done){
    var k=t.dataset.o;
    if(q.a.length>1){var p=bk.sel.indexOf(k);if(p<0)bk.sel.push(k);else bk.sel.splice(p,1)}
    else{bk.sel=[k];grade()}
    drawBank();
  }else if(t.dataset.act==="check"&&!bk.done&&bk.sel.length){grade();drawBank()}
  else if(t.dataset.act==="next"){bk.i++;resetQ();drawBank()}
  else if(t.dataset.act==="hint"&&q&&!bk.done){hint();drawBank()}
  else if(t.dataset.act==="ai"){askAI()}
  else if(t.dataset.act==="finish"){bk.i=bk.list.length;resetQ();drawBank()}
  else if(t.dataset.act==="restart"){startBank()}
});
$("bank").addEventListener("click",function(e){
  var t=e.target.closest("button");if(!t)return;
  if(t.dataset.ord){bk.ord=t.dataset.ord;drawBank();return}
  if(t.dataset.act==="mk")makeTest();
});
$("bank").addEventListener("input",function(e){
  if(e.target.id==="tsSel")bk.ts.sel=e.target.value;
  else if(e.target.id==="tsN"){e.target.value=bk.ts.n=e.target.value.replace(/[^0-9]/g,"")}
  else return;
  $("tsInfo").textContent=tsInfo();
});
$("bank").addEventListener("input",function(e){if(e.target.id==="bkSearch")$("bkList").innerHTML=listHtml(e.target.value)});
