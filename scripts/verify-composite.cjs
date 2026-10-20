const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
fs.mkdirSync('output/composite', {recursive:true});
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
for(const width of [360,390,1440]) {
const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
await page.addInitScript(()=>sessionStorage.setItem('seminfo-csp-promo-dismissed-v1','dismissed'));
await page.goto('http://127.0.0.1:5174');
await page.locator('.activity-row').waitFor();
assert.equal(await page.locator('.activity-row').count(),1);
assert.equal(await page.locator('.moment-preview li').count(),4);
assert.equal(await page.locator('.moment-preview-talk').count(),2);
await page.getByRole('link',{name:'Ver detalhes de Abertura Oficial — XXI SEMINFO 2026',exact:true}).click();
await page.locator('.moment-talk').first().waitFor();
assert.equal(await page.locator('.moment-talk').count(),2);
await page.getByRole('button',{name:'Palestra 2'}).click();
assert.equal(await page.evaluate(()=>document.activeElement.id),'momento-palestra-2');
assert.equal(await page.locator('.detail-speakers').count(),0);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:`output/composite/abertura-${width}.png`,fullPage:true});
await page.goto('http://127.0.0.1:5174/#/atividade/desafio-programacao');
await page.locator('.competition-schedule').waitFor();
assert.equal(await page.locator('.competition-schedule li').count(),4);
assert.equal(await page.locator('.moment-talk').count(),0);
assert.equal(await page.locator('.participation a[href*="docs.google.com"]').count(),1);
assert.ok((await page.locator('.competition-schedule').textContent()).includes('Auditório H'));
await page.goto('http://127.0.0.1:5174/#/programacao');
await page.getByRole('button', {name: /Quinta, 29 de outubro/}).click();
await page.locator('.moment-preview').waitFor();
assert.equal(await page.locator('.activity-row').count(),1);
assert.equal(await page.locator('.moment-preview li').count(),4);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.locator('.activity-row').scrollIntoViewIfNeeded();
await page.locator('.activity-row').screenshot({path:`output/composite/csp-preview-${width}.png`});
await page.close();
}
// Fixtures only in intercepted browser responses; published data stays untouched.
for(const width of [360,1440]) {
const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
await page.addInitScript(()=>sessionStorage.setItem('seminfo-csp-promo-dismissed-v1','dismissed'));
await page.route(/\/src\/data\.ts(?:\?.*)?$/,async route=>{
const response=await route.fetch();
let body=await response.text();
body+=`\nactivities[0].moments[1].title='Um título extenso de palestra sobre computação, pesquisa e os desafios da inteligência artificial na formação e no futuro do trabalho com experiências interdisciplinares'; activities[0].moments[1].description=('Descrição completa para avaliar a leitura de conteúdo longo e a preservação dos parágrafos. '.repeat(25))+'\\n\\nSegundo parágrafo integral.'; activities[0].moments[1].speakers=[{name:'Nome de palestrante extenso para verificar quebra de linha',affiliation:'Instituição de ensino e pesquisa',bio:'Biografia completa. '.repeat(30)},{name:'Outra pessoa convidada',bio:'Outra biografia'}]; activities[0].moments[1].start='14:00'; activities[0].moments[1].end='15:00'; activities.push({...activities[1],id:'simples-teste',type:'Palestra',title:'Atividade simples de teste',competitionSchedule:undefined,date:'2026-10-26'});`;
await route.fulfill({response,body});
});
await page.goto('http://127.0.0.1:5174');
await page.locator('.moment-preview').waitFor();
assert.equal(await page.locator('.activity-row').count(),2);
assert.equal(await page.locator('.moment-preview .moment-names').first().textContent(),'Nome de palestrante extenso para verificar quebra de linha · Outra pessoa convidada');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:`output/composite/preview-stress-${width}.png`,fullPage:true});
await page.goto('http://127.0.0.1:5174/#/atividade/abertura');
await page.locator('.moment-talk').first().waitFor();
assert.equal(await page.locator('.moment-description').first().locator('p').count(),2);
assert.equal(await page.locator('.moment-talk').first().locator('.moment-speakers li').count(),2);
await page.getByRole('button',{name:'Palestra 1'}).click();
assert.equal(await page.evaluate(()=>document.activeElement.id),'momento-palestra-1');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:`output/composite/details-stress-${width}.png`,fullPage:true});
await page.goto('http://127.0.0.1:5174/#/atividade/simples-teste');
await page.locator('.detail-speakers').waitFor();
assert.equal(await page.locator('.moment-talk,.competition-schedule').count(),0);
await page.close();
}
console.log('PASS: real opening + CSP at 360/390/1440; long titles, full descriptions, multiple speakers, internal navigation, simple activities at 360/1440.');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});




