var corpuschristitex=corpuschristitex||{};!function(a,b,c,d,e){"use strict";corpuschristitex.categoryResultsForm={elem:{$startDate:a("#from"),$endDate:a("#to"),$today:a(".today"),$weekend:a(".weekend"),$filterBtn:a("#filter-results-btn")},init:function(){a.fn.datepicker&&a(".date").datepicker({dateFormat:"mm/dd/yy",onSelect:function(c,d){b.input.placeholder||a(this).css("color","#000"),""!==c&&a(this).trigger("change")}}),this.elem.$today.on("click",function(a){var b=corpuschristitex.categoryResultsForm;b.setDate(),a.preventDefault()}),this.elem.$weekend.on("click",function(a){var b=corpuschristitex.categoryResultsForm;b.setWeekend(),a.preventDefault()}),this.elem.$filterBtn.on("click",function(b){return a("#category-results-form form").slideToggle(),!1})},date:{month:function(){var a=(new Date).getMonth()+1;return a=10>a?a="0"+a:a}(),day:function(){var a=(new Date).getDate();return a=10>a?a="0"+a:a}(),year:(new Date).getFullYear()},weekend:{friday:function(){var a,b,c,d;return Date.today().is().friday()?(b=Date.today().getMonth()+1,c=Date.today().getDate(),d=Date.today().getFullYear()):Date.today().is().saturday()||Date.today().is().sunday()?(a=Date.last().friday(),b=a.getMonth()+1,c=a.getDate(),d=a.getFullYear()):(b=Date.friday().getMonth()+1,c=Date.friday().getDate(),d=Date.friday().getFullYear()),b=10>b?b="0"+b:b,c=10>c?c="0"+c:c,a=b+"/"+c+"/"+d}(),sunday:function(){var a,b,c,d;return Date.today().is().sunday()?(b=Date.today().getMonth()+1,c=Date.today().getDate(),d=Date.today().getFullYear()):(b=Date.today().next().sunday().getMonth()+1,c=Date.today().next().sunday().getDate(),d=Date.today().next().sunday().getFullYear()),b=10>b?b="0"+b:b,c=10>c?c="0"+c:c,a=b+"/"+c+"/"+d}()},setDate:function(){var a=this.date.month+"/"+this.date.day+"/"+this.date.year;this.elem.$startDate.val(a),this.elem.$endDate.val(a),this.elem.$startDate.trigger("change"),this.elem.$endDate.trigger("change"),b.input.placeholder||(this.elem.$startDate.css("color","#000"),this.elem.$endDate.css("color","#000"))},setWeekend:function(){this.elem.$startDate.val(this.weekend.friday),this.elem.$endDate.val(this.weekend.sunday),this.elem.$startDate.trigger("change"),this.elem.$endDate.trigger("change"),b.input.placeholder||(this.elem.$startDate.css("color","#000"),this.elem.$endDate.css("color","#000"))}}}(window.jQuery,window.Modernizr,window,window.document);var corpuschristitex=corpuschristitex||{};!function(a,b,c,d,e){"use strict";corpuschristitex.categoryResultsMap={$elem:{},initialized:!1,longitude:-97.396378,latitude:27.800583,isVisible:!0,map_options:{width:848,zoom:10,disableDefaultUI:!0,zoomControl:!0,styles:[{featureType:"landscape.natural.terrain",elementType:"labels.text.fill",stylers:[{visibility:"simplified"},{hue:"#ff0000"}]},{featureType:"poi",elementType:"labels",stylers:[{visibility:"off"}]}]},map:null,pins:[],pinsData:[],pinsUrl:[],prevId:-1,activePin:null,infoBox:null,infoBoxOpen:!1,container:d.getElementById("map-container"),init:function(){if(!(a(".detail").length>0)){if(this.isVisible=a("#category-results-map-btn").is(":visible"),this.isVisible){var b=this;b.mapInit(),google.maps.Map.prototype.clearOverlays=function(){for(var a=0;a<b.pins.length;a+=1)b.pins[a].setMap(null);b.pins.length=0}}this.initialized=!0}},addPoint:function(a,b,c){if(this.isVisible){var d=this,e=new google.maps.LatLng(a.lat,a.lon),f=Number(a.index)+1;this.initialized||this.init();var g=new google.maps.Marker({position:e,map:this.map,icon:"/_files/img/pins/pin_"+f+".png",id:f});this.pinsData.push(b),this.pinsUrl.push(c),this.pins.push(g),google.maps.event.addListener(g,"click",function(a){g.setIcon("/_files/img/pins/pin_"+g.id+"_active.png"),null!==d.activePin&&d.activePin.setIcon("/_files/img/pins/pin_"+d.activePin.id+".png"),d.activePin=g;var b=d.pinsData[g.id-1],c=d.pinsUrl[g.id-1];null!==d.infoBox&&d.infoBox.close(),d.infoBox=new InfoBox({content:d.buildInfoBox(b,c),boxStyle:{opacity:1,width:"400px"},closeBoxMargin:"10px 2px 2px 2px",closeBoxURL:"http://www.google.com/intl/en_us/mapfiles/close.gif"}),d.infoBox.open(d.map,g),google.maps.event.addListener(d.infoBox,"closeclick",function(a){null!==d.activePin&&d.activePin.setIcon("/_files/img/pins/pin_"+g.id+".png")})}),this.mapCenter()}},buildInfoBox:function(a,b){function c(a,b){var c;for(c in b)b.hasOwnProperty(c)&&(a=a.replace(new RegExp("{"+c+"}","g"),b[c]));return a}var d='<div class="category-result vcard result clearfix animate-repeat map-pin {main_class}" style="width: 300px;"><div class="category-result-title-bar">{title_bar}</div><div class="category-result-listing-content-container clearfix"><div class="category-result-content"><h2 class="fn org"><a title="{member_title}" href="{member_url}" class="url" target="_self">{member_name}</a></h2>{address} <br /><ul class="category-result-actions navigation-list horizontal">{referral}{email}{book_now}{buy_tickets}{make_reservation}{favorites}</ul></div></div></div>',f="";"Featured"===a.fields.featured_item&&(f+="featured "),"reitlistings"!==a._type&&"Featured"!==a.fields.featured_item&&(f+="notlisting "),"Featured Deals"===a.fields.has_featured_deals&&(f+="deal "),"reitdiscounts"===a._type&&(f+="noImage ");var g="";"Featured"===a.fields.featured_item&&(g+='<span class="category-result-title-bar-label">*Featured*</span> ');var h="",i=a._source.type_fields.region_id;switch(i){case 3:h="/explore/downtown/";break;case 5:h="/explore/central/";break;case 7:h="/explore/mustang-island/";break;case 9:h="/explore/north-bay/";break;case 1:h="/explore/north-beach/";break;case 4:h="/explore/northwest/";break;case 15:h="/explore/padre-island/";break;case 8:h="/explore/port-aransas/";break;case 6:h="/explore/southside/";break;case 10:h="/explore/surrounding-areas/"}"reitlistings"===a._type&&""!==h&&a._source.type_fields.region_name!==e&&(g+='<span><a href="'+h+'" class="category-result-title-bar-location-label">'+a._source.type_fields.region_name+"</a></span> ");var j=a._source.title,k=b+a._source.location,l=a._source.title,m="";(a._source.database_fields.address1||a._source.database_fields.city||a._source.database_fields.state||a._source.database_fields.phone1)&&(a._source.database_fields.address1&&(m+='<span class="street-address">'+a._source.database_fields.address1+"</span><br />"),a._source.database_fields.address2&&(m+='<span class="street-address">'+a._source.database_fields.address2+"</span><br />"),(a._source.database_fields.city||a._source.database_fields.state||a._source.database_fields.postalcode)&&(m+='<span class="locality">'+a._source.database_fields.city+',</span> <span class="region">'+a._source.database_fields.state+'</span> <span class="postal-code">'+a._source.database_fields.postalcode+"</span><br />"),a._source.database_fields.phone1&&(m+='<span class="tel">Call: <a href="tel:'+a._source.database_fields.phone1+'" title="Call: '+a._source.database_fields.phone1+'">'+a._source.database_fields.phone1+"</a></span>"),a._source.database_fields.phone2&&(m+='<br /><span class="tel">Call: <a href="tel:'+a._source.database_fields.phone2+'" title="Call: '+a._source.database_fields.phone2+'">'+a._source.database_fields.phone2+"</a></span>"),"reitevents"===a._type&&""!==a._source.type_fields.region_name&&(m+="<br />"));var n="",o="",p="",q="",r="",s="";this.getDeepProperty(a,"_source","database_fields","url")!==e&&(n='<li><a href="'+a._source.database_fields.url+'" class="call-to-action-button" title="'+a._source.title+' website (opens in a new browser window or tab)" target="_blank">Website</a></li>'),this.getDeepProperty(a,"_source","database_fields","email")!==e&&(o='<li><a href="mailto:'+a._source.database_fields.email+'" class="call-to-action-button" title="'+a._source.database_fields.email+'">Email</a></li>'),this.getDeepProperty(a,"_source","type_fields","book_now_url")!==e&&"1"===this.getDeepProperty(a,"_source","database_fields","rootclassificationid")&&(p='<li><a href="'+a._source.type_fields.book_now_url+'" class="call-to-action-button gaTracker" title="Book Now">Book Now</a></li>'),this.getDeepProperty(a,"_source","type_fields","book_now_url")!==e&&"2"===this.getDeepProperty(a,"_source","database_fields","rootclassificationid")&&(q='<li><a href="'+a._source.type_fields.book_now_url+'" class="call-to-action-button" title="Buy Tickets">Buy Tickets</a></li>'),this.getDeepProperty(a,"_source","type_fields","book_now_url")!==e&&"171"===a._source.database_fields.rootclassificationid&&(r='<li><a href="'+a._source.type_fields.book_now_url+'" class="call-to-action-button" title="Make Reservation">Make Reservation</a></li>');var t="";"reitevents"===a._type?t="&amp;type=1":"reitdiscounts"===a._type&&(t="&amp;type=2");var u=breilabs.favorites.isFavorite(a._id);s=u?'<li><a href="javascript:;" class="call-to-action-button call-to-action-button-highlight add-favorite brei-is-favorite brei-favorite-btn" data-rei-favorite="'+a._id+t+'" title="Remove From Favorites">Remove From Favorites</a></li>':'<li><a href="javascript:;" class="call-to-action-button call-to-action-button-highlight add-favorite brei-favorite-btn" data-rei-favorite="'+a._id+t+'" title="Add to my favorites">Add to Favorites</a></li>';var v=c(d,{main_class:f,title_bar:g,member_title:j,member_url:k,member_name:l,address:m,referral:n,email:o,book_now:p,buy_tickets:q,make_reservation:r,favorites:s});return setTimeout(function(){breilabs.favorites.rebuild()},500),v},removePins:function(){null!==this.infoBox&&this.infoBox.close();for(var a in this.pins)if(this.pins.hasOwnProperty(a)){var b=this.pins[a];b.setMap(null),google.maps.event.clearListeners(b)}this.pins=[],this.pinsUrl=[],this.pinsData=[]},mapCenter:function(){if(this.initialized){google.maps.event.trigger(corpuschristitex.categoryResultsMap.map,"resize");var a=new google.maps.LatLng(this.latitude,this.longitude);this.map.setCenter(a)}else this.init()},mapInit:function(){this.isVisible&&a("#map-container").length&&null===this.map&&this.buildMap()},buildMap:function(){if(this.isVisible){var a=this;this.map=new google.maps.Map(d.getElementById("map-container"),this.map_options),google.maps.event.addListenerOnce(a.map,"idle",function(){a.initialized=!0})}},getDeepProperty:function(a){for(var b=1;b<arguments.length;b+=1)"object"==typeof a&&(a=a[arguments[b]]);return"object"==typeof a?e:a}}}(window.jQuery,window.Modernizr,window,window.document);var corpuschristitex=corpuschristitex||{};!function(a,b,c,d,e){"use strict";corpuschristitex.categoryResults={$elem:{},$active:null,init:function(){corpuschristitex.categoryResultsForm.init(),corpuschristitex.categoryResultsMap.init(),this.$elem={$listBtn:a("#category-results-list-btn"),$mapBtn:a("#category-results-map-btn"),$listTab:a("#category-results-list"),$mapTab:a("#category-results-map")},a(this.$elem.$listBtn).on("click",this.listBtnClick),a(this.$elem.$mapBtn).on("click",this.mapBtnClick),a(".activeTabBtn").length?this.activateTab(a(".activeTabBtn").attr("id")):this.activateTab(a(".category-results-tab").first().attr("id")+"-btn")},activateTab:function(b){switch(b){case"category-results-list-btn":a(this.$elem.$listBtn).addClass("is-active"),a(this.$elem.$mapBtn).removeClass("is-active"),a(this.$elem.$listTab).addClass("is-active"),a(this.$elem.$mapTab).removeClass("is-active"),breilabs.favorites.rebuild(),corpuschristitex.main.unveilAgain();break;case"category-results-map-btn":a(this.$elem.$listBtn).removeClass("is-active"),a(this.$elem.$mapBtn).addClass("is-active"),a(this.$elem.$listTab).removeClass("is-active"),a(this.$elem.$mapTab).addClass("is-active"),corpuschristitex.categoryResultsMap.mapCenter()}},listBtnClick:function(b){var c=a(b.currentTarget).attr("id");corpuschristitex.categoryResults.activateTab(c),b.preventDefault()},mapBtnClick:function(b){var c=a(b.currentTarget).attr("id");corpuschristitex.categoryResults.activateTab(c),a("#map-container").length&&google.maps.event.trigger(corpuschristitex.categoryResultsMap.map,"resize"),b.preventDefault()}}}(window.jQuery,window.Modernizr,window,window.document),$(window).load(function(){"use strict";corpuschristitex.categoryResults.init()});var corpuschristitex=corpuschristitex||{};!function(a,b,c,d,e){"use strict";corpuschristitex.filterResults={$elem:{},init:function(){this.$elem={$checkbox:a("label")},this.toggleChecked()},toggleChecked:function(){a(this.$elem.$checkbox).click(function(){a(this).toggleClass("checked")})}}}(window.jQuery,window.Modernizr,window,window.document),$(function(){"use strict";corpuschristitex.filterResults.init()});