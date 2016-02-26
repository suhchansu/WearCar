(function() {

var page = document.getElementById( "tabPage" ),
	changer = document.getElementById( "tabChanger" ),
	sectionChanger;

page.addEventListener( "pageshow", function() {
	// make SectionChanger object
	sectionChanger = new tau.SectionChanger(changer, {
		circular: true,
		orientation: "horizontal",
		scrollbar: "tab"
	});
});

page.addEventListener( "pagehide", function() {
	// release object
	sectionChanger.destroy();
});

var first = document.getElementById(m)


})();
