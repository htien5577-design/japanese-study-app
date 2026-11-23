/* Bảng chữ cái Hiragana/Katakana: bảng, thẻ ghi nhớ, kiểm tra */

// Bảng cơ bản + chữ đục (dakuten) + âm ghép (yoon)
var BASE=[
["a","あ","ア"],["i","い","イ"],["u","う","ウ"],["e","え","エ"],["o","お","オ"],
["ka","か","カ"],["ki","き","キ"],["ku","く","ク"],["ke","け","ケ"],["ko","こ","コ"],
["sa","さ","サ"],["shi","し","シ"],["su","す","ス"],["se","せ","セ"],["so","そ","ソ"],
["ta","た","タ"],["chi","ち","チ"],["tsu","つ","ツ"],["te","て","テ"],["to","と","ト"],
["na","な","ナ"],["ni","に","ニ"],["nu","ぬ","ヌ"],["ne","ね","ネ"],["no","の","ノ"],
["ha","は","ハ"],["hi","ひ","ヒ"],["fu","ふ","フ"],["he","へ","ヘ"],["ho","ほ","ホ"],
["ma","ま","マ"],["mi","み","ミ"],["mu","む","ム"],["me","め","メ"],["mo","も","モ"],
["ya","や","ヤ"],null,["yu","ゆ","ユ"],null,["yo","よ","ヨ"],
["ra","ら","ラ"],["ri","り","リ"],["ru","る","ル"],["re","れ","レ"],["ro","ろ","ロ"],
["wa","わ","ワ"],null,null,null,["wo","を","ヲ"],
["n","ん","ン"]
];
var DAKU=[
["ga","が","ガ"],["gi","ぎ","ギ"],["gu","ぐ","グ"],["ge","げ","ゲ"],["go","ご","ゴ"],
["za","ざ","ザ"],["ji","じ","ジ"],["zu","ず","ズ"],["ze","ぜ","ゼ"],["zo","ぞ","ゾ"],
["da","だ","ダ"],["ji","ぢ","ヂ"],["zu","づ","ヅ"],["de","で","デ"],["do","ど","ド"],
["ba","ば","バ"],["bi","び","ビ"],["bu","ぶ","ブ"],["be","べ","ベ"],["bo","ぼ","ボ"],
["pa","ぱ","パ"],["pi","ぴ","ピ"],["pu","ぷ","プ"],["pe","ぺ","ペ"],["po","ぽ","ポ"]
];
var YOON=[
["kya","きゃ","キャ"],null,["kyu","きゅ","キュ"],null,["kyo","きょ","キョ"],
["sha","しゃ","シャ"],null,["shu","しゅ","シュ"],null,["sho","しょ","ショ"],
["cha","ちゃ","チャ"],null,["chu","ちゅ","チュ"],null,["cho","ちょ","チョ"],
["nya","にゃ","ニャ"],null,["nyu","にゅ","ニュ"],null,["nyo","にょ","ニョ"],
["hya","ひゃ","ヒャ"],null,["hyu","ひゅ","ヒュ"],null,["hyo","ひょ","ヒョ"],
["mya","みゃ","ミャ"],null,["myu","みゅ","ミュ"],null,["myo","みょ","ミョ"],
["rya","りゃ","リャ"],null,["ryu","りゅ","リュ"],null,["ryo","りょ","リョ"],
["gya","ぎゃ","ギャ"],null,["gyu","ぎゅ","ギュ"],null,["gyo","ぎょ","ギョ"],
["ja","じゃ","ジャ"],null,["ju","じゅ","ジュ"],null,["jo","じょ","ジョ"],
["bya","びゃ","ビャ"],null,["byu","びゅ","ビュ"],null,["byo","びょ","ビョ"],
["pya","ぴゃ","ピャ"],null,["pyu","ぴゅ","ピュ"],null,["pyo","ぴょ","ピョ"]
];
var GROUPS=[["Cơ bản",BASE],["Chữ đục (゛ ゜)",DAKU],["Âm ghép",YOON]];
var ALL=[];GROUPS.forEach(function(g){g[1].forEach(function(x){if(x)ALL.push(x)})});

var mode="table",script="hira",qmode="choice";
var $=function(id){return document.getElementById(id)};
function chars(x){return script==="hira"?x[1]:script==="kata"?x[2]:(Math.random()<.5?x[1]:x[2])}

function renderTable(){
  var h="";
  GROUPS.forEach(function(g){
    h+="<h3>"+g[0]+"</h3><div class='grid'>";
    g[1].forEach(function(x){
      if(!x){h+="<div class='cell empty'></div>";return}
      var c=script==="hira"?"<b>"+x[1]+"</b>":script==="kata"?"<b>"+x[2]+"</b>":"<b>"+x[1]+" "+x[2]+"</b>";
      h+="<div class='cell'>"+c+"<span>"+x[0]+"</span></div>";
    });
    h+="</div>";
  });
  $("table").innerHTML=h;
}

var fCur=null;
function nextFlash(){fCur=ALL[Math.floor(Math.random()*ALL.length)];$("fChar").textContent=chars(fCur);$("fAns").textContent=""}
$("fShow").onclick=function(){if(fCur)$("fAns").textContent=fCur[0]};
$("fNext").onclick=nextFlash;

var qCur=null,score=0,total=0,answered=false;
function nextQ(){
  answered=false;qCur=ALL[Math.floor(Math.random()*ALL.length)];
  $("qChar").textContent=chars(qCur);$("qMsg").textContent="";$("qMsg").className="msg";
  if(qmode==="choice"){
    var opts=[qCur[0]];
    while(opts.length<4){var r=ALL[Math.floor(Math.random()*ALL.length)][0];if(opts.indexOf(r)<0)opts.push(r)}
    opts.sort(function(){return Math.random()-.5});
    $("qChoice").innerHTML="";
    opts.forEach(function(o){var b=document.createElement("button");b.textContent=o;b.onclick=function(){answer(o)};$("qChoice").appendChild(b)});
  }else{$("qInput").value="";$("qInput").focus()}
}
function answer(a){
  if(answered)return;answered=true;total++;
  var ok=a.trim().toLowerCase()===qCur[0];
  if(ok){score++;$("qMsg").textContent="Đúng!";$("qMsg").className="msg ok"}
  else{$("qMsg").textContent="Sai, đáp án: "+qCur[0];$("qMsg").className="msg bad"}
  $("qScore").textContent="Điểm: "+score+"/"+total;
  setTimeout(nextQ,ok?500:1300);
}
$("qGo").onclick=function(){answer($("qInput").value)};
$("qInput").addEventListener("keydown",function(e){if(e.key==="Enter")answer($("qInput").value)});
