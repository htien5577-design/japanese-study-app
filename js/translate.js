/* Dịch AI khi bôi đen chữ (cần chạy trong Claude) */
var tipEl=document.createElement("div");tipEl.id="tip";document.body.appendChild(tipEl);
var tipTimer=null,tipSeq=0,tipCache={};
tipEl.addEventListener("mousedown",function(e){e.preventDefault()});
function hideTip(){tipEl.style.display="none";tipSeq++}
function selInfo(){
  var s=window.getSelection();if(!s||s.isCollapsed||!s.rangeCount)return null;
  var t=s.toString().replace(/\s+/g," ").trim();
  if(t.length<1||t.length>300)return null;
  var n=s.anchorNode,el=n&&(n.nodeType===1?n:n.parentElement);
  if(!el||el.closest("input,textarea,#tip")||!el.closest("main"))return null;
  return{t:t,r:s.getRangeAt(0).getBoundingClientRect()};
}
function showTip(info,txt){
  tipEl.innerHTML="<div class='src'>\ud83e\udd16 "+esc(info.t.length>40?info.t.slice(0,40)+"\u2026":info.t)+"</div>"+esc(txt);
  tipEl.style.display="block";
  var w=tipEl.offsetWidth,sx=window.scrollX,vw=document.documentElement.clientWidth;
  tipEl.style.left=Math.max(sx+8,Math.min(info.r.left+sx,sx+vw-w-8))+"px";
  tipEl.style.top=(info.r.bottom+window.scrollY+8)+"px";
}
function translateSel(){
  var info=selInfo();if(!info||!SAMPLE)return;
  var seq=++tipSeq;
  if(tipCache[info.t]){showTip(info,tipCache[info.t]);return}
  showTip(info,"\u0110ang d\u1ecbch...");
  var p="D\u1ecbch \u0111o\u1ea1n sau sang ti\u1ebfng Vi\u1ec7t k\u00e8m phi\u00ean \u00e2m. N\u1ebfu l\u00e0 ti\u1ebfng Nh\u1eadt: d\u00f2ng 1 l\u00e0 c\u00e1ch \u0111\u1ecdc hiragana, d\u00f2ng 2 l\u00e0 romaji, d\u00f2ng 3 l\u00e0 ngh\u0129a ti\u1ebfng Vi\u1ec7t ng\u1eafn g\u1ecdn (n\u1ebfu l\u00e0 t\u1eeb Kanji th\u00ec th\u00eam H\u00e1n Vi\u1ec7t). N\u1ebfu l\u00e0 ti\u1ebfng Anh: d\u00f2ng 1 l\u00e0 phi\u00ean \u00e2m IPA, d\u00f2ng 2 l\u00e0 ngh\u0129a ti\u1ebfng Vi\u1ec7t. Ch\u1ec9 tr\u1ea3 l\u1eddi n\u1ed9i dung, kh\u00f4ng gi\u1ea3i th\u00edch th\u00eam, kh\u00f4ng markdown. V\u0103n b\u1ea3n c\u00f3 th\u1ec3 c\u00f3 l\u1ed7i OCR nh\u1ecf.\n\u0110o\u1ea1n: "+info.t;
  SAMPLE(p,{onText:function(r){if(seq===tipSeq)showTip(info,r.text)}}).then(function(r){var x=(r&&r.text)||"";if(x)tipCache[info.t]=x;if(seq===tipSeq)showTip(info,x||"Kh\u00f4ng c\u00f3 k\u1ebft qu\u1ea3.")}).catch(function(e){if(seq===tipSeq)showTip(info,"Kh\u00f4ng d\u1ecbch \u0111\u01b0\u1ee3c"+(e&&e.code?" ("+e.code+")":"")+".")});
}
document.addEventListener("selectionchange",function(){
  clearTimeout(tipTimer);
  var s=window.getSelection();
  if(!s||s.isCollapsed)return;
  tipTimer=setTimeout(translateSel,600);
});
document.addEventListener("mousedown",function(e){if(!e.target.closest("#tip"))hideTip()});
document.addEventListener("touchstart",function(e){if(!e.target.closest("#tip"))hideTip()},{passive:true});
