/* UG admissions page interactions */

(() => {
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const story=document.getElementById('ugStory'),intro=document.getElementById('ugIntroStage'),video=document.getElementById('ugVideoStage'),cue=document.getElementById('ugScrollCueText'),youtube=document.getElementById('ugYoutube');let storyFrame=0,videoLoaded=false;
 const loadVideo=()=>{if(videoLoaded||!youtube)return;youtube.src=youtube.dataset.src;videoLoaded=true};
 const cardGrid=document.getElementById('ugCardGrid');
 if(cardGrid&&'IntersectionObserver' in window&&!reduceMotion){const cardsObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');cardsObserver.unobserve(entry.target)}}),{threshold:.2,rootMargin:'0px 0px -5% 0px'});cardsObserver.observe(cardGrid)}else if(cardGrid){cardGrid.classList.add('is-visible')}
  const roadmap=document.getElementById('ugRoadmap'),
        roadmapMap=document.getElementById('ugRoadmapMap'),
        roadPath=document.getElementById('ugRoadProgressPath'),
        roadPanels=[...document.querySelectorAll('[data-roadmap-panel]')],
        roadStops=[...document.querySelectorAll('[data-map-stop]')],
        mobileStops=[...document.querySelectorAll('[data-mobile-stop]')],
        roadFill=document.getElementById('ugRoadmapProgressFill'),
        roadLabel=document.getElementById('ugRoadmapProgressLabel');
  let roadmapFrame=0;
  if(roadmap&&roadmapMap&&roadPanels.length&&roadStops.length){
   const clamp=n=>Math.max(0,Math.min(1,n));
   const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
   const desktop=()=>window.innerWidth>900&&!reduceMotion;
   const mapSvg=roadmapMap.querySelector('.ug-road-svg');
   const total=roadPath&&roadPath.getTotalLength?roadPath.getTotalLength():1600;
   if(roadPath){roadPath.style.strokeDasharray=String(total);roadPath.style.strokeDashoffset=String(total);}
   const updateRoadmap=()=>{
    roadmapFrame=0;
    const rect=roadmap.getBoundingClientRect();
    const travel=Math.max(1,roadmap.offsetHeight-window.innerHeight);
    const progress=clamp(-rect.top/travel);
    if(!desktop()){
     roadmapMap.style.clipPath='none';roadmapMap.style.opacity='1';
     if(mapSvg)mapSvg.style.transform='none';
     if(roadPath)roadPath.style.strokeDashoffset='0';
     roadPanels.forEach(panel=>{panel.style.opacity='';panel.style.transform='';panel.classList.add('is-active');panel.setAttribute('aria-hidden','false');panel.inert=false;});
     roadStops.forEach((stop,index)=>{stop.classList.toggle('is-active',index===0);stop.classList.toggle('is-visited',false);});
     if(roadLabel)roadLabel.textContent='EXPLORE THE THREE YEARS';
     if(roadFill)roadFill.style.width='0%';
     return;
    }
    const opening=smooth(0,.15,progress);
    const closing=smooth(.91,1,progress);
    const visible=opening*(1-closing);
    roadmapMap.style.clipPath=`inset(0 ${(1-opening)*50+closing*50}% 0 ${(1-opening)*50+closing*50}% round 20px)`;
    roadmapMap.style.opacity=String(visible);

    // Scroll choreography: open -> zoom to each stop -> fade its information window -> travel onward.
    const phases=[
      {zoom:.15,show:.235,hide:.425,center:180},
      {zoom:.435,show:.515,hide:.705,center:500},
      {zoom:.715,show:.795,hide:.915,center:820}
    ];
    let active=0;
    if(progress>=.435)active=1;
    if(progress>=.715)active=2;
    const phase=phases[active];
    const zoomIn=smooth(phase.zoom,phase.show,progress);
    const zoomOut=smooth(phase.hide-.035,phase.hide+.055,progress);
    const zoom=1+zoomIn*.38-zoomOut*.38;
    const offset=[22,0,-22][active];
    if(mapSvg)mapSvg.style.transform=`translate3d(${offset}%,0,0) scale(${zoom})`;

    const routeProgress=clamp((progress-.15)/.70);
    if(roadPath)roadPath.style.strokeDashoffset=String(total*(1-routeProgress));
    roadPanels.forEach((panel,index)=>{
     const ph=phases[index];
     const alpha=smooth(ph.show,ph.show+.035,progress)*(1-smooth(ph.hide-.025,ph.hide+.025,progress));
     panel.classList.toggle('is-active',index===active&&alpha>.45);
     panel.setAttribute('aria-hidden',String(alpha<.45));
     panel.inert=alpha<.45;
     panel.style.opacity=String(alpha);
     panel.style.transform=`translate3d(0,${(1-alpha)*20}px,0) scale(${.985+alpha*.015})`;
    });
    [...roadStops,...mobileStops].forEach(stop=>{
     const index=Number(stop.dataset.mapStop??stop.dataset.mobileStop);
     stop.classList.toggle('is-active',index===active);
     stop.classList.toggle('is-visited',index<active);
    });
    if(roadFill)roadFill.style.width=`${progress*100}%`;
    if(roadLabel)roadLabel.textContent=progress<.15?'UNFOLDING THE MAP':progress<.235?'ZOOMING INTO YEAR 01':progress<.435?'YEAR 01 / LEARN':progress<.515?'TRAVELLING TO YEAR 02':progress<.715?'YEAR 02 / EXPERIENCE':progress<.795?'TRAVELLING TO YEAR 03':progress<.915?'YEAR 03 / BUILD':'FOLDING THE MAP CLOSED';
   };
   const onRoadmapScroll=()=>{if(!roadmapFrame)roadmapFrame=requestAnimationFrame(updateRoadmap)};
   window.addEventListener('scroll',onRoadmapScroll,{passive:true});
   window.addEventListener('resize',onRoadmapScroll);
   updateRoadmap();
  }
  const outcomes=document.getElementById('ugOutcomes'),outcomesViewport=document.getElementById('ugOutcomesViewport'),outcomesTrack=document.getElementById('ugOutcomesTrack'),outcomesCount=document.getElementById('ugOutcomesCount'),outcomesFill=document.getElementById('ugOutcomesProgressFill'),outcomesFinger=document.getElementById('ugOutcomesFinger'),outcomesWindowTop=document.querySelector('.ug-outcomes-window-top'),outcomesTabList=document.querySelector('.ug-outcomes-tabs'),outcomeTabs=[...document.querySelectorAll('[data-outcome-tab]')];let outcomeItems=[],outcomesFrame=0;
  const outcomeData=[
   {key:'entrepreneurship',number:'01',tab:'ENTREPRENEURSHIP',title:'Entrepreneurship',tagline:'Build your own destination.',motif:'MAKE IT REAL',points:['Continue with the business built at IVB.','Join a friend’s or alumni’s business.','Expand a family business or start an adjacent vertical.','Start a new business or join a venture studio.']},
   {key:'employment',number:'02',tab:'EMPLOYMENT',title:'Employment',tagline:'Take your entrepreneurial mindset into the industry.',motif:'TAKE IT FURTHER',points:['Access enhanced placement opportunities.','Apply business-building and operational skills.','Explore high-growth companies.']},
   {key:'higher-education',number:'03',tab:'HIGHER EDUCATION',title:'Higher Education',tagline:'Keep learning. Keep building.',motif:'KEEP EXPLORING',points:['Pursue higher education.','Deepen your expertise.','Explore further academic and professional opportunities.']}
  ];
  if(outcomes&&outcomesTrack){
   outcomesTrack.innerHTML=outcomeData.map((path,index)=>`<article class="ug-outcome ug-outcome--${path.key}${index===0?' is-active':''}" id="ugOutcomePanel${index}" role="tabpanel" aria-labelledby="ugOutcomeTab${index}" data-outcome-number="${path.number}" data-outcome-index="${index}" aria-hidden="${index!==0}"${index!==0?' inert':''}><div class="ug-outcome-copy"><div class="ug-outcome-topline"><span class="ug-outcome-kicker">PATHWAY ${path.number} / ${path.tab}</span><span class="ug-outcome-motif" aria-hidden="true">${path.motif}</span></div><h3>${path.title}</h3><p class="ug-outcome-tagline">${path.tagline}</p><ul class="ug-outcome-list">${path.points.map(point=>`<li>${point}</li>`).join('')}</ul></div></article>`).join('');
   outcomeItems=[...outcomesTrack.querySelectorAll('.ug-outcome')];
  }
  const activateOutcome=index=>{const safeIndex=Math.max(0,Math.min(outcomeData.length-1,index));outcomeTabs.forEach((tab,tabIndex)=>{const active=tabIndex===safeIndex;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});outcomeItems.forEach((item,itemIndex)=>{const active=itemIndex===safeIndex;item.classList.toggle('is-active',active);item.setAttribute('aria-hidden',String(!active));item.inert=!active;item.hidden=(innerWidth<=760||reduceMotion)&&!active});if(outcomesCount)outcomesCount.textContent=`0${safeIndex+1} — 0${outcomeData.length}`};
  const desktopOutcomes=()=>innerWidth>760&&!reduceMotion;
  const navigateOutcome=index=>{if(!desktopOutcomes()||!outcomes){activateOutcome(index);return}const sectionTop=window.scrollY+outcomes.getBoundingClientRect().top,travel=Math.max(1,outcomes.offsetHeight-innerHeight),stops=[0,.5,.94];window.scrollTo({top:sectionTop+travel*stops[index],behavior:'smooth'})};
  if(outcomes&&outcomesViewport&&outcomesTrack&&outcomeItems.length){
   outcomeTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>navigateOutcome(index));tab.addEventListener('keydown',event=>{let nextIndex=null;if(event.key==='ArrowRight')nextIndex=(index+1)%outcomeTabs.length;else if(event.key==='ArrowLeft')nextIndex=(index-1+outcomeTabs.length)%outcomeTabs.length;else if(event.key==='Home')nextIndex=0;else if(event.key==='End')nextIndex=outcomeTabs.length-1;if(nextIndex!==null){event.preventDefault();outcomeTabs[nextIndex].focus();navigateOutcome(nextIndex)}})});
   const updateOutcomes=()=>{outcomesFrame=0;if(!desktopOutcomes()){outcomes.classList.remove('ug-outcomes-enabled');document.body.classList.remove('ug-outcomes-ready');const selected=Math.max(0,outcomeTabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true'));activateOutcome(selected);if(outcomesFinger)outcomesFinger.hidden=true;return}outcomes.classList.add('ug-outcomes-enabled');document.body.classList.add('ug-outcomes-ready');if(outcomesFinger)outcomesFinger.hidden=false;outcomeItems.forEach(item=>item.hidden=false);const rect=outcomes.getBoundingClientRect(),travel=Math.max(1,outcomes.offsetHeight-innerHeight),progress=Math.max(0,Math.min(1,-rect.top/travel)),activeIndex=Math.min(outcomeData.length-1,Math.floor(progress*outcomeData.length));outcomes.style.setProperty('--outcomes-progress',String(progress));if(outcomesFill)outcomesFill.style.width=`${progress*100}%`;const currentIndex=outcomeTabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true');if(currentIndex!==activeIndex)activateOutcome(activeIndex);if(outcomesFinger&&outcomesViewport&&outcomesWindowTop&&outcomesTabList){const cursorTrackStart=outcomesWindowTop.offsetHeight+outcomesTabList.offsetHeight;outcomesFinger.style.top=`${cursorTrackStart+outcomesViewport.clientHeight*(.16+progress*.68)}px`}};
   const onOutcomesScroll=()=>{if(!outcomesFrame)outcomesFrame=requestAnimationFrame(updateOutcomes)};
   addEventListener('scroll',onOutcomesScroll,{passive:true});addEventListener('resize',onOutcomesScroll);updateOutcomes();
  }
 const placement=document.getElementById('ugPlacement'),placementWorld=document.getElementById('ugPlacementWorld'),placementFlight=document.getElementById('ugPlacementFlight'),placementHeading=document.getElementById('ugPlacementHeading'),placementCounts=[...document.querySelectorAll('.ug-placement-count')],placementSupport=document.querySelector('.ug-placement-support'),placementCta=document.querySelector('.ug-placement-cta'),placementProgress=document.querySelector('.ug-placement-progress i');
 const placementMarks=[
  {name:'Zomato',src:'https://cdn.simpleicons.org/zomato/E23744',x:5,y:19,dx:7,dy:16,depth:1650,speed:.054,scale:.72,offset:.04},
  {name:'Swiggy',src:'https://www.google.com/s2/favicons?domain=swiggy.com&sz=128',x:17,y:8,dx:9,dy:15,depth:1320,speed:.072,scale:.55,offset:.44},
  {name:'Razorpay',src:'https://cdn.simpleicons.org/razorpay/0C2451',x:4,y:38,dx:14,dy:-4,depth:1840,speed:.047,scale:.78,offset:.23},
  {name:'Microsoft',src:'https://cdn.simpleicons.org/microsoft/737373',x:8,y:59,dx:11,dy:-9,depth:1530,speed:.061,scale:.68,offset:.73},
  {name:'Google',src:'https://cdn.simpleicons.org/google/4285F4',x:25,y:11,dx:5,dy:12,depth:1960,speed:.043,scale:.66,offset:.36},
  {name:'Amazon',src:'https://cdn.simpleicons.org/amazon/FF9900',x:40,y:6,dx:8,dy:8,depth:1420,speed:.068,scale:.84,offset:.81},
  {name:'Adobe',src:'https://cdn.simpleicons.org/adobe/FF0000',x:65,y:7,dx:-7,dy:12,depth:1770,speed:.05,scale:.62,offset:.17},
  {name:'Notion',src:'https://cdn.simpleicons.org/notion/000000',x:82,y:16,dx:-10,dy:8,depth:1280,speed:.075,scale:.72,offset:.58},
  {name:'Canva',src:'https://cdn.simpleicons.org/canva/00C4CC',x:95,y:38,dx:-13,dy:-4,depth:1880,speed:.046,scale:.58,offset:.91},
  {name:'Airbnb',src:'https://cdn.simpleicons.org/airbnb/FF5A5F',x:82,y:62,dx:-8,dy:-10,depth:1490,speed:.063,scale:.86,offset:.29},
  {name:'Spotify',src:'https://cdn.simpleicons.org/spotify/1DB954',x:92,y:82,dx:-10,dy:-14,depth:1720,speed:.052,scale:.63,offset:.67},
  {name:'LinkedIn',src:'https://cdn.simpleicons.org/linkedin/0A66C2',x:72,y:94,dx:-7,dy:-15,depth:1370,speed:.071,scale:.75,offset:.12},
  {name:'Shopify',src:'https://cdn.simpleicons.org/shopify/7AB55C',x:49,y:96,dx:4,dy:-15,depth:1940,speed:.044,scale:.67,offset:.52},
  {name:'Atlassian',src:'https://cdn.simpleicons.org/atlassian/1868DB',x:29,y:92,dx:-8,dy:-15,depth:1580,speed:.059,scale:.82,offset:.32},
  {name:'Figma',src:'https://cdn.simpleicons.org/figma/F24E1E',x:9,y:81,dx:9,dy:-12,depth:1210,speed:.079,scale:.6,offset:.86},
  {name:'Slack',src:'https://cdn.simpleicons.org/slack/36C5F0',x:2,y:68,dx:12,dy:0,depth:1810,speed:.048,scale:.76,offset:.61},
  {name:'PayPal',src:'https://cdn.simpleicons.org/paypal/003087',x:20,y:86,dx:9,dy:-12,depth:1460,speed:.066,scale:.7,offset:.09},
  {name:'HubSpot',src:'https://cdn.simpleicons.org/hubspot/FF7A59',x:77,y:84,dx:-9,dy:-12,depth:1990,speed:.042,scale:.88,offset:.47},
  {name:'Dropbox',src:'https://cdn.simpleicons.org/dropbox/0061FF',x:97,y:60,dx:-14,dy:0,depth:1610,speed:.057,scale:.57,offset:.77},
  {name:'Uber',src:'https://cdn.simpleicons.org/uber/111111',x:57,y:6,dx:-6,dy:10,depth:1340,speed:.073,scale:.8,offset:.26}
 ];
 if(placement&&placementWorld&&placementFlight&&placementHeading){
  const clamp01=value=>Math.max(0,Math.min(1,value));
  const activeMarks=innerWidth<=600?placementMarks.filter((_,index)=>index%2===0):placementMarks;
  activeMarks.forEach(mark=>{const item=document.createElement('span');item.className='ug-placement-logo';item.setAttribute('role','img');item.setAttribute('aria-label',`${mark.name} logo`);const image=document.createElement('img');image.src=mark.src;image.alt='';image.loading='lazy';image.decoding='async';image.onerror=()=>item.remove();item.appendChild(image);placementFlight.appendChild(item);mark.element=item});
  let scrollFrame=0,flightFrame=0,scrollProgress=0,sectionActive=false,lastTime=0,elapsed=0;
  const renderFlight=now=>{flightFrame=0;if(!sectionActive||reduceMotion||scrollProgress<.19||scrollProgress>.96)return;if(lastTime)elapsed+=Math.min(48,now-lastTime);lastTime=now;const bounds=placementWorld.getBoundingClientRect(),width=bounds.width,height=bounds.height;activeMarks.forEach(mark=>{const phase=(mark.offset+elapsed/1000*mark.speed+scrollProgress*.42)%1,z=-mark.depth+phase*(mark.depth+340),x=(mark.x/100+Math.sin(phase*Math.PI*.72)*mark.dx/100)*width-mark.element.offsetWidth/2,y=(mark.y/100+Math.sin(phase*Math.PI*.82)*mark.dy/100)*height-mark.element.offsetHeight/2,depthFade=clamp01(phase/.1),exitFade=clamp01((.96-phase)/.16),opacity=Math.min(depthFade,exitFade)*(.18+phase*.62),scale=mark.scale*(.48+phase*1.05);mark.element.style.opacity=String(opacity);mark.element.style.transform=`translate3d(${x}px,${y}px,${z}px) scale(${scale})`});flightFrame=requestAnimationFrame(renderFlight)};
  const updatePlacement=()=>{scrollFrame=0;const bounds=placement.getBoundingClientRect();sectionActive=bounds.bottom>0&&bounds.top<innerHeight;scrollProgress=clamp01(-bounds.top/Math.max(1,placement.offsetHeight-innerHeight));const reveal=reduceMotion?1:clamp01((scrollProgress-.055)/.16),supportReveal=reduceMotion?1:clamp01((scrollProgress-.21)/.12),ctaReveal=reduceMotion?1:clamp01((scrollProgress-.32)/.12);placementHeading.style.opacity=reveal;placementHeading.style.transform=`translate(-50%,-50%) scale(${.94+.06*reveal})`;placementCounts.forEach(count=>{count.textContent=String(Math.round(reveal*100));count.style.transform=`scale(${.94+.06*reveal})`});if(placementSupport)placementSupport.style.opacity=supportReveal;if(placementCta){placementCta.style.opacity=ctaReveal;placementCta.inert=!reduceMotion&&ctaReveal<.9}if(placementProgress)placementProgress.style.setProperty('--placement-progress',`${Math.round(scrollProgress*100)}%`);if(sectionActive&&!reduceMotion&&scrollProgress>=.19&&scrollProgress<=.96){if(!flightFrame)flightFrame=requestAnimationFrame(renderFlight)}else{if(flightFrame)cancelAnimationFrame(flightFrame);flightFrame=0;lastTime=0;if(reduceMotion){activeMarks.forEach(mark=>{mark.element.style.left=`${mark.x}%`;mark.element.style.top=`${mark.y}%`;mark.element.style.opacity='.28';mark.element.style.transform='translate(-50%,-50%)'})}else activeMarks.forEach(mark=>{mark.element.style.opacity='0'})}};
  const onPlacementScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updatePlacement)};
  addEventListener('scroll',onPlacementScroll,{passive:true});addEventListener('resize',onPlacementScroll);
  if('IntersectionObserver'in window){const placementObserver=new IntersectionObserver(entries=>{sectionActive=entries[0].isIntersecting;onPlacementScroll()},{threshold:0});placementObserver.observe(placement)}else sectionActive=true;
  updatePlacement();
 }
 if(story&&intro&&video&&!reduceMotion){
  const clamp=value=>Math.max(0,Math.min(1,value));
  const updateStory=()=>{storyFrame=0;const rect=story.getBoundingClientRect(),travel=Math.max(1,story.offsetHeight-innerHeight),progress=clamp(-rect.top/travel);const introOut=clamp((progress-.22)/.28),videoIn=clamp((progress-.34)/.48);intro.style.opacity=String(1-introOut);intro.style.transform=`translate3d(0,${-42*introOut}px,0) scale(${1-.055*introOut})`;intro.style.pointerEvents=introOut>.35?'none':'auto';video.style.opacity=String(videoIn);video.style.transform=`translate(-50%,-50%) perspective(1400px) rotateX(${(1-videoIn)*25}deg) rotateY(${(1-videoIn)*-18}deg) translateY(${(1-videoIn)*72}px) scale(${.78+.22*videoIn})`;video.style.pointerEvents=videoIn>.14?'auto':'none';video.inert=videoIn<=.14;video.setAttribute('aria-hidden',videoIn>.14?'false':'true');if(videoIn>.04)loadVideo();if(cue)cue.textContent=progress<.42?'Scroll to reveal the IVB story':'Keep scrolling to explore'};
  const onStoryScroll=()=>{if(!storyFrame)storyFrame=requestAnimationFrame(updateStory)};
  addEventListener('scroll',onStoryScroll,{passive:true});addEventListener('resize',onStoryScroll);updateStory();
 }else if(video){
  video.inert=false;video.setAttribute('aria-hidden','false');video.style.pointerEvents='auto';loadVideo();
 }
})();

(() => {
  const section = document.getElementById('ugImpactPlayer');
  if (!section) return;
  const signatureImage = section.querySelector('[data-signature-fallback]');
  if (signatureImage) {
    const revealSignatureFallback = () => {
      const fallback = signatureImage.nextElementSibling;
      signatureImage.remove();
      if (fallback) fallback.hidden = false;
    };
    signatureImage.addEventListener('error', revealSignatureFallback, { once: true });
    if (signatureImage.complete && signatureImage.naturalWidth === 0) revealSignatureFallback();
  }
  const stage = section.querySelector('.ug-impact-stage');
  const intro = document.getElementById('ugImpactIntro');
  const portrait = document.getElementById('ugImpactPortrait');
  const quote = document.getElementById('ugImpactQuote');
  const signature = document.getElementById('ugImpactSignature');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  const clamp = n => Math.max(0, Math.min(1, n));
  const render = () => {
    raf = 0;
    if (window.innerWidth <= 650) return;
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / travel);
    section.style.setProperty('--impact-progress', p.toFixed(4));

    // Lights build first; the title then yields to the full player-and-quote composition.
    const lights = clamp(p / .19);
    const titleIn = clamp(p / .12);
    const titleOut = clamp((p - .20) / .13);
    const portraitIn = clamp((p - .13) / .27);
    const quoteIn = clamp((p - .34) / .24);
    const signatureIn = clamp((p - .62) / .16);

    stage.style.setProperty('--impact-progress', lights.toFixed(4));
    intro.style.setProperty('--impact-title-in', titleIn.toFixed(3));
    intro.style.setProperty('--impact-title-opacity', String(1 - titleOut));
    portrait.style.setProperty('--impact-portrait-opacity', portraitIn.toFixed(3));
    portrait.style.setProperty('--impact-portrait-x', `${reduced ? 0 : (1 - portraitIn) * 150}px`);
    portrait.style.setProperty('--impact-portrait-y', `${reduced ? 0 : (1 - portraitIn) * 36}px`);
    portrait.style.setProperty('--impact-portrait-scale', (reduced ? 1 : .88 + portraitIn * .12).toFixed(3));
    quote.style.setProperty('--impact-quote-opacity', quoteIn.toFixed(3));
    quote.style.setProperty('--impact-quote-x', `${reduced ? 0 : (1 - quoteIn) * -78}px`);
    signature.style.setProperty('--impact-signature-opacity', signatureIn.toFixed(3));
    signature.style.setProperty('--impact-signature-y', `${(1 - signatureIn) * 20}px`);
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render();
})();
