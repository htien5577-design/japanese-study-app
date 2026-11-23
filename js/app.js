/* Điều hướng giữa các tab và khởi tạo ứng dụng */
function setMode(m){
  mode=m;
  var sec=(m==="swt"||m==="jpd")?"bank":m;
  ["table","flash","quiz","nums","bank"].forEach(function(s){$(s).classList.toggle("hide",s!==sec)});
  $("scripts").classList.toggle("hide",m==="nums"||sec==="bank");
  document.querySelectorAll("#modes button").forEach(function(b){b.classList.toggle("on",b.dataset.m===m)});
  if(sec==="bank")startBank(m);if(m==="table")renderTable();if(m==="flash")nextFlash();if(m==="quiz")nextQ();
}
document.querySelectorAll("#modes button").forEach(function(b){b.onclick=function(){setMode(b.dataset.m)}});
document.querySelectorAll("#scripts button").forEach(function(b){b.onclick=function(){
  script=b.dataset.s;
  document.querySelectorAll("#scripts button").forEach(function(x){x.classList.toggle("on",x===b)});
  setMode(mode);
}});
document.querySelectorAll("[data-q]").forEach(function(b){b.onclick=function(){
  qmode=b.dataset.q;
  document.querySelectorAll("[data-q]").forEach(function(x){x.classList.toggle("on",x===b)});
  $("qChoice").classList.toggle("hide",qmode!=="choice");
  $("qType").classList.toggle("hide",qmode!=="type");
  nextQ();
}});

renderNums();
renderTable();
