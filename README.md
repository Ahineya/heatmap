##D3.js heatmap calendar widget

#####Demo
[http://evsegneev.pp.ua/heatmap](http://evsegneev.pp.ua/heatmap/) 

#####Remarks:

Tested in last Chrome, Firefox and IE.

I have used jpicker (first I found in google), not input[type=color], because I want my widget works in IE. But sometimes it position is not correct. Reload page if it not fits the controls panel.

Widget content does not updates via d3.js data but simply redraws. It is simpler, it doesn't need another update function. It doesn't took much time and not even noticeable. And I have stuck at that :)

There are mocha+chai test that you can run via npm test.
If you have mocha-phantomjs installed globally.
He-he.
If not, you can see it result via web runner:
[http://evsegneev.pp.ua/heatmap/test/test.html](http://evsegneev.pp.ua/heatmap/test/test.html) 

I really like my top panel with that pretty buttons. So I haven't add more controls
to change widget's cell size etc.

P.s. if you can tell me, why in heatmap.js:322 variable d has old data - please, mail me to pavel@evsegneev.com
