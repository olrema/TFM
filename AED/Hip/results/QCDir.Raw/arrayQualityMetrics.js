// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, true, false, false, true, false, false, false, false, true, true, false, false, false, true, false, false, true, true, true, true, true, false, false, false, true, false, false, false, false, false, false, true, false, false ];
var arrayMetadata    = [ [ "1", "FEM.CT.1", "FEM.CT", "FEM", "CT", "FEM.CT.1" ], [ "2", "FEM.CT.2", "FEM.CT", "FEM", "CT", "FEM.CT.2" ], [ "3", "FEM.CT.3", "FEM.CT", "FEM", "CT", "FEM.CT.3" ], [ "4", "FEM.CT.4", "FEM.CT", "FEM", "CT", "FEM.CT.4" ], [ "5", "FEM.CT.5", "FEM.CT", "FEM", "CT", "FEM.CT.5" ], [ "6", "FEM.CT.6", "FEM.CT", "FEM", "CT", "FEM.CT.6" ], [ "7", "FEM.CT.7", "FEM.CT", "FEM", "CT", "FEM.CT.7" ], [ "8", "FEM.CT.8", "FEM.CT", "FEM", "CT", "FEM.CT.8" ], [ "9", "FEM.CT.9", "FEM.CT", "FEM", "CT", "FEM.CT.9" ], [ "10", "MALE.CT.1", "MALE.CT", "MALE", "CT", "MALE.CT.1" ], [ "11", "MALE.CT.2", "MALE.CT", "MALE", "CT", "MALE.CT.2" ], [ "12", "MALE.CT.3", "MALE.CT", "MALE", "CT", "MALE.CT.3" ], [ "13", "MALE.CT.4", "MALE.CT", "MALE", "CT", "MALE.CT.4" ], [ "14", "MALE.CT.5", "MALE.CT", "MALE", "CT", "MALE.CT.5" ], [ "15", "MALE.CT.6", "MALE.CT", "MALE", "CT", "MALE.CT.6" ], [ "16", "MALE.CT.7", "MALE.CT", "MALE", "CT", "MALE.CT.7" ], [ "17", "MALE.CT.8", "MALE.CT", "MALE", "CT", "MALE.CT.8" ], [ "18", "MALE.CT.9", "MALE.CT", "MALE", "CT", "MALE.CT.9" ], [ "19", "FEM.AD.1", "FEM.AD", "FEM", "AD", "FEM.AD.1" ], [ "20", "FEM.AD.2", "FEM.AD", "FEM", "AD", "FEM.AD.2" ], [ "21", "FEM.AD.3", "FEM.AD", "FEM", "AD", "FEM.AD.3" ], [ "22", "FEM.AD.4", "FEM.AD", "FEM", "AD", "FEM.AD.4" ], [ "23", "FEM.AD.5", "FEM.AD", "FEM", "AD", "FEM.AD.5" ], [ "24", "FEM.AD.6", "FEM.AD", "FEM", "AD", "FEM.AD.6" ], [ "25", "FEM.AD.7", "FEM.AD", "FEM", "AD", "FEM.AD.7" ], [ "26", "FEM.AD.8", "FEM.AD", "FEM", "AD", "FEM.AD.8" ], [ "27", "FEM.AD.9", "FEM.AD", "FEM", "AD", "FEM.AD.9" ], [ "28", "MALE.AD.1", "MALE.AD", "MALE", "AD", "MALE.AD.1" ], [ "29", "MALE.AD.2", "MALE.AD", "MALE", "AD", "MALE.AD.2" ], [ "30", "MALE.AD.3", "MALE.AD", "MALE", "AD", "MALE.AD.3" ], [ "31", "MALE.AD.4", "MALE.AD", "MALE", "AD", "MALE.AD.4" ], [ "32", "MALE.AD.5", "MALE.AD", "MALE", "AD", "MALE.AD.5" ], [ "33", "MALE.AD.6", "MALE.AD", "MALE", "AD", "MALE.AD.6" ], [ "34", "MALE.AD.7", "MALE.AD", "MALE", "AD", "MALE.AD.7" ], [ "35", "MALE.AD.8", "MALE.AD", "MALE", "AD", "MALE.AD.8" ], [ "36", "MALE.AD.9", "MALE.AD", "MALE", "AD", "MALE.AD.9" ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
