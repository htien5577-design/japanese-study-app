/* Số đếm tiếng Nhật: bảng số và ô quy đổi 0-9999 */
var D=[["〇","ゼロ","zero"],["一","いち","ichi"],["二","に","ni"],["三","さん","san"],["四","よん","yon"],["五","ご","go"],["六","ろく","roku"],["七","なな","nana"],["八","はち","hachi"],["九","きゅう","kyuu"]];
var IRR={100:{3:["さんびゃく","sanbyaku"],6:["ろっぴゃく","roppyaku"],8:["はっぴゃく","happyaku"]},1000:{3:["さんぜん","sanzen"],8:["はっせん","hassen"]}};
function conv(n){
  if(n===0)return{k:"〇",h:"ゼロ",r:"zero / rei"};
  var k="",h="",r="";
  [[1000,"千","せん","sen"],[100,"百","ひゃく","hyaku"],[10,"十","じゅう","juu"]].forEach(function(p){
    var d=Math.floor(n/p[0])%10;
    if(!d)return;
    if(d>1)k+=D[d][0];
    k+=p[1];
    var irr=IRR[p[0]]&&IRR[p[0]][d];
    if(irr){h+=irr[0];r+=irr[1]+" "}
    else if(d===1){h+=p[2];r+=p[3]+" "}
    else{h+=D[d][1]+p[2];r+=D[d][2]+p[3]+" "}
  });
  var o=n%10;
  if(o){k+=D[o][0];h+=D[o][1];r+=D[o][2]}
  return{k:k,h:h,r:r.trim()};
}
function renderNums(){
  var L=[0,1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,300,600,800,1000,3000,8000];
  var h="<table class='nt'><tr><th>Số</th><th>Hán tự</th><th>Hiragana</th><th>Romaji</th></tr>";
  L.forEach(function(n){var c=conv(n);h+="<tr><td>"+n+"</td><td>"+c.k+"</td><td>"+c.h+"</td><td>"+c.r+"</td></tr>"});
  h+="<tr><td>10000</td><td>一万</td><td>いちまん</td><td>ichiman</td></tr></table>";
  $("nTable").innerHTML=h;
}
$("nIn").addEventListener("input",function(){
  var v=this.value.replace(/[^0-9]/g,"");
  this.value=v;
  if(v===""){$("nK").textContent=$("nH").textContent=$("nR").textContent="";return}
  var c=conv(parseInt(v,10));
  $("nK").textContent=c.k;$("nH").textContent=c.h;$("nR").textContent=c.r;
});
