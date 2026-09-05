/* Main application bootstrap and index.html page-shell/topbar integration. */

function initTopbar()
{
		if (!App)
		{
			if (l('httpsSwitch'))
			{
				Game.attachTooltip(l('httpsSwitch'),'<div style="padding:8px;width:350px;text-align:center;font-size:11px;">'+loc("You are currently playing Cookie Clicker on the <b>%1</b> protocol.<br>The <b>%2</b> version uses a different save slot than this one.<br>Click this lock to reload the page and switch to the <b>%2</b> version!",[(Game.https?'HTTPS':'HTTP'),(Game.https?'HTTP':'HTTPS')])+'</div>','this');
				AddEvent(l('httpsSwitch'),'click',function(){
					PlaySound('snd/pop'+Math.floor(Math.random()*3+1)+'.mp3',0.75);
					if (location.protocol=='https:') location.href='http:'+window.location.href.substring(window.location.protocol.length);
					else if (location.protocol=='http:') location.href='https:'+window.location.href.substring(window.location.protocol.length);
				});
			}
			
			if (l('changeLanguage'))
			{
				AddEvent(l('changeLanguage'),'click',function()
				{
					Game.showLangSelection();
				});
				l('changeLanguage').innerHTML=loc("Change language");
			}
			
			if (l('topbarOrteil')) Game.attachTooltip(l('topbarOrteil'),'<div style="padding:8px;width:250px;text-align:center;">Back to Orteil\'s subdomain!<br>Lots of other games in there!</div>'+tinyIcon([17,5],'display:block;margin:-12px auto;'),'this');
			if (l('topbarDashnet')) Game.attachTooltip(l('topbarDashnet'),'<div style="padding:8px;width:250px;text-align:center;">Back to our homepage!</div>','this');
			if (l('topbarTwitter')) Game.attachTooltip(l('topbarTwitter'),'<div style="padding:8px;width:250px;text-align:center;">Orteil\'s twitter, which frequently features game updates.</div>','this');
			if (l('topbarTumblr')) Game.attachTooltip(l('topbarTumblr'),'<div style="padding:8px;width:250px;text-align:center;">Orteil\'s tumblr, which frequently features game updates.</div>','this');
			if (l('topbarDiscord')) Game.attachTooltip(l('topbarDiscord'),'<div style="padding:8px;width:250px;text-align:center;">Our official discord server.<br>You can share tips and questions about Cookie Clicker and all our other games!</div>','this');
			if (l('topbarPatreon')) Game.attachTooltip(l('topbarPatreon'),'<div style="padding:8px;width:250px;text-align:center;">Support us on Patreon and help us keep updating Cookie Clicker!<br>There\'s neat rewards for patrons too!</div>','this');
			if (l('topbarMerch')) Game.attachTooltip(l('topbarMerch'),'<div style="padding:8px;width:250px;text-align:center;">Cookie Clicker shirts, hoodies and stickers!</div>','this');
			if (l('topbarMobileCC')) Game.attachTooltip(l('topbarMobileCC'),'<div style="padding:8px;width:250px;text-align:center;">Play Cookie Clicker on your phone!<br>(Android only; iOS version will be released later)</div>','this');
			if (l('topbarSteamCC')) Game.attachTooltip(l('topbarSteamCC'),'<div style="padding:8px;width:250px;text-align:center;">Get Cookie Clicker on Steam!<br>Featuring music by C418.</div>','this');
			if (l('topbarRandomgen')) Game.attachTooltip(l('topbarRandomgen'),'<div style="padding:8px;width:250px;text-align:center;">Check for updates!<br>{Current Version: 1.1.0}</div>','this');
			if (l('topbarIGM')) Game.attachTooltip(l('topbarIGM'),'<div style="padding:8px;width:250px;text-align:center;">Go and check out the creator of this downloadable version!<br>(Subscribe while your at it. :)</div>','this');
			
			if (l('links') && l('links').childNodes.length > 0)
			{
				l('links').childNodes[0].nodeValue=loc("Other versions");
			}
		}
};



(function () {
    var scripts = ['helpers.js','game.js','garden.js','market.js','pantheon.js','grimoire.js'];
    var loaded = 0;

    function loadNext() {
        if (loaded >= scripts.length) {
            startGame();
            return;
        }
        var script = document.createElement('script');
        script.src = scripts[loaded++];
        script.async = false;
        script.onload = loadNext;
        script.onerror = function () {
            console.error('Failed to load ' + script.src);
        };
        document.head.appendChild(script);
    }

    function startGame() {
        /*=====================================================================================
        LAUNCH THIS THING
        =======================================================================================*/
        
        var runInit = function()
        {
        	if (!Game.ready)
        	{
        		var loadLangAndLaunch=function(lang)
        		{
        			localStorageSet('CookieClickerLang',lang);
        			
        			LoadLang('loc/EN.js?v='+Game.version,function(lang){return function(){
        				locStringsFallback=locStrings;
        				LoadLang('loc/'+lang+'.js?v='+Game.version,function(){
        					var launch=function(){
        						Game.Launch();
        						initTopbar(); // <--- Added this to initialize the top bar elements once launched
        						if (top!=self) Game.ErrorFrame();
        						else
        						{
        							console.log('[=== '+choose([
        								'Oh, hello!',
        								'hey, how\'s it hangin',
        								'About to cheat in some cookies or just checking for bugs?',
        								'Remember : cheated cookies taste awful!',
        								'Hey, Orteil here. Cheated cookies taste awful... or do they?',
        							])+' ===]');
        							Game.Load();
        						}
        					}
        					if (App && App.loadMods) App.loadMods(launch);
        					else launch();
        				});
        			}}(lang));
        		}
        		
        		var showLangSelect=function(callback)
        		{
        			var str='';
        			for (var i in Langs)
        			{
        				var lang=Langs[i];
        				str+='<div class="langSelectButton title" id="langSelect-'+i+'">'+lang.name+'</div>';
        			}
        			l('offGameMessage').innerHTML=
        			'<div class="title" id="languageSelectHeader">Language</div>'+
        			'<div class="line" style="max-width:300px;"></div>'+
        			str;
        			for (var i in Langs)
        			{
        				var lang=Langs[i];
        				AddEvent(l('langSelect-'+i),'click',function(lang){return function(){callback(lang);};}(i));
        				AddEvent(l('langSelect-'+i),'mouseover',function(lang){return function(){l('languageSelectHeader').innerHTML=Langs[lang].changeLanguage;};}(i));
        			}
        		}
        		
        		var lang=localStorageGet('CookieClickerLang');
        		if (!lang) showLangSelect(loadLangAndLaunch);
        		else loadLangAndLaunch(lang);
        	}
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            runInit();
        } else {
            window.onload = runInit;
        }
    }

    loadNext();
}());
