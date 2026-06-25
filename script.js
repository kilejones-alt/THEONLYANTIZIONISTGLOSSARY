// TAG v184 clean consolidated behavior.
(function(){
  'use strict';
  var VERSION='186';
  var d=document;
  function $(s,root){return (root||d).querySelector(s)}
  function $$(s,root){return Array.prototype.slice.call((root||d).querySelectorAll(s))}
  function rand(min,max){return min+Math.random()*(max-min)}


  function initSparkles(){
    var old=$$('.sparkle-field');
    old.slice(1).forEach(function(el){el.remove();});
    var field=old[0] || d.createElement('div');
    field.className='sparkle-field';
    field.setAttribute('aria-hidden','true');
    field.innerHTML='';
    if(!field.parentNode) d.body.insertBefore(field,d.body.firstChild);
    var isHome=d.body.classList.contains('home');
    var count=isHome?50:10;
    for(var i=0;i<count;i++){
      var s=d.createElement('span');
      var depthRoll=Math.random();
      var depth=depthRoll<0.28?'sparkle-far':(depthRoll<0.66?'sparkle-mid':'sparkle-near');
      var kindRoll=Math.random();
      var kind=kindRoll<0.52?'sparkle-star':(kindRoll<0.78?'sparkle-glow':'sparkle-dust');
      var cls=depth+' '+kind;
      s.className='sparkle '+cls;
      var isStar=kind==='sparkle-star';
      var isGlow=kind==='sparkle-glow';
      var size;
      if(depth==='sparkle-near') size=isStar?rand(8,14):(isGlow?rand(7,12):rand(5,9));
      else if(depth==='sparkle-mid') size=isStar?rand(5,10):(isGlow?rand(5,9):rand(3.6,6.5));
      else size=isStar?rand(3.5,7):(isGlow?rand(3.2,6):rand(2.2,4.8));
      var top=isHome?rand(7,108):rand(78,148);
      s.style.setProperty('--x',rand(3,97).toFixed(2)+'vw');
      s.style.setProperty('--y',top.toFixed(2)+'vh');
      s.style.setProperty('--size',size.toFixed(2)+'px');
      s.style.setProperty('--dur',(isHome?rand(68,128):rand(54,96)).toFixed(2)+'s');
      s.style.setProperty('--delay',(-rand(0,160)).toFixed(2)+'s');
      s.style.setProperty('--sway',(Math.random()<.5?-1:1)*rand(10,54).toFixed(1)+'px');
      s.style.setProperty('--drift',(Math.random()<.5?-1:1)*rand(16,66).toFixed(1)+'px');
      var minOp=depth==='sparkle-far'?0.18:(depth==='sparkle-mid'?0.34:0.48);
      var maxOp=isStar?(depth==='sparkle-near'?0.98:0.82):(isGlow?(depth==='sparkle-near'?0.88:0.72):(depth==='sparkle-near'?0.72:0.58));
      s.style.setProperty('--op',rand(minOp,maxOp).toFixed(2));
      s.style.setProperty('--pulse',(isHome?rand(8,18):rand(7,14)).toFixed(2)+'s');
      s.style.setProperty('--glow-delay',(-rand(0,40)).toFixed(2)+'s');
      field.appendChild(s);
    }
  }

  function initEntryImages(){
    $$('.entry-image img').forEach(function(img){
      var src=(img.getAttribute('src')||'').split('?')[0].toLowerCase();
      if(src.endsWith('.png')){
        var fig=img.closest('.entry-image');
        if(fig) fig.classList.add('entry-card-image');
      }
    });
  }

  function initCursor(){
    if(!window.matchMedia || !window.matchMedia('(pointer:fine)').matches) return;
    var c=$('#gold-cursor');
    if(!c){c=d.createElement('div');c.id='gold-cursor';c.setAttribute('aria-hidden','true');c.innerHTML='<i></i>';d.body.appendChild(c)}
    var box=$('#cursor-sparks');
    if(!box){box=d.createElement('div');box.id='cursor-sparks';box.setAttribute('aria-hidden','true');d.body.appendChild(box)}
    var last=0;
    d.addEventListener('pointermove',function(e){
      c.classList.add('is-visible');
      c.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';
      var now=Date.now();
      if(now-last>34){last=now;var sp=d.createElement('span');sp.className='cursor-spark';sp.style.left=(e.clientX+rand(-4,4))+'px';sp.style.top=(e.clientY+rand(-4,4))+'px';sp.style.setProperty('--dx',rand(-18,18)+'px');sp.style.setProperty('--dy',rand(-20,10)+'px');box.appendChild(sp);setTimeout(function(){sp.remove()},850)}
    },{passive:true});
    d.addEventListener('mouseleave',function(){c.classList.remove('is-visible')});
  }

  function wrapLetters(el){
    if(!el || el.classList.contains('letterized') || el.closest('.no-letter-wrap')) return;
    var text=el.textContent;
    if(!text || text.trim().length<2 || text.length>90) return;
    el.textContent='';
    el.classList.add('letterized');
    Array.prototype.forEach.call(text,function(ch){
      if(ch===' '){el.appendChild(d.createTextNode(' '));return;}
      var span=d.createElement('span');span.className='az-letter';span.textContent=ch;el.appendChild(span);
    });
  }
  function initLetterHover(){
    var sels='.home-kicker,.home-subtitle,.home-author,.term-list a,.gallery-topbar a,.music-toggle,.entry-side h3,.entry-side a,.eyebrow,.resource-grid h2,.gallery-main h1,.gallery-main h2';
    $$(sels).forEach(wrapLetters);
  }

  function initSearch(){
    $$('[data-term-search]').forEach(function(input){
      input.addEventListener('input',function(){
        var q=input.value.trim().toLowerCase();
        $$('.term-list li').forEach(function(li){li.classList.toggle('hidden',q && li.textContent.toLowerCase().indexOf(q)===-1)});
        $$('.letter-block').forEach(function(block){
          var visible=$$('.term-list li:not(.hidden)',block).length>0;
          block.classList.toggle('hidden',q && !visible);
        });
      });
    });
  }

  function initMusic(){
    var btn=$('#music-toggle');
    var audio=new Audio('lumen-nocturne.mp3?v='+VERSION);
    audio.loop=true;audio.volume=.46;audio.preload='auto';
    var enabled=localStorage.getItem('tag-music-on')==='1';
    function setButton(on){if(btn){btn.setAttribute('aria-pressed',on?'true':'false');btn.title=on?'Music on':'Music off';}}
    function play(){audio.play().then(function(){enabled=true;localStorage.setItem('tag-music-on','1');setButton(true)}).catch(function(){setButton(false)});}
    function stop(){audio.pause();enabled=false;localStorage.setItem('tag-music-on','0');setButton(false)}
    if(btn){btn.addEventListener('click',function(e){e.preventDefault(); e.stopPropagation(); if(audio.paused) play(); else stop();});}
    setButton(enabled);
    if(enabled){var once=function(){play();d.removeEventListener('pointerdown',once,true)};d.addEventListener('pointerdown',once,true)}
    d.addEventListener('pointerdown',function(e){
      if(enabled || (btn && e.target===btn)) return;
      if(e.target.closest && e.target.closest('a,button,input,textarea,select')) return;
      play();
    },{once:true,capture:true});
  }

  function initReader(){
    if(!('speechSynthesis' in window)) return;
    $$('.az-reader-toggle').forEach(function(el){el.remove()});
    var btn=d.createElement('button');btn.type='button';btn.className='az-reader-toggle';btn.textContent='Reader';d.body.appendChild(btn);
    var nodes=[], idx=0, reading=false;
    function collect(){
      var selector='.entry-main p:not(.entry-label),.entry-main li,main.gallery-main p,main.gallery-main li,main:not(.gallery-main) p,main:not(.gallery-main) li';
      return $$(selector).filter(function(n){return !n.closest('nav,footer,figure,aside,.no-reader') && n.textContent.trim().length>20});
    }
    function clear(){nodes.forEach(function(n){n.classList.remove('is-reader-highlight')});}
    function stop(){speechSynthesis.cancel();reading=false;btn.classList.remove('is-reading');clear();}
    function speakNext(){
      clear();
      if(idx>=nodes.length){stop();return;}
      var n=nodes[idx++];
      var text=n.textContent.replace(/\s+/g,' ').trim();
      if(!text){speakNext();return;}
      n.classList.add('is-reader-highlight');
      try{n.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}
      var u=new SpeechSynthesisUtterance(text);
      u.rate=.92;u.pitch=.96;u.volume=1;
      var voices=speechSynthesis.getVoices()||[];
      var preferred=voices.find(function(v){return /Google US English|Microsoft Aria|Samantha|Daniel/i.test(v.name)}) || voices.find(function(v){return /^en/i.test(v.lang)});
      if(preferred) u.voice=preferred;
      u.onend=function(){ if(reading) speakNext(); };
      u.onerror=function(){ if(reading) speakNext(); };
      speechSynthesis.speak(u);
    }
    btn.addEventListener('click',function(){
      if(reading){stop();return;}
      nodes=collect();idx=0;if(!nodes.length) return;
      reading=true;btn.classList.add('is-reading');speechSynthesis.cancel();speakNext();
    });
    window.addEventListener('beforeunload',function(){speechSynthesis.cancel()});
  }

  document.addEventListener('DOMContentLoaded',function(){
    initEntryImages();
    initSparkles();
    initCursor();
    initLetterHover();
    initSearch();
    initMusic();
    initReader();
  });
})();
