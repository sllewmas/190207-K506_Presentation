/*
The Lacuna by Samuel Wells
2017





*/
inlets = 1;
outlets = 5;
autowatch = 1;

var num_fx = 6;

var cueDict = new Dict;
var dict_name = "LacCues.json";
cueDict.import_json(dict_name);
cueDict.quiet = true;
var total_cues = 57;
var patch = this.patcher;
var tmp = patch.filepath.split("/");
tmp.pop();
var local_folder = "";
for (i = 0; i < tmp.length; i++) {
    local_folder += tmp[i] + "/";       
}

var matrix;
var dsp_patch;
var spect_delay;
var granulator;
var sd_obj = [];
var sd_livegain;
var current_dsp_matrix_status;
var current_mute_status;
var fffbpoly;
var spect_ringer;

var sf_pb = new PolyBuffer("LAC_wavs");  
sf_pb.readfolder(local_folder + "wavs/LAC/");
var mock_pb;
function load_mock() {	
    mock_pb = new PolyBuffer("mock_wavs");
    mock_pb.readfolder(local_folder + "/wavs/mock/");
}
function clear_mock() {	
    mock_pb.freepeer();
}

//sf_pb.open();
//mock_pb.open();

function loadbang() {
    dsp_patch = patch.getnamed("dsp_patch");
    matrix = dsp_patch.subpatcher().getnamed("LacunaDSPMatrix");
    granulator = dsp_patch.subpatcher().getnamed("jgLacGranPoly");
    spect_delay = dsp_patch.subpatcher().getnamed("spect_delay");
    fffbpoly = dsp_patch.subpatcher().getnamed("fffbPoly");
    spect_ringer = dsp_patch.subpatcher().getnamed("spect_ringer");
    
    for (i = 1; i <= 4; i++) {
        sd_obj.push(spect_delay.subpatcher().getnamed("sd_" + String(i)));
    }
    sd_livegain = spect_delay.subpatcher().getnamed("sd_livegain");
    effectMUTE(0);
}
   
function msg_int(cue_num) {                                             //access dictionary and call functions for each cue
    var a = "cues::" +String(cue_num);                                  //create base for getting keys from dictionary
    if (cue_num >= 0 && cue_num <= total_cues) {
                                //this is no avoid harmless dict errors when accessing non-existent keys
        for(i = 0; i < cueDict.get("function_list").length; i++){       //iterates each function name listed in dictionary
            var fc = cueDict.get("function_list")[i];
            var val;
            val = cueDict.get(a + "::" + fc);
            fc = fc.toLowerCase();
             if (val !== null) {
                //post(cue_num, fc, val,"\n");
                 if (fc == "mock") {
                    
                    mock(val);
                    
                 }
                if (fc == "sfplay") {
                    sfPlay(val);
                }
                if (fc == "sd") {
                    sd(val);
                }
                if (fc == "sd_gain") {
                    sd_gain(val);
                }
                if (fc == "gran") {
                    gran(val);
                }
                if (fc == "chop") {
                    chop(val);
                }
            }
        }
        effectMUTE(cue_num);
        effectON(cue_num);
        if (cue_num == 1) {
            performanceRec(1);
        }
        if (cue_num == 57) {
            performanceRec(0);
        }
        
    } else {
        post("Cue Numbers must be between 0 and " + String(total_cues) + ".\n");
    }
}

function effectON(cue_num) {
    var on_off = cueDict.get("cues::" +String(cue_num) + "::effectON");
    //post(typeof on_off, on_off, "\n");
    if (on_off != null){
        if (typeof on_off != 'object'){ //is on_off is not an array, make it an array
            on_off = [on_off];
        }
        if (on_off != current_dsp_matrix_status) { //this avoid unnecessary messages to matrix~
            //post(on_off, "\n")
            var output = new Array();
            for (i = 1; i <= num_fx; i++){
                for(ch = 0; ch < 2; ch++) {
                    output = [];
                    var LorR = ((i-1)*2+ch);
                    if (on_off.indexOf(i) >= 0) {
                        output.push("connect");
                    } else {
                        output.push("disconnect");  
                    }
                    output.push(ch, LorR);
                    matrix.message(output);
                }
            }
            current_dsp_matrix_status = on_off;
        }
    } else {
        effectON(cue_num - 1);
    }

}

function effectMUTE(cue_num) {
    var mutes = cueDict.get("cues::" +String(cue_num) + "::effectMUTE");
    //post(typeof on_off, on_off, "\n");
    if (mutes != null){
        
        if (mutes != current_mute_status) { //this avoid unnecessary messages to matrix~
            if(mutes[0] == 1) {
                fffbpoly.message("mute", 1, 1);
                //post("mute ffb on \n");
            } else {
                fffbpoly.message("mute", 1, 0);
                //post("mute ffb off \n");
            }
            if(mutes[1] == 1) {
                spect_delay.message("mute", 1, 1);
            } else {
                spect_delay.message("mute", 1, 0);
            }
            if(mutes[2] == 1) {
                spect_ringer.message("mute", 1, 1);
            } else {
                spect_ringer.message("mute", 1, 0);
            }
            current_mute_status = mutes;
        }
    } else {
        effectMUTE(cue_num - 1);
    }

}

function path() {
    messnamed("path", this.patcher.filepath);
}
function mock(file_num) {
    if (file_num == 0) {
        messnamed("mock_play", "target", 0);
        messnamed("mock_play", 0);
    } else {
        messnamed("mock_play", "note", "mock_wavs." + String(file_num ));
    }
}

function sfPlay(file_num) {
    if (file_num == 0) {
        messnamed("sf_play", "target", 0);
        messnamed("sf_play", 0);
    } else {
        messnamed("sf_play", "note", "LAC_wavs." + String(file_num ));
    }
}

function app () {
    messnamed("max", "launchbrowser", "file:///Users/samuelwells/Dropbox/_wellscored/Current Projects/Lacuna, The/Electronics/Performance_Patch/oscLac.app");
    //this.patcher.parentpatcher.newdefault(10, 70, "outlet");
}

//---------------------------------------------------------------Granulator Functions
function gran(x) {
    granulator.message("note", x);
    
}



//---------------------------------------------------------------Spectral Delay Functions
function sd(x){
    //post("this is happening in the sd function", "\n"); 
    var preset = x;
    for (i = 0; i < sd_obj.length; i++){
        
        sd_dts(i, cueDict.get("sd_preset::" + String(preset) +"::"+String(i+1)));
        
    }
}
  
function sd_dts(ch, settings) { //args = [sec, quantize resolution]
    var dts = ["dt"];
    var quant = settings[0];
    var sec = settings[1];
    var upper = Math.floor(sec/quant);
    for (x = 0; x < 32; x ++) {
        dts.push(randomInt(1, upper) * quant);
        
    }
    sd_obj[ch].message(dts);
    sd_obj[ch].message("fb", settings[2]); //fb times
       
}

function sd_gain(dBandRamp) {
    sd_livegain.sendbox("interp", dBandRamp[1]);
    sd_livegain.sendbox("int", dBandRamp[0]);
    
}

//---------------------------------------Chopper
function chop(mess) {
    messnamed("gen-chopper", mess);
}


//---------------------------------------Utilities
function postln(thingy) {
    post(thingy, "\n");
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function performanceRec(x) {
	if (x == 0) {
		messnamed("perfRecTog", 0);
	}
	if (x == 1) {
		messnamed("perfRec", "open", String(Date.now()) + "_LAC.wav");
		messnamed("perfRecTog", 1);
	}
}