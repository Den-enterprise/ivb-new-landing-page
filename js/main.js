// IVB V49 interactions. Bootstrap bundle is loaded before this file.

(() => {
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 $('#year').textContent = new Date().getFullYear();



 // Recruitment partner logo image list.
 // Add / remove entries here. Use transparent PNG, SVG, or WebP wordmark files.
 // Local examples: {name:'Your Partner',src:'assets/logos/your-partner.svg'}
 const partnerLogoImages = [
   {name:'Zomato',src:'https://cdn.simpleicons.org/zomato/E23744'},
   {name:'Swiggy',src:'https://www.google.com/s2/favicons?domain=swiggy.com&sz=128'},
   {name:'Razorpay',src:'https://cdn.simpleicons.org/razorpay/0C2451'},
   {name:'Microsoft',src:'https://cdn.simpleicons.org/microsoft/737373'},
   {name:'Google',src:'https://cdn.simpleicons.org/google/4285F4'},
   {name:'Amazon',src:'https://cdn.simpleicons.org/amazon/FF9900'},
   {name:'Adobe',src:'https://cdn.simpleicons.org/adobe/FF0000'},
   {name:'Notion',src:'https://cdn.simpleicons.org/notion/FFFFFF'},
   {name:'Canva',src:'https://cdn.simpleicons.org/canva/00C4CC'},
   {name:'Airbnb',src:'https://cdn.simpleicons.org/airbnb/FF5A5F'},
   {name:'Spotify',src:'https://cdn.simpleicons.org/spotify/1DB954'},
   {name:'LinkedIn',src:'https://cdn.simpleicons.org/linkedin/0A66C2'},
   {name:'Shopify',src:'https://cdn.simpleicons.org/shopify/7AB55C'},
   {name:'Atlassian',src:'https://cdn.simpleicons.org/atlassian/1868DB'},
   {name:'Figma',src:'https://cdn.simpleicons.org/figma/F24E1E'},
   {name:'Slack',src:'https://cdn.simpleicons.org/slack/36C5F0'},
   {name:'PayPal',src:'https://cdn.simpleicons.org/paypal/003087'},
   {name:'HubSpot',src:'https://cdn.simpleicons.org/hubspot/FF7A59'},
   {name:'Dropbox',src:'https://cdn.simpleicons.org/dropbox/0061FF'},
   {name:'Uber',src:'https://cdn.simpleicons.org/uber/FFFFFF'}
 ];
 const partnerRoot = document.getElementById('partnerColumns');
 if(partnerRoot && partnerLogoImages.length){
   const shuffle = items => {
     const copy = [...items];
     for(let i=copy.length-1;i>0;i--){
       const j=Math.floor(Math.random()*(i+1));
       [copy[i],copy[j]]=[copy[j],copy[i]];
     }
     return copy;
   };
   const laneCount = 8;
   const logosPerLane = Math.max(6,Math.ceil(partnerLogoImages.length/laneCount));
   for(let laneIndex=0;laneIndex<laneCount;laneIndex++){
     const lane=document.createElement('div');
     lane.className='logo-lane';
     const track=document.createElement('div');
     track.className='logo-lane-track';
     let selected=[];
     while(selected.length<logosPerLane) selected.push(...shuffle(partnerLogoImages));
     selected=selected.slice(0,logosPerLane);
     // Duplicate the lane's sequence so its vertical motion loops without a jump.
     [...selected,...selected].forEach(partner=>{
       const mark=document.createElement('div');
       mark.className='partner-logo';
       mark.setAttribute('aria-label',partner.name);
       const img=document.createElement('img');
       img.src=partner.src;
       img.alt=partner.name+' logo';
       img.loading='lazy';
       img.onerror=()=>{
         // Keep the mark subtle and text-like if a remote logo image fails.
         mark.innerHTML='';
         const fallback=document.createElement('span');
         fallback.textContent=partner.name;
         fallback.style.cssText='font:700 17px Manrope,sans-serif;color:rgba(200,235,230,.28);letter-spacing:-.04em';
         mark.appendChild(fallback);
       };
       mark.appendChild(img);
       track.appendChild(mark);
     });
     lane.appendChild(track);
     partnerRoot.appendChild(lane);
   }
 }


 // Scroll-pinned institute story. The scene holds after the hero; each layer
 // fades in at a different scroll interval, then the sticky stage releases.
 const instituteScene = document.querySelector('.intro-scroll-scene');
 const instituteStage = document.querySelector('.intro-stage');
 const instituteEyebrow = instituteStage?.querySelector('[data-scroll-reveal="eyebrow"]');
 const instituteHeadline = instituteStage?.querySelector('[data-scroll-reveal="headline"]');
 const instituteBody = instituteStage?.querySelector('[data-scroll-reveal="body"]');
 const instituteCohort = instituteStage?.querySelector('[data-scroll-reveal="cohort"]');
 let instituteTicking = false;

 const clamp01 = value => Math.min(1, Math.max(0, value));
 const smoothStep = (start, end, value) => {
   const t = clamp01((value - start) / (end - start));
   return t * t * (3 - 2 * t);
 };
 function updateInstituteStory(){
   if(!instituteScene || !instituteStage) return;
   const sceneRect = instituteScene.getBoundingClientRect();
   const travel = Math.max(1, instituteScene.offsetHeight - window.innerHeight);
   const progress = clamp01(-sceneRect.top / travel);

   // Text arrives in a sequence, with a short overlap so it feels connected.
   if(instituteEyebrow) instituteEyebrow.style.setProperty('--reveal', smoothStep(.015,.17,progress));
   if(instituteHeadline) instituteHeadline.style.setProperty('--reveal', smoothStep(.09,.34,progress));
   if(instituteBody) instituteBody.style.setProperty('--reveal', smoothStep(.27,.52,progress));

   // Student group rises into frame after the message has appeared.
   if(instituteCohort){
     const reveal = smoothStep(.43,.76,progress);
     instituteCohort.style.opacity = reveal.toFixed(3);
     instituteCohort.style.transform = `translate3d(0,${(1-reveal)*105}px,0) scale(${.94 + reveal*.06})`;
     instituteCohort.style.filter = `blur(${(1-reveal)*8}px)`;
   }
   const backdrop = instituteStage.querySelector('.intro-bg');
   if(backdrop){
     const zoom = 1.04 + progress*.045;
     backdrop.style.transform = `scale(${zoom})`;
   }
   instituteTicking = false;
 }
 function requestInstituteUpdate(){
   if(!instituteTicking){
     window.requestAnimationFrame(updateInstituteStory);
     instituteTicking = true;
   }
 }
 window.addEventListener('scroll', requestInstituteUpdate, {passive:true});
 window.addEventListener('resize', requestInstituteUpdate);
 updateInstituteStory();


 // Founder story: reveal the photo from top to bottom, then handwrite the quote
 // word-by-word as the visitor scrolls through the pinned panel.
 const founderScene = document.querySelector('.testimonial-scroll-scene');
 const founderStage = document.querySelector('.testimonial-stage');
 const founderPhoto = founderStage?.querySelector('.testimonial-photo img');
 const founderEyebrow = founderStage?.querySelector('.testimonial-copy .eyebrow');
 const founderWords = founderStage ? [...founderStage.querySelectorAll('.write-word')] : [];
 const founderSignoff = founderStage?.querySelector('.founder-signoff');
 let founderFramePending = false;
 const founderClamp = n => Math.min(1,Math.max(0,n));
 const founderEase = (a,b,x) => {
   const t=founderClamp((x-a)/(b-a));
   return t*t*(3-2*t);
 };
 function updateFounderStory(){
   if(!founderScene || !founderStage) return;
   const rect=founderScene.getBoundingClientRect();
   const range=Math.max(1,founderScene.offsetHeight-window.innerHeight);
   const p=founderClamp(-rect.top/range);

   const photoProgress=founderEase(.02,.43,p);
   if(founderPhoto){
     founderPhoto.style.clipPath=`inset(0 0 ${(1-photoProgress)*100}% 0)`;
     founderPhoto.style.opacity=(.25+photoProgress*.75).toFixed(3);
   }
   founderStage.classList.toggle('story-active',p>.08);
   const wordStart=.2, wordEnd=.82;
   founderWords.forEach((word,index)=>{
     const local=founderClamp((p-wordStart)/(wordEnd-wordStart)*founderWords.length-index);
     const reveal=founderEase(0,1,local);
     word.style.opacity=reveal.toFixed(3);
     word.style.transform=`translateY(${(1-reveal)*15}px) rotate(${(1-reveal)*-2}deg)`;
     word.style.filter=`blur(${(1-reveal)*3}px)`;
   });
   if(founderSignoff){
     const signoffProgress=founderEase(.78,.94,p);
     founderSignoff.style.opacity=signoffProgress.toFixed(3);
     founderSignoff.style.transform=`translateY(${(1-signoffProgress)*12}px)`;
   }
   founderFramePending=false;
 }
 function requestFounderStoryUpdate(){
   if(!founderFramePending){
     requestAnimationFrame(updateFounderStory);
     founderFramePending=true;
   }
 }
 window.addEventListener('scroll',requestFounderStoryUpdate,{passive:true});
 window.addEventListener('resize',requestFounderStoryUpdate);
 updateFounderStory();


 // Scroll-built Entrepreneurship scene: text arrives first, then the three
 // disciplines glide inward and form the central Entrepreneurship core.
 const superScene=document.querySelector('.super-scroll-scene');
 const superStage=document.querySelector('.super-stage');
 const superIntro=superStage?.querySelector('.super-intro');
 const superSubhead=superStage?.querySelector('.super-subhead');
 const superPoints=superStage?[...superStage.querySelectorAll('.super-feature')]:[];
 const superBubbles=superStage?[...superStage.querySelectorAll('.super-bubble')]:[];
 const superCore=superStage?.querySelector('.super-core');
 const superNote=superStage?.querySelector('.super-visual-note');
 const superConnectors=superStage?[...superStage.querySelectorAll('.super-connector')]:[];
 let superFramePending=false;
 const superClamp=n=>Math.min(1,Math.max(0,n));
 const superEase=(a,b,x)=>{const t=superClamp((x-a)/(b-a));return t*t*(3-2*t)};
 function updateSuperpowers(){
  if(!superScene||!superStage||window.matchMedia('(max-width:800px), (prefers-reduced-motion: reduce)').matches)return;
  const rect=superScene.getBoundingClientRect();
  const range=Math.max(1,superScene.offsetHeight-window.innerHeight);
  const p=superClamp(-rect.top/range);
  // Spread each reveal across a longer pinned scroll journey.
  // A single normal wheel/touch scroll should advance only one small stage.
  const introReveal=superEase(.035,.16,p),subReveal=superEase(.17,.29,p);
  if(superIntro){superIntro.style.opacity=introReveal.toFixed(3);superIntro.style.transform=`translateY(${(1-introReveal)*24}px)`;superIntro.style.filter=`blur(${(1-introReveal)*5}px)`}
  if(superSubhead){superSubhead.style.opacity=subReveal.toFixed(3);superSubhead.style.transform=`translateY(${(1-subReveal)*22}px)`;superSubhead.style.filter=`blur(${(1-subReveal)*5}px)`}
  superPoints.forEach((point,index)=>{const start=.30+index*.115;const r=superEase(start,start+.105,p);point.style.opacity=r.toFixed(3);point.style.transform=`translateX(${(1-r)*-22}px)`;point.style.filter=`blur(${(1-r)*4}px)`});
  const gather=superEase(.64,.94,p);
  const offsets=[{x:0,y:-125},{x:-140,y:75},{x:140,y:75}];
  superBubbles.forEach((bubble,index)=>{const o=offsets[index]||{x:0,y:0};const x=o.x*(1-gather),y=o.y*(1-gather),scale=.65+.35*gather;bubble.style.opacity=(.22+.78*gather).toFixed(3);bubble.style.transform=`translate3d(${x}px,${y}px,${(1-gather)*70}px) scale(${scale})`;bubble.style.filter=`blur(${(1-gather)*8}px)`});
  const coreReveal=superEase(.90,.995,p);
  if(superCore){superCore.style.opacity=coreReveal.toFixed(3);superCore.style.transform=`translate(-50%,-50%) scale(${.35+.65*coreReveal}) rotate(${(1-coreReveal)*-12}deg)`;superCore.style.filter=`blur(${(1-coreReveal)*8}px)`}
  const lineReveal=superEase(.72,.91,p);superConnectors.forEach(line=>line.style.opacity=(lineReveal*.7).toFixed(3));
  if(superNote)superNote.style.opacity=superEase(.96,1,p).toFixed(3);
  superStage.classList.toggle('super-complete',p>.96);superFramePending=false;
 }
 function requestSuperpowersUpdate(){if(!superFramePending){requestAnimationFrame(updateSuperpowers);superFramePending=true}}
 window.addEventListener('scroll',requestSuperpowersUpdate,{passive:true});
 window.addEventListener('resize',requestSuperpowersUpdate);
 updateSuperpowers();

 // Rocket reveal starts when each story block enters the viewport.
 const rocketObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     if(entry.isIntersecting){
       entry.target.classList.add('fired');
       rocketObserver.unobserve(entry.target);
     }
   });
 }, {threshold:.32});
 $$('.rocket-stage').forEach(stage => rocketObserver.observe(stage));

 // Scroll progress indicator.
 const progressBar = document.getElementById('scrollProgressBar');
 const updateProgress = () => {
   const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
   const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
   if(progressBar) progressBar.style.width = progress + '%';
 };
 window.addEventListener('scroll', updateProgress, {passive:true});
 updateProgress();

 // Mobile navigation
 $('#menuToggle').addEventListener('click', () => $('#navLinks').classList.toggle('open'));
 $$('#navLinks a').forEach(link => link.addEventListener('click', () => $('#navLinks').classList.remove('open')));

 // Reveal on entry
 const revealObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
   });
 }, {threshold:.1, rootMargin:'0px 0px -30px 0px'});
 $$('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));

 // Industry Leaders controls are wired by the V26 scroll showcase below.

 // Scroll-linked student cutout rise and co-founder photo parallax
 const cohort = $('.cohort');
 const parallaxPhoto = $('.parallax-photo img');
 let ticking = false;
 function updateScrollMotion(){
   const vh = window.innerHeight || 800;
   if(cohort){
     const rect = cohort.getBoundingClientRect();
     const progress = Math.min(1,Math.max(0,(vh - rect.top)/(vh*.95)));
     const y = 90 - progress*90;
     cohort.style.transform = `translateY(${y}px)`;
     cohort.style.opacity = String(.18 + progress*.82);
   }
   if(parallaxPhoto){
     const rect = parallaxPhoto.parentElement.getBoundingClientRect();
     const offset = (rect.top + rect.height/2 - vh/2) * -.075;
     parallaxPhoto.style.transform = `translateY(${offset}px) scale(1.12)`;
   }
   ticking = false;
 }
 window.addEventListener('scroll', () => {
   if(!ticking){window.requestAnimationFrame(updateScrollMotion);ticking=true;}
 }, {passive:true});
 updateScrollMotion();

 // Lazy-load local video assets. Add your own files to /assets using the names below.
 const videos = $$('.lazy-video');
 const videoObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
     const v = entry.target;
     if(entry.isIntersecting){
       if(!v.src && v.dataset.src) v.src = v.dataset.src;
       if(v.autoplay || v.closest('.video-tile')) v.play().catch(()=>{});
     } else if(v.closest('.video-tile')) {
       v.pause();
     }
   });
 }, {threshold:.15});
 videos.forEach(v => videoObserver.observe(v));

 // Tap a vibe tile to pause/play its own clip
 $$('.video-toggle').forEach(button => button.addEventListener('click', () => {
   const v = button.parentElement.querySelector('video');
   if(!v.src && v.dataset.src) v.src = v.dataset.src;
   if(v.paused){v.play().catch(()=>{});button.textContent='Ⅱ';}
   else{v.pause();button.textContent='▶';}
 }));

 // Pause ambient videos when tab is hidden; respect reduced-motion preference.
 document.addEventListener('visibilitychange', () => {
   if(document.hidden) videos.forEach(v => v.pause());
   else videos.forEach(v => { if(v.autoplay && v.dataset.src) v.play().catch(()=>{}); });
 });
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   videos.forEach(v => {v.autoplay=false;v.pause();});
 }
})();

/* ------------------------------------------------------------ */

(() => {
 const splash = document.getElementById('ivbSplash');
 const video = document.getElementById('ivbSplashVideo');
 if (!splash || !video) return;

 let finished = false;
 const finish = () => {
   if (finished) return;
   finished = true;
   splash.classList.add('is-leaving');
   document.body.classList.remove('ivb-splash-active');
   window.setTimeout(() => splash.remove(), 950);
 };

 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
   finish();
   return;
 }

 video.addEventListener('ended', finish, { once:true });
 video.addEventListener('error', finish, { once:true });
 video.play().catch(finish);
 window.setTimeout(finish, 12000);
})();

/* ------------------------------------------------------------ */

(() => {
 const section=document.querySelector('.audience-scroll');
 if(!section) return;
 const notes=[...section.querySelectorAll('.sticky-note')];
 const cursors=[...section.querySelectorAll('.drag-cursor')];
 const progressBar=section.querySelector('.audience-progress span');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const ease=t=>1-Math.pow(1-t,3);
 const starts=[
  {x:-210,y:155,r:-13,fromX:-180,fromY:-140,toX:0,toY:0},
  {x:0,y:205,r:11,fromX:0,fromY:-190,toX:0,toY:0},
  {x:210,y:155,r:14,fromX:180,fromY:-140,toX:0,toY:0}
 ];
 function render(){
  if(reduce){notes.forEach(n=>{n.style.opacity=1;n.style.transform='none'});return}
  const rect=section.getBoundingClientRect();
  const travel=Math.max(1,section.offsetHeight-window.innerHeight);
  const p=clamp(-rect.top/travel,0,1);
  const stage=section.querySelector('.sticky-note-stage');
  const sr=stage.getBoundingClientRect();
  const mobile=window.matchMedia('(max-width:640px)').matches;
  notes.forEach((note,i)=>{
   const s=starts[i];
   const start=.04+i*.235;
   const t=ease(clamp((p-start)/.23,0,1));
   const dx=mobile?0:s.x*(1-t);
   const dy=s.y*(1-t);
   const rot=s.r*(1-t);
   const scale=.94+.06*t;
   note.style.opacity=String(t);
   note.style.transform=`translate3d(${dx}px,${dy}px,0) rotate(${rot}deg) scale(${scale})`;
   const cursor=cursors[i];
   if(cursor){
    const show=clamp((p-(start-.015))/.16,0,1)*(1-clamp((p-(start+.20))/.06,0,1));
    const targetX=mobile?sr.width*.77:(i===0?sr.width*.28:i===1?sr.width*.61:sr.width*.91);
    const targetY=mobile?sr.height*(.18+i*.28):sr.height*.48;
    const fromX=mobile?sr.width*.98:(i===0?sr.width*.02:i===1?sr.width*.50:sr.width*.98);
    const fromY=mobile?sr.height*(.02+i*.26):sr.height*.88;
    const cx=fromX+(targetX-fromX)*t;
    const cy=fromY+(targetY-fromY)*t;
    cursor.style.left=cx+'px';cursor.style.top=cy+'px';
    cursor.style.transform=`translate(-5px,-8px) rotate(${(1-t)*(i===1?-18:12)}deg)`;
    cursor.style.opacity=String(show);
   }
  });
  if(progressBar) progressBar.style.transform=`scaleX(${p})`;
 }
 let ticking=false;
 const onScroll=()=>{if(!ticking){requestAnimationFrame(()=>{render();ticking=false});ticking=true}};
 window.addEventListener('scroll',onScroll,{passive:true});
 window.addEventListener('resize',render);
 render();
})();

/* ------------------------------------------------------------ */

(() => {
 const section = document.querySelector('.founders-scroll');
 if (!section) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const title = section.querySelector('.founders-backdrop-title');
 const intro = section.querySelector('.founders-intro');
 const profiles = [...section.querySelectorAll('.founder-profile')];
 const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
 const ease = t => 1 - Math.pow(1-t,3);
 let ticking = false;
 function updateFounders(){
  const rect = section.getBoundingClientRect();
  const travel = Math.max(1, section.offsetHeight - window.innerHeight);
  const p = clamp(-rect.top / travel, 0, 1);
  const portraitProgress = ease(clamp((p - .12) / .42, 0, 1));
  const detailProgress = ease(clamp((p - .48) / .30, 0, 1));
  section.style.setProperty('--founder-progress', p.toFixed(4));
  section.classList.toggle('is-active', p > .02);
  if (title){
   title.style.opacity = String(.15 + portraitProgress * .85);
   title.style.transform = `translate(-50%,-50%) scale(${.72 + portraitProgress*.42})`;
  }
  if (intro){
   intro.style.opacity = String(1 - clamp(p * 2.3, 0, 1));
   intro.style.transform = `translate(-50%,${-p*24}px)`;
  }
  profiles.forEach((profile, index) => {
   const direction = index === 0 ? -1 : 1;
   profile.style.opacity = String(portraitProgress);
   profile.style.transform = `translate3d(${direction*115*(1-portraitProgress)}%,${28*(1-portraitProgress)}px,0)`;
   const detail = profile.querySelector('.founder-detail');
   if (detail){
    detail.style.opacity = String(detailProgress);
    detail.style.transform = `translateY(${38*(1-detailProgress)}px)`;
   }
  });
  ticking = false;
 }
 function requestUpdate(){
  if (!ticking){ requestAnimationFrame(updateFounders); ticking = true; }
 }
 window.addEventListener('scroll', requestUpdate, {passive:true});
 window.addEventListener('resize', requestUpdate);
 updateFounders();
})();

/* ------------------------------------------------------------ */

(() => {
 const section = document.querySelector('.leaders-cinematic');
 const track = document.getElementById('leadersTrack');
 if (!section || !track) return;

 const industryLeaders = [
  {name:"Industry Leader 01",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 02",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 03",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 04",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 05",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 06",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 07",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 08",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 09",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 10",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 11",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 12",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 13",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 14",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 15",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 16",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 17",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 18",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"},
  {name:"Industry Leader 19",role:"Role / Designation",currentCompanyLogo:"assets/company-logo-placeholder.png",previousCompanyLogos:["assets/company-logo-placeholder.png","assets/company-logo-placeholder.png"],image:"assets/person.png"}
 ];

 const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
 }[char]));
 const cardMarkup = leader => `
  <article class="leader-profile-card">
   <img class="leader-profile-photo" src="${escapeHTML(leader.image || "assets/person.png")}" alt="" loading="lazy" onerror="this.style.display='none'">
   <div class="leader-profile-content">
    <h3 class="leader-profile-name">${escapeHTML(leader.name)}</h3>
    <p class="leader-profile-role">${escapeHTML(leader.role)}</p>
    <div class="leader-experience">
     <div class="leader-experience-block">
      <span class="leader-experience-label">Now</span>
      <div class="leader-company-logos">
       <img class="leader-company-logo" src="${escapeHTML(leader.currentCompanyLogo || "assets/company-logo-placeholder.png")}" alt="" onerror="this.style.display='none'">
      </div>
     </div>
     <div class="leader-experience-block">
      <span class="leader-experience-label">Previously</span>
      <div class="leader-previous-list">
       ${(leader.previousCompanyLogos || []).slice(0,3).map(logo => `<img class="leader-company-logo" src="${escapeHTML(logo)}" alt="" onerror="this.style.display='none'">`).join("")}
      </div>
     </div>
    </div>
   </div>
  </article>`;
 const originalMarkup = industryLeaders.map(cardMarkup).join("");
 const profileCount = industryLeaders.length;
 track.innerHTML = originalMarkup + originalMarkup + originalMarkup;

 const viewport = section.querySelector('.leaders-viewport');
 const progressFill = document.getElementById('leadersProgressFill');
 const count = document.getElementById('leadersCount');
 const arrows = [...section.querySelectorAll('[data-leaders-step]')];
 if (!viewport) return;

 let cycleWidth = 0;
 let position = 0;
 let targetPosition = 0;
 let lastFrame = 0;
 let lastInteraction = 0;
 let cardStep = 0;
 let dragging = false;
 let pointerStart = 0;
 let dragPosition = 0;
 const speed = 25;
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 function wrapPosition(){
  if (!cycleWidth) return;
  while (position >= cycleWidth * 2) { position -= cycleWidth; targetPosition -= cycleWidth; }
  while (position < cycleWidth * .5) { position += cycleWidth; targetPosition += cycleWidth; }
 }

 function measure(){
  const cards = [...track.querySelectorAll('.leader-profile-card')];
  if (cards.length < profileCount * 2) return;
  const first = cards[0];
  const nextSet = cards[profileCount];
  cycleWidth = nextSet.offsetLeft - first.offsetLeft;
  cardStep = cycleWidth / profileCount;
  const pad = Math.max(0, (viewport.clientWidth - first.offsetWidth) / 2);
  track.style.paddingLeft = `${pad}px`;
  track.style.paddingRight = `${pad}px`;
  position = cycleWidth;
  targetPosition = position;
  // Keep the first mentor centred in the viewport on load.
  render();
 }

 function render(){
  if (!cycleWidth) return;
  track.style.setProperty('transform', `translate3d(${-position}px,0,0)`, 'important');

  // Flat carousel: no card rotation, Z translation, perspective scaling or opacity fade.
  const center = viewport.clientWidth / 2;
  const cards = [...track.querySelectorAll('.leader-profile-card')];
  let nearestCard = null;
  let nearestDistance = Infinity;

  cards.forEach(card => {
   const x = card.offsetLeft - position + card.offsetWidth / 2;
   card.style.setProperty('transform', 'none', 'important');
   card.style.zIndex = '1';
   card.style.opacity = '1';

   const distance = Math.abs(x - center);
   if (distance < nearestDistance) {
    nearestDistance = distance;
    nearestCard = card;
   }
  });

  if (nearestCard && count) {
   const rawIndex = cards.indexOf(nearestCard) % profileCount;
   const active = rawIndex + 1;
   count.textContent = `${String(active).padStart(2,"0")} / ${String(profileCount).padStart(2,"0")}`;
   if (progressFill) progressFill.style.width = `${(active / profileCount) * 100}%`;
  }
 }
 function pauseAuto(){
  lastInteraction = performance.now();
 }

 function animate(now){
  if (!lastFrame) lastFrame = now;
  const dt = Math.min((now - lastFrame) / 1000, .05);
  lastFrame = now;

  if (!reducedMotion && !dragging && now - lastInteraction > 1600){
   targetPosition += speed * dt;
  }
  // Smoothly ease manual arrow movement; steady auto-motion remains fluid.
  position += (targetPosition - position) * Math.min(1, dt * 7);
  if (Math.abs(targetPosition - position) < .08) position = targetPosition;
  wrapPosition();
  render();
  requestAnimationFrame(animate);
 }

 arrows.forEach(button => button.addEventListener('click', () => {
  pauseAuto();
  targetPosition += Number(button.dataset.leadersStep) * cardStep * 2;
 }));
 viewport.addEventListener('pointerdown', event => {
  if (event.target.closest('button,a')) return;
  dragging = true;
  pointerStart = event.clientX;
  dragPosition = targetPosition;
  pauseAuto();
  viewport.classList.add('is-dragging');
  event.preventDefault();
 });
 window.addEventListener('pointermove', event => {
  if (!dragging) return;
  targetPosition = dragPosition - (event.clientX - pointerStart);
  position = targetPosition;
  wrapPosition();
  render();
 });
 const stopDrag = () => {
  if (!dragging) return;
  dragging = false;
  viewport.classList.remove('is-dragging');
  pauseAuto();
 };
 window.addEventListener('pointerup', stopDrag);
 window.addEventListener('pointercancel', stopDrag);
 viewport.addEventListener('wheel', event => {
  pauseAuto();
  targetPosition += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
 }, {passive:true});
 window.addEventListener('resize', measure);

 requestAnimationFrame(() => {
  measure();
  lastFrame = performance.now();
  requestAnimationFrame(animate);
 });
})();

/* ------------------------------------------------------------ */

/* Ecosystem partners — add logo paths and one-liners in this list. */
(() => {
 const partners = [
  {logo:"", alt:"Partner logo 01", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 02", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 03", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 04", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 05", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 06", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 07", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."},
  {logo:"", alt:"Partner logo 08", oneLiner:"Add this partner's one-line contribution to the IVB ecosystem."}
 ];
 const section=document.querySelector('.ecosystem-network');
 if(!section)return;
 // Distinct, replaceable SVG image assets are used until real partner logos arrive.
 const makeLogoPlaceholder=(index)=>{
  const palettes=[
   ['#0b8f89','#dff7f2'],['#147d83','#e5f5f2'],['#169e91','#e3f7f1'],['#286d79','#e7f3f3'],
   ['#168d9b','#e4f6f5'],['#0e766f','#e2f5ef'],['#269b91','#e7f8f4'],['#246f80','#e5f3f4']
  ];
  const [ink,paper]=palettes[index%palettes.length];
  const marks=[
   '<path d="M35 47V29h12v18M53 47V20h12v27M71 47V35h12v12" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linecap="round"/>',
   '<circle cx="60" cy="34" r="16" fill="none" stroke="'+ink+'" stroke-width="5"/><path d="M60 18v32M44 34h32" stroke="'+ink+'" stroke-width="3"/>',
   '<path d="M43 43 60 17l17 26H43Z" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linejoin="round"/><circle cx="60" cy="43" r="4" fill="'+ink+'"/>',
   '<rect x="42" y="18" width="36" height="32" rx="8" fill="none" stroke="'+ink+'" stroke-width="5"/><path d="m49 35 8 7 14-16" fill="none" stroke="'+ink+'" stroke-width="4" stroke-linecap="round"/>',
   '<path d="M42 43c0-19 36-19 36 0M42 26c0 19 36 19 36 0" fill="none" stroke="'+ink+'" stroke-width="5"/>',
   '<path d="M43 18h34v32H43z" fill="none" stroke="'+ink+'" stroke-width="5"/><path d="M51 26h18M51 34h18M51 42h11" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>',
   '<path d="m60 16 19 18-19 18-19-18 19-18Z" fill="none" stroke="'+ink+'" stroke-width="5"/><circle cx="60" cy="34" r="5" fill="'+ink+'"/>',
   '<path d="M42 43 53 23l9 13 7-9 9 16H42Z" fill="none" stroke="'+ink+'" stroke-width="4" stroke-linejoin="round"/>'
  ];
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="120" height="72" viewBox="0 0 120 72"><rect x="1" y="1" width="118" height="70" rx="12" fill="'+paper+'" stroke="'+ink+'" stroke-opacity=".28" stroke-dasharray="4 3"/>'+marks[index%marks.length]+'<text x="60" y="62" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" font-weight="700" letter-spacing="2" fill="'+ink+'" opacity=".7">YOUR LOGO</text></svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
 };
 const renderPartner=(partner)=>{
  const card=document.createElement('div');card.className='eco-partner';card.tabIndex=0;
  card.setAttribute('role','group');card.setAttribute('aria-label',partner.alt);
  const logo=document.createElement('div');logo.className='eco-logo-placeholder';
  const img=document.createElement('img');
  img.src=partner.logo || makeLogoPlaceholder(partners.indexOf(partner));
  img.alt=partner.alt+' placeholder';img.loading='lazy';
  logo.appendChild(img);
  const copy=document.createElement('div');copy.className='eco-hover-copy';copy.textContent=partner.oneLiner;
  card.append(logo,copy);return card;
 };
 partners.forEach((partner,index)=>{
  const target=document.getElementById(index<4?'ecoPartnersLeft':'ecoPartnersRight');
  if(target)target.appendChild(renderPartner(partner));
 });
 const paths=[...section.querySelectorAll('.eco-path')];
 const travelers=[...section.querySelectorAll('.eco-traveler')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){section.classList.add('phase-title','phase-logos','phase-lines');return;}
 let raf=0;
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 const update=()=>{
  raf=0;
  const rect=section.getBoundingClientRect();
  const scrollable=Math.max(1,section.offsetHeight-window.innerHeight);
  const progress=clamp(-rect.top/scrollable,0,1);
  section.classList.toggle('phase-title',progress>.035);
  section.classList.toggle('phase-logos',progress>.25);
  section.classList.toggle('phase-lines',progress>.48);
  const lineProgress=clamp((progress-.51)/.43,0,1);
  paths.forEach((path,index)=>{
   const length=path.getTotalLength();
   path.style.strokeDasharray=length;
   path.style.strokeDashoffset=length*(1-lineProgress);
   const dot=travelers[index];
   if(dot){
    const point=path.getPointAtLength(length*lineProgress);
    dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);
    dot.style.opacity=lineProgress>.015&&lineProgress<.995?'1':'0';
   }
  });
 };
 const requestUpdate=()=>{if(!raf)raf=requestAnimationFrame(update);};
 window.addEventListener('scroll',requestUpdate,{passive:true});
 window.addEventListener('resize',requestUpdate);
 update();
})();

/* ------------------------------------------------------------ */

/* V43 — scroll position drives the graduation title reveal and the card's 0°→180° flip. */
(() => {
 const scene=document.querySelector('.outcomes-scroll-scene');
 const card=document.getElementById('outcomesFlipCard');
 if(!scene||!card)return;
 const steps=[...scene.querySelectorAll('.outcomes-progress-step')];
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 let raf=0;
 const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
 const render=()=>{
  raf=0;
  const rect=scene.getBoundingClientRect();
  const travel=Math.max(1,scene.offsetHeight-window.innerHeight);
  const progress=clamp(-rect.top/travel);
  const cardReveal=clamp((progress-.17)/.25);
  const flipProgress=clamp((progress-.48)/.29);
  const flip=flipProgress*180;
  const glint=Math.pow(Math.sin(Math.PI*flipProgress),2);
  const close=clamp((progress-.83)/.1);
  scene.style.setProperty('--outcome-card-reveal',cardReveal.toFixed(4));
  scene.style.setProperty('--outcome-flip',flip.toFixed(3));
  scene.style.setProperty('--outcome-glint',glint.toFixed(3));
  scene.style.setProperty('--outcome-close',close.toFixed(3));
  const active=progress<.43?0:progress<.77?1:2;
  steps.forEach((step,i)=>step.classList.toggle('is-active',i===active));
  card.setAttribute('aria-label',flipProgress<.5?'Entrepreneurship outcome':'Employment outcome');
 };
 const request=()=>{if(!raf)raf=requestAnimationFrame(render);};
 window.addEventListener('scroll',request,{passive:true});
 window.addEventListener('resize',request);
 render();
})();

/* ------------------------------------------------------------ */

/* V45 Campus Explorer: interactive illustrative panorama prototype.
   Replace makePanorama() scene artwork with stitched 360° IVB panoramas for production. */
(() => {
 const modal=document.getElementById('campusTourModal');
 const viewer=document.getElementById('campusTourViewer');
 const panorama=document.getElementById('campusTourPanorama');
 const hotspots=document.getElementById('campusTourHotspots');
 if(!modal||!viewer||!panorama||!hotspots)return;
 const $=id=>document.getElementById(id);
 const scenes=[
  {id:'entrance',name:'Main entrance',label:'01 / MAIN ENTRANCE',caption:"Welcome to IVB. You're standing at the main entrance.",type:'entrance',next:'reception',
   stops:[{to:'reception',label:'Enter IVB',icon:'→',x:51,y:62}]},
  {id:'reception',name:'Reception',label:'02 / RECEPTION',caption:'You are inside. Take a left to discover the café, or continue deeper into campus.',type:'reception',next:'cafe',
   stops:[{to:'cafe',label:'Take a left · Café',icon:'↰',x:28,y:61},{to:'classroom',label:'Continue · Classrooms',icon:'→',x:76,y:57}]},
  {id:'cafe',name:'Campus café',label:'03 / CAMPUS CAFÉ',caption:'The campus café — a place to recharge, catch up and exchange ideas.',type:'cafe',next:'classroom',
   stops:[{to:'reception',label:'Back to reception',icon:'↶',x:78,y:59},{to:'common',label:'Common area',icon:'→',x:48,y:55}]},
  {id:'classroom',name:'Classroom',label:'04 / CLASSROOM',caption:'A space for learning, discussion and putting ideas into practice.',type:'classroom',next:'venture',
   stops:[{to:'reception',label:'Back to reception',icon:'↶',x:20,y:58},{to:'venture',label:'Venture lab',icon:'→',x:73,y:58}]},
  {id:'venture',name:'Venture lab',label:'05 / VENTURE LAB',caption:'Where teams work on ideas, test them and build their next venture.',type:'venture',next:'common',
   stops:[{to:'classroom',label:'Classroom',icon:'↶',x:24,y:59},{to:'common',label:'Common area',icon:'→',x:77,y:60}]},
  {id:'common',name:'Common area',label:'06 / COMMON AREA',caption:'A shared space to connect with the people building alongside you.',type:'common',next:'entrance',
   stops:[{to:'cafe',label:'Café',icon:'↶',x:22,y:60},{to:'entrance',label:'Return to entrance',icon:'↗',x:76,y:58}]}
 ];
 let current='entrance',yaw=50,dragging=false,lastX=0,startX=0,hasDragged=false;
 const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const photoScenes={
  entrance:"https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2600&h=1300&q=88",
  reception:"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2600&h=1300&q=88",
  cafe:"https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2600&h=1300&q=88",
  classroom:"https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2600&h=1300&q=88",
  venture:"https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2600&h=1300&q=88",
  common:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2600&h=1300&q=88"
 };
 function sceneImage(type){return `url("${photoScenes[type]||photoScenes.entrance}")`;}
 function setScene(id){
  const scene=scenes.find(s=>s.id===id);if(!scene)return;
  current=id;yaw=50;panorama.style.backgroundImage=sceneImage(scene.type);panorama.style.backgroundPosition='50% 50%';
  $('campusTourLocation').textContent=scene.label;$('campusTourFooterLocation').textContent=scene.name;$('campusTourCaption').textContent=scene.caption;
  hotspots.innerHTML=scene.stops.map(s=>`<button type="button" class="campus-tour-hotspot" data-go="${s.to}" style="left:${s.x}%;top:${s.y}%"><i>${s.icon}</i>${esc(s.label)}</button>`).join('');
  document.querySelectorAll('[data-tour-destination]').forEach(b=>b.classList.toggle('is-current',b.dataset.tourDestination===id));
  $('campusTourNext').innerHTML=`Next stop <span>→</span>`;
 }
 function moveTo(id){setScene(id);}
 function openTour(){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setScene('entrance');$('closeCampusTour').focus();}
 function closeTour(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';$('launchCampusTour').focus();}
 $('launchCampusTour').addEventListener('click',openTour);
 $('campusTourTeaser').addEventListener('click',openTour);
 $('campusTourTeaser').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openTour();}});
 $('closeCampusTour').addEventListener('click',closeTour);
 modal.addEventListener('click',e=>{if(e.target===modal)closeTour();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))closeTour();});
 hotspots.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)moveTo(b.dataset.go);});
 $('campusTourDestinations').addEventListener('click',e=>{const b=e.target.closest('[data-tour-destination]');if(b)moveTo(b.dataset.tourDestination);});
 $('campusTourNext').addEventListener('click',()=>{const scene=scenes.find(s=>s.id===current);if(scene)moveTo(scene.next);});
 function look(delta){yaw=(yaw+delta+100)%100;panorama.style.backgroundPosition=`${yaw}% 50%`;}
 $('campusLookLeft').addEventListener('click',()=>look(-10));
 $('campusLookRight').addEventListener('click',()=>look(10));
 viewer.addEventListener('pointerdown',e=>{dragging=true;hasDragged=false;lastX=e.clientX;startX=e.clientX;viewer.classList.add('is-dragging');viewer.setPointerCapture(e.pointerId);});
 viewer.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;if(Math.abs(e.clientX-startX)>5)hasDragged=true;lastX=e.clientX;look(-dx*.12);});
 const stopDrag=()=>{dragging=false;viewer.classList.remove('is-dragging');};
 viewer.addEventListener('pointerup',stopDrag);viewer.addEventListener('pointercancel',stopDrag);
 setScene('entrance');
})();

/* ------------------------------------------------------------ */

/* Scroll-scrubbed VibeWithIVB sequence: full-bleed photo changes + subtle flash cuts. */
(() => {
 const section=document.querySelector('.vibe-scroll');
 if(!section)return;
 const stage=section.querySelector('.vibe-stage');
 const bgA=document.getElementById('vibeBgA');
 const bgB=document.getElementById('vibeBgB');
 const flash=document.getElementById('vibeFlash');
 const caption=document.getElementById('vibeSceneCaption');
 const indexLabel=document.getElementById('vibeBottomIndex');
 const progress=document.getElementById('vibeProgressFill');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scenes=[
  {image:'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=2400&q=90',caption:'The moments that bring us together.',label:'01 / THE SOUND OF IVB'},
  {image:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2400&q=90',caption:'Turn the music up. Make the memories louder.',label:'02 / LIVE & LOUD'},
  {image:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=90',caption:'Different people. One unforgettable community.',label:'03 / BETTER TOGETHER'},
  {image:'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2400&q=90',caption:'Every celebration has a story.',label:'04 / THE CELEBRATIONS'},
  {image:'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=2400&q=90',caption:'The connections stay long after the night ends.',label:'05 / THE IVB PEOPLE'}
 ];
 let active=-1,front=bgA,back=bgB,raf=0;
 const preload=src=>{const im=new Image();im.src=src;};
 scenes.forEach(s=>preload(s.image));
 function showScene(i){
  if(i===active)return;
  active=i;const scene=scenes[i];
  back.style.backgroundImage=`url("${scene.image}")`;
  back.classList.add('is-active');front.classList.remove('is-active');
  const old=front;front=back;back=old;
  caption.textContent=scene.caption;indexLabel.textContent=scene.label;
  if(!reduce){flash.classList.remove('is-flashing');void flash.offsetWidth;flash.classList.add('is-flashing');}
 }
 function update(){
  raf=0;const rect=section.getBoundingClientRect(),travel=section.offsetHeight-window.innerHeight;
  const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,travel)));
  const idx=Math.min(scenes.length-1,Math.floor(p*scenes.length));
  showScene(idx);progress.style.width=(p*100)+'%';
  if(rect.top<window.innerHeight&&rect.bottom>0)stage.classList.add('vibe-in-view');
 }
 function onScroll(){if(!raf)raf=requestAnimationFrame(update);}
 window.addEventListener('scroll',onScroll,{passive:true});
 window.addEventListener('resize',onScroll);
 update();
})();

/* ------------------------------------------------------------ */

/* Three-panel IVB motto carousel: autoplay with manual dot controls. */
(() => {
 const root=document.querySelector('.ivb-motto-carousel');
 if(!root)return;
 const slides=[...root.querySelectorAll('[data-motto-slide]')];
 const dots=[...root.querySelectorAll('[data-motto-dot]')];
 if(!slides.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=0,timer=null;
 function show(index){
  active=(index+slides.length)%slides.length;
  slides.forEach((el,i)=>el.classList.toggle('is-active',i===active));
  dots.forEach((el,i)=>{el.classList.toggle('is-active',i===active);el.setAttribute('aria-pressed',String(i===active));});
 }
 function stop(){if(timer){clearInterval(timer);timer=null;}}
 function start(){if(reduced||timer)return;timer=setInterval(()=>show(active+1),3200);}
 dots.forEach((dot)=>dot.addEventListener('click',()=>{show(Number(dot.dataset.mottoDot));stop();start();}));
 root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
 root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 show(0);start();
})();
