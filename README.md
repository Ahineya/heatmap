##D3.js heatmap calendar widget

#####Remarks:
I have used jpicker (first I found in google), not input[type=color], because I want my widget works on IE.

Widget content does not updates via d3.js data but simply redraws. It is simpler, it doesn't need another update function. It doesn't took much time and not even noticeable. And I have stuck at that :)

There are mocha+chai test that you can run via npm test.
If you have mocha-phantomjs installed globally.
He-he.

I really like my top panel with that pretty buttons. So I haven't add more controls
to change widget's cell size etc.

P.s. if you can tell me, why in heatmap.js:322 variable d has old data - please, mail me on pavel@evsegneev.com

[http://evsegneev.pp.ua/heatmap](http://evsegneev.pp.ua/heatmap/) 
