sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,t){"use strict";return{createDeviceModel:function(){var n=new e(t);n.setDefaultBindingMode("OneWay");return n},createFLPModel:function(){var t=jQuery.sap.getObject("sap.ushell.Container.getUser"),n=t?t().isJamActive():false,r=new e({isShareInJamActive:n});r.setDefaultBindingMode("OneWay");return r},createFoerderbeichDataModel:function(){var t=new e([{key:"Z0416001",text:"Bildende Kunst, Künstlerische Fotografie…",items:[{key:"Z001",text:"Einzelausstellungen, ..."},{key:"Z002",text:"Mietzuschüsse für Ausstellungsräume"},{key:"Z003",text:"Gemeinschaftsprojekte"},{key:"Z004",text:"Workshops, Seminare, …"},{key:"Z005",text:"Interessensvertretung"}]},{key:"Z0416002",text:"Filmkultur",items:[{key:"Z006",text:"Filmvorführungen"},{key:"Z007",text:"Kommunikationsprojekte"},{key:"Z008",text:"Workshops, Seminare, …"},{key:"Z009",text:"Interessensvertretung"}]},{key:"Z0416003",text:"Infrastrukturförderung",items:[{key:"Z010",text:"Bauzuschüsse"},{key:"Z011",text:"Lärmschutzfonds"},{key:"Z012",text:"Technikförderung"},{key:"Z013",text:"Atelierausbau"}]},{key:"Z0416004",text:"Kulturelle Teilhabe",items:[{key:"Z014",text:"Veranstaltungen zum Thema Interkultur"},{key:"Z015",text:"Veranstaltungen zum Thema Diversity"},{key:"Z016",text:"Interessensvertretung"}]},{key:"Z0416005",text:"Literatur",items:[{key:"Z017",text:"Literaturveranstaltungen und Lesungen"},{key:"Z018",text:"Schullesungen"},{key:"Z019",text:"Interessensvertretung"}]},{key:"Z0416006",text:"Musik",items:[{key:"Z020",text:"Konzerte"},{key:"Z021",text:"Dokumentation"},{key:"Z022",text:"CD-Produktion"},{key:"Z023",text:"Gastspiel"},{key:"Z024",text:"Komposition"},{key:"Z025",text:"Interessensvertretung"}]},{key:"Z0416007",text:"Popkultur",items:[{key:"Z026",text:"Konzerte & DJ Gigs"},{key:"Z027",text:"Kommunikations-, Marketing-, und Netzwerkprojekte"},{key:"Z028",text:"Workshops & Seminare"},{key:"Z029",text:"Produktionen, Sonderprojekte"},{key:"Z030",text:"Internationale Gastspiele, Austauschprojekte…"},{key:"Z031",text:"Interessensvertretung"}]},{key:"Z0416008",text:"Tanz",items:[{key:"Z032",text:"Tanzproduktionen"},{key:"Z033",text:"Gastspiele"},{key:"Z034",text:"Abspiele / Wiederaufnahme"},{key:"Z035",text:"Interessensvertretung"}]},{key:"Z0416009",text:"Theater",items:[{key:"Z036",text:"Theaterproduktionen"},{key:"Z037",text:"Gastspiele"},{key:"Z038",text:"Abspiele / Wiederaufnahme"},{key:"Z039",text:"Interessensvertretung"}]},{key:"Z0416010",text:"Übergreifende Förderungen",items:[{key:"Z040",text:"Innovative Kleinveranstaltungen"},{key:"Z041",text:"Überregionale Antragsverfahren"}]}]);t.setDefaultBindingMode("OneWay");return t},createAnredeDataModel:function(){var t=new e([{key:"0001",text:"Frau"},{key:"0002",text:"Herr"},{key:"Z000",text:"Divers"}]);t.setDefaultBindingMode("OneWay");return t},createTitelDataModel:function(){var t=new e([{key:"010",text:"Dr."},{key:"050",text:"Prof."}]);t.setDefaultBindingMode("OneWay");return t}}});