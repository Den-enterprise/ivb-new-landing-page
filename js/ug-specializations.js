/* Scroll-driven page turns for the UG specialization book. */
(() => {
 const section=document.getElementById('ugSpecializations');
 const cover=document.getElementById('ugBookCover');
 const pages=[1,2,3].map(n=>document.getElementById('ugBookPage'+n));
 const back=document.getElementById('ugBookBackCover');
 const label=document.getElementById('ugBookScrollLabel');
 const count=document.getElementById('ugBookPageCount');
 if(!section||!cover||!back||pages.some(p=>!p)) return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const mobile=()=>window.matchMedia('(max-width:700px)').matches;
 let raf=0;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function render(){
  raf=0;
  if(mobile()||reduced){
   cover.style.transform='none';
   pages.forEach(p=>p.style.transform='none');
   back.style.transform='none';
   if(mobile()){
    [cover,...pages,back].forEach(page=>{page.style.opacity='';page.style.visibility='';});
    return;
   }
   const rect=section.getBoundingClientRect();
   const range=Math.max(1,section.offsetHeight-window.innerHeight);
   const step=clamp(-rect.top/range)*4;
   const current=Math.min(4,Math.max(0,Math.floor(step)));
   cover.style.opacity=current===0?'1':'0';
   cover.style.visibility=current===0?'visible':'hidden';
   pages.forEach((page,i)=>{
    const active=current===i+1;
    page.style.opacity=active?'1':'0';
    page.style.visibility=active?'visible':'hidden';
   });
   back.style.opacity=current===4?'1':'0';
   back.style.visibility=current===4?'visible':'hidden';
   if(label) label.textContent=current===0?'SCROLL TO OPEN THE BOOK':current===4?'CHAPTER COMPLETE':'SCROLL TO TURN THE PAGE';
   if(count) count.textContent=current===0?'COVER / 03':current===4?'END / IVB':`${String(current).padStart(2,'0')} / 03`;
   return;
  }
  const rect=section.getBoundingClientRect();
  const range=Math.max(1,section.offsetHeight-window.innerHeight);
  const progress=clamp(-rect.top/range);
  const step=progress*4;
  const turn=value=>clamp(value)*180;

  // Cover opens first. Each specialization leaf turns only when the next one is revealed.
  cover.style.transform=`rotateY(${-turn(step)}deg)`;
  cover.style.zIndex='10';
  pages.forEach((page,i)=>{
   page.style.transform=`rotateY(${-turn(step-(i+1))}deg)`;
   page.style.zIndex=String(9-i);
  });
  back.style.transform='none';
  back.style.zIndex='1';

  const current=Math.min(4,Math.max(0,Math.floor(step)));
  if(label) label.textContent=current===0?'SCROLL TO OPEN THE BOOK':current===4?'CHAPTER COMPLETE':'SCROLL TO TURN THE PAGE';
  if(count) count.textContent=current===0?'COVER / 03':current===4?'END / IVB':`${String(current).padStart(2,'0')} / 03`;
 }
 function onScroll(){if(!raf)raf=requestAnimationFrame(render);}
 window.addEventListener('scroll',onScroll,{passive:true});
 window.addEventListener('resize',onScroll);
 render();
})();

