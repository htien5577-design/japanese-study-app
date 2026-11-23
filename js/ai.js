/* AI gợi ý (cần chạy trong Claude; ngoài Claude nút sẽ tự ẩn) */
var SAMPLE=null;
try{if(window.claude&&claude.use)claude.use("sample").then(function(s){SAMPLE=s;if(s&&!$("bank").classList.contains("hide")&&bk.view==="quiz")drawBank()}).catch(function(){})}catch(e){}
function askAI(){
  var q=bk.list[bk.i];if(!q||bk.done||!SAMPLE||bk.aiBusy)return;
  bk.clean=false;bk.aiBusy=true;bk.ai="Đang suy nghĩ...";drawBank();
  var opts=Object.keys(q.o).map(function(k){return k+". "+q.o[k]}).join("\n");
  var wr=bk.tried.length?"\nHọc sinh đã chọn sai: "+bk.tried.join(", ")+".":"";
  var p="Bạn là gia sư ôn thi môn "+(bk.m==="swt"?"kiểm thử phần mềm (SWT301)":"tiếng Nhật (JPD133)")+". Câu hỏi trắc nghiệm (có thể có lỗi chính tả nhỏ do OCR):\n"+q.q+"\n"+opts+"\nĐáp án đúng: "+q.a+" (chỉ để bạn biết)."+wr+"\nHãy gợi ý bằng tiếng Việt trong 2-4 câu để học sinh tự suy ra đáp án: nêu khái niệm liên quan hoặc mẹo loại trừ. TUYỆT ĐỐI không nói chữ cái đáp án đúng và không nhắc nguyên văn nội dung đáp án đúng.";
  SAMPLE(p,{onText:function(r){if(bk.list[bk.i]===q){bk.ai=r.text;drawBank()}}}).then(function(r){bk.aiBusy=false;if(bk.list[bk.i]===q){bk.ai=(r&&r.text)||bk.ai;drawBank()}}).catch(function(e){bk.aiBusy=false;if(bk.list[bk.i]===q){bk.ai="Không gọi được AI"+(e&&e.code?" ("+e.code+")":"")+". Bạn dùng nút Gợi ý thường nhé.";drawBank()}});
}
