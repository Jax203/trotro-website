const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const phase = process.argv[2] || 'after';
const root = 'docs/accessibility';
const routes = ['/', '/parents','/schools','/safety','/about','/contact','/download','/privacy','/terms','/partner-preview','/audit-not-found'];
const widths = [320,375,390,768,1024,1440,1920];
const spacing = '* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}';
(async()=>{
 const browser=await chromium.launch();
 const context=await browser.newContext({reducedMotion:'reduce'});
 const output={phase,scans:[],states:[]};
 for(const width of widths){
  const page=await context.newPage();await page.setViewportSize({width,height:1000});
  for(const route of routes){
   await page.goto('http://127.0.0.1:3001'+route);await page.evaluate(()=>document.fonts.ready); await page.waitForFunction(()=>document.title.length>0);
   const metrics=await page.evaluate(()=>{
    const visible=el=>el.getClientRects().length&&!el.closest('[hidden],dialog:not([open])')&&getComputedStyle(el).visibility!=='hidden';
    const text=[...document.querySelectorAll('body *')].filter(el=>visible(el)&&!el.classList.contains('sr-only')&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
    return {overflow:document.documentElement.scrollWidth>innerWidth,smallText:text.filter(el=>parseFloat(getComputedStyle(el).fontSize)<14).map(el=>({tag:el.tagName,classes:el.className,size:getComputedStyle(el).fontSize,text:el.textContent.trim().slice(0,70)})),headings:[...document.querySelectorAll('h1,h2,h3,h4')].map(el=>({tag:el.tagName,text:el.textContent.trim()}))};
   });
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']).analyze();
   const style=await page.addStyleTag({content:spacing});
   const spaced=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...document.querySelectorAll('p,a,button,label,h1,h2,h3,span')].filter(el=>el.getClientRects().length&&getComputedStyle(el).overflow==='hidden'&&(el.scrollHeight>el.clientHeight+2||el.scrollWidth>el.clientWidth+2)&&!el.classList.contains('sr-only')).map(el=>({tag:el.tagName,class:el.className,text:el.textContent.slice(0,60)}))}));
   await style.evaluate(el=>el.remove());
   output.scans.push({route,width,...metrics,spaced,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:axe.incomplete.map(v=>({id:v.id,count:v.nodes.length}))});
   if([390,1440].includes(width)&&['/','/contact','/download'].includes(route)){
    await page.locator('img').evaluateAll(images=>Promise.all(images.map(async img=>{img.loading='eager';try{await img.decode()}catch{}})));
    await page.screenshot({path:`${root}/screenshots/${phase}-${route==='/'?'home':route.slice(1)}-${width}.png`,fullPage:true});
    if(route==='/')await page.locator('.site-footer').screenshot({path:`${root}/screenshots/${phase}-footer-${width}.png`});
   }
  }
  await page.close();console.log(`${phase}: ${width}px complete`);
 }
 fs.writeFileSync(`${root}/${phase}.json`,JSON.stringify(output,null,2));
 console.log(JSON.stringify({scans:output.scans.length,violations:output.scans.filter(s=>s.violations.length).map(s=>({route:s.route,width:s.width,ids:s.violations.map(v=>v.id)})),overflow:output.scans.filter(s=>s.overflow||s.spaced.overflow).map(s=>({route:s.route,width:s.width,normal:s.overflow,spacing:s.spaced.overflow}))}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
