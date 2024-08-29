var simstatus = 0;
var rotstatus = 1;

var commenttext = "Some Text";
var commentloc = 0;

var trans = new point(200, 250);
var graph_trans = new point(100, 400);

var o = new point(0, 0, "o");
//var a= new point(0,0,"a");
var s = new point(0, 0, "s");

var theta = 0;
var omega = 1;
var a = 0,
  b = 0;

var flaggrashof = true;

var canvas;
var ctx;
//timing section
var simTimeId = setInterval("", "1000");
var pauseTime = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
var ptxdot = [];
var ptxddot = [];
var ptxdddot = [];
var accel = [];
accel[0] = 0;
var jerkk = [];
jerkk[0] = 0;
//click status of legend and quick reference
var legendCS = false;
var quickrefCS = false;
var temp = 0;
var offset = 0;
var graphDraw = false;

var pos, acc, vel, jerk;
var i = 0,
  j = 20;
var tempPt = new point(0, 0, "");
var truncate = 750;
var forvar = 0;
var m1 = 0,
  m2 = 0,
  x = 0,
  y = 0;
var v1 = 0,
  v2 = 0,
  v3 = 0;
var v11 = 0,
  v22 = 0,
  v33 = 0;

function editcss() {
  $(".variable").css("padding-top", "30px");
  $(".usercheck").css("left", "40px");
  $("#legend").css("width", document.getElementById("legendimg").width + "px");
  $("#legend").css("top", 419);
  $("#legend").css("left", 342);
  $("#legendicon").css("top", 471);
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

function simstate() {
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#thetaspinner").spinner("value", theta); //to set simulation parameters on pause
    pauseTime = setInterval("varupdate();", "100");
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
  }
}

function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}

function showLegend() {
  if (legendCS) {
    $("#legendicon").css("border", "single");
    $("#legend").css("height", "0px");
    $("#legend").css("border", "0px");
    legendCS = false;
  } else {
    $("#legendicon").css("border", "smoke");
    $("#legend").css(
      "height",
      document.getElementById("legendimg").height + "px"
    );
    $("#legend").css("border", "none");
    legendCS = true;
  }
}

function varinit() {
  varchange();
  //Variable r slider and number input types
  $("#aslider").slider("value", 20);
  $("#aspinner").spinner("value", 20);
  //Variable a slider and number input types
  $("#bslider").slider("value", 25);
  $("#bspinner").spinner("value", 25);
  //Variable theta slider and number input types
  $("#thetaslider").slider("value", 40);
  $("#thetaspinner").spinner("value", 40);
  //Variable omega slider and number input types
  $("#omegaslider").slider("value", 0.6);
  $("#omegaspinner").spinner("value", 0.6);
}

function varchange() {
  //Variable r slider and number input types
  $("#aslider").slider({ max: 24, min: 10, step: 1 }); // slider initialisation : jQuery widget
  $("#aspinner").spinner({ max: 24, min: 10, step: 1 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#aslider").on("slide", function (e, ui) {
    $("#aspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    ptxdddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#aspinner").on("spin", function (e, ui) {
    $("#aslider").slider("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    ptxdddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#aspinner").on("change", function () {
    varchange();
  });

  //Variable a slider and number input types
  $("#bslider").slider({ max: 60, min: 10, step: 1 }); // slider initialisation : jQuery widget
  $("#bspinner").spinner({ max: 60, min: 10, step: 1 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#bslider").on("slide", function (e, ui) {
    $("#bspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    ptxdddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#bspinner").on("spin", function (e, ui) {
    $("#bslider").slider("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    ptxdddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#bspinner").on("change", function () {
    varchange();
  });

  //Variable theta slider and number input types
  $("#thetaslider").slider({ max: 360, min: 0, step: 1 }); // slider initialisation : jQuery widget
  $("#thetaspinner").spinner({ max: 360, min: 0, step: 1 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#thetaslider").on("slide", function (e, ui) {
    $("#thetaspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#thetaspinner").on("spin", function (e, ui) {
    $("#thetaslider").slider("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#thetaspinner").on("change", function () {
    varchange();
  });

  //Variable omega2 slider and number input types
  $("#omegaslider").slider({ max: 0.6, min: 0.1, step: 0.1 }); // slider initialisation : jQuery widget
  $("#omegaspinner").spinner({ max: 0.6, min: 0.1, step: 0.1 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#omegaslider").on("slide", function (e, ui) {
    $("#omegaspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    ptxdddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#omegaspinner").on("spin", function (e, ui) {
    $("#omegaslider").slider("value", ui.value);
    ptx = [];
    pty = [];
    ptxdot = [];
    ptxddot = [];
    ptxdddot = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  });
  $("#omegaspinner").on("change", function () {
    varchange();
  });

  varupdate();
}

function varupdate() {
  $("#aslider").slider("value", $("#aspinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#bslider").slider("value", $("#bspinner").spinner("value"));
  $("#thetaslider").slider("value", $("#thetaspinner").spinner("value"));

  a = $("#aspinner").spinner("value");
  b = $("#bspinner").spinner("value");

  if (!simstatus) {
    $("#omegaslider").slider("enable");
    $("#omegaspinner").spinner("enable");
    $("#thetaslider").slider("disable");
    $("#thetaspinner").spinner("disable");
    omega = $("#omegaspinner").spinner("value");
    printcomment("", 2);
    theta = theta + rotstatus * 0.1 * deg(omega);
    theta = theta % 360;
    if (theta < 0) theta += 360;
  }

  if (simstatus) {
    $("#thetaslider").slider("enable");
    $("#thetaspinner").spinner("enable");
    $("#omegaslider").slider("disable");
    $("#omegaspinner").spinner("disable");
    theta = $("#thetaspinner").spinner("value");
    printcomment(
      "Maj Axis at " +
        theta +
        "&deg;  Position = " +
        roundd(pos, 2) +
        "cm<br>Vel = " +
        roundd(-vel, 2) +
        "cm/s  Acc = " +
        roundd(-acc, 2) +
        "cm/s^2<br>Jerk = " +
        roundd(-jerk, 2) +
        "cm/s^3",
      2
    );
  }

  m1 = Math.tan(rad(90 - theta));
  o.xcoord = 0;
  o.ycoord = 0;
  s.xcoord = 0;
  s.ycoord = a * b * Math.pow((1 + m1 * m1) / (b * b + a * a * m1 * m1), 0.5);

  draw();
}

function draw() {
  if (!graphDraw) {
    canvas = document.getElementById("simscreen");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 550, 450); //clears the complete canvas#simscreen everytime

    pointtrans(o, trans);
    pointtrans(s, trans);

    var o1 = new point(0, 0, "o");
    var s1 = new point(0, 0, "s");
    o1.xcoord = o.xcoord;
    o1.ycoord = o.ycoord + 7.5;
    s1.xcoord = s.xcoord;
    s1.ycoord = s.ycoord - 25;

    ellipse(a, b, ctx);

    drawrect(o1, 10, 15, 0, ctx, "#CC9933", "#CC9933", 1);
    drawrect(s1, 10, 50, 5, ctx, "#CC9933", "#CC9933", 1);

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#666666";
    ctx.moveTo(30, o.ycoord + 15);
    ctx.lineTo(530, o.ycoord + 15);
    ctx.stroke();
    ctx.closePath();

    pointdisp(o, ctx, 5, "#000000", "#003366", "", "", "");
    pointdisp(s, ctx, 5, "#000000", "#003366", "", "", "");
  }

  if (graphDraw) {
    canvas = document.getElementById("simscreen");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 550, 450); //clears the complete canvas#simscreen everytime

    pointtrans(o, graph_trans);
    pointtrans(s, graph_trans);

    var o1 = new point(0, 0, "o");
    var s1 = new point(0, 0, "s");
    o1.xcoord = o.xcoord;
    o1.ycoord = o.ycoord + 7.5;
    s1.xcoord = s.xcoord;
    s1.ycoord = s.ycoord - 25;

    ellipse(a, b, ctx);

    drawrect(o1, 10, 15, 0, ctx, "#CC9933", "#CC9933", 1);
    drawrect(s1, 10, 50, 5, ctx, "#CC9933", "#CC9933", 1);

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#666666";
    ctx.moveTo(30, o.ycoord + 15);
    ctx.lineTo(530, o.ycoord + 15);
    ctx.stroke();
    ctx.closePath();

    pointdisp(o, ctx, 5, "#000000", "#003366", "", "", "");
    pointdisp(s, ctx, 5, "#000000", "#003366", "", "", "");
  }

  graph(ctx);
}

function graph(context) {
  v1 = 1 + m1 * m1;
  v11 = (-2 * m1 * omega) / Math.tan(rad(theta)) / Math.sin(rad(theta));
  v2 = b * b + a * a * m1 * m1;
  v22 = (-2 * a * a * m1 * omega) / Math.tan(rad(theta)) / Math.sin(rad(theta));
  v3 = Math.pow(1 / Math.sin(rad(theta)), 2);
  v33 = (-2 * omega) / Math.tan(rad(theta)) / Math.pow(Math.sin(rad(theta)), 2);

  pos =
    a * b * Math.pow((1 + m1 * m1) / (b * b + a * a * m1 * m1), 0.5) -
    (a + b) / 2;
  vel =
    (a * b * m1 * omega * (a * a - b * b)) /
    Math.pow(Math.sin(rad(theta)), 2) /
    Math.sqrt(1 + m1 * m1) /
    Math.pow(b * b + a * a * m1 * m1, 1.5);

  /*acc = a*b*m1*omega*omega*(a*a-b*b)*(Math.pow(v1,-0.5)*Math.pow(v2,-1.5)*(2*m1+v3)*(-v3)+(m1*m1*v3*v3*(3*a*a*Math.pow(v1,-0.5)*Math.pow(v2,-2.5)
	+Math.pow(v1,-1.5)*Math.pow(v2,-1.5))));

jerk = 2*acc*v33/v3 + a*b*omega*omega*omega*(a*a-b*b)*Math.pow(v3,2)*(Math.pow(v1,-0.5)*Math.pow(v2,-1.5)*(-4*Math.cos(rad(theta))*Math.sin(rad(theta)))
	-(1/2)*(2*Math.pow(Math.cos(rad(theta)),2)+1)*Math.pow(v1,-1.5)*v11*Math.pow(v2,-1.5)-(3/2)*(2*Math.pow(Math.cos(rad(theta)),2)+1)*Math.pow(v1,-0.5)*(Math.pow(v2,-5.5)*v22
	-2*m1*v3*(3*a*a*Math.pow(v1,-0.5)*Math.pow(v2,-2.5)+Math.pow(v1,-1.5)*Math.pow(v2,-1.5)) + m1*m1*(3*a*a*(-.5)*Math.pow(v1,-1.5)*v11*Math.pow(v2,-2.5)
	+3*a*a*(-2.5)*Math.pow(v1,-0.5)*Math.pow(v2,-3.5)*v22 + (-1.5)*Math.pow(v1,-2.5)*v11*Math.pow(v2,-1.5)+(-1.5)*Math.pow(v1,-1.5)*Math.pow(v2,-2.5)*v22 )));
*/
  acc = (vel - accel[accel.length - 1]) / 0.5;
  accel.push(vel);
  jerk = (acc - jerkk[jerkk.length - 1]) / 0.5;
  jerkk.push(acc);

  if (graphDraw) {
    if (!simstatus) {
      ptx.push(o.ycoord - 50 - (a + b) / 2 - pos);
      ptxdot.push(o.ycoord - 125 - (a + b) / 2 + 2 * vel);
      ptxddot.push(o.ycoord - 200 - (a + b) / 2 + 4 * acc);
      ptxdddot.push(o.ycoord - 275 - (a + b) / 2 + 10 * jerk);
      pty.push(o.xcoord + j);
      j = j + 0.5;
    }

    tempPt.ycoord = s.ycoord - 50;
    tempPt.xcoord = o.xcoord;
    pointdisp(tempPt, context, 3, "#000000", "#336699");
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.moveTo(o.xcoord, s.ycoord - 50);

    if (pty.length < truncate) {
      context.lineTo(pty[pty.length - 1], s.ycoord - 50);
      context.moveTo(pty[pty.length - 1], o.ycoord - 400);
      context.lineTo(pty[pty.length - 1], o.ycoord + 300);
    } else {
      context.lineTo(pty[truncate], s.ycoord - 50);
      context.moveTo(pty[truncate], o.ycoord - 400);
      context.lineTo(pty[truncate], o.ycoord + 300);
    }
    context.stroke();
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.font = "700 12px 'Nunito', sans-serif";

    context.moveTo(o.xcoord + 18, o.ycoord - (a + b) / 2 - 50);
    context.lineTo(o.xcoord + 500, o.ycoord - (a + b) / 2 - 50);
    context.moveTo(o.xcoord + 18, o.ycoord - (a + b) / 2 - 125);
    context.lineTo(o.xcoord + 500, o.ycoord - (a + b) / 2 - 125);
    context.moveTo(o.xcoord + 18, o.ycoord - (a + b) / 2 - 200);
    context.lineTo(o.xcoord + 500, o.ycoord - (a + b) / 2 - 200);
    context.moveTo(o.xcoord + 18, o.ycoord - (a + b) / 2 - 275);
    context.lineTo(o.xcoord + 500, o.ycoord - (a + b) / 2 - 275);

    context.fillText("Time", o.xcoord + 400, o.ycoord - (a + b) / 2 - 50 + 13);
    context.fillText("Time", o.xcoord + 400, o.ycoord - (a + b) / 2 - 125 + 13);
    context.fillText("Time", o.xcoord + 400, o.ycoord - (a + b) / 2 - 200 + 13);
    context.fillText("Time", o.xcoord + 400, o.ycoord - (a + b) / 2 - 275 + 13);

    context.moveTo(o.xcoord + 20, o.ycoord - 500);
    context.lineTo(o.xcoord + 20, o.ycoord + 300);
    context.fillText("Amplitude", o.xcoord - 45, o.ycoord - (a + b) / 2 - 160);

    context.fillText(
      "Position (s)",
      o.xcoord - 47,
      o.ycoord - (a + b) / 2 - 50
    );
    context.fillText(
      "Velocity (v)",
      o.xcoord - 50,
      o.ycoord - (a + b) / 2 - 125
    );
    context.fillText(
      "Acceleration (a)",
      o.xcoord - 75,
      o.ycoord - (a + b) / 2 - 200
    );
    context.fillText("Jerk (j)", o.xcoord - 30, o.ycoord - (a + b) / 2 - 275);

    context.save();
    context.textAlign = "center";
    context.fillText("+20", o.xcoord + 38, o.ycoord - (a + b) / 2 - 50 - 20);
    context.fillText("-20", o.xcoord + 38, o.ycoord - (a + b) / 2 - 50 + 20);
    context.fillText("+10", o.xcoord + 38, o.ycoord - (a + b) / 2 - 125 - 20);
    context.fillText("-10", o.xcoord + 38, o.ycoord - (a + b) / 2 - 125 + 20);
    context.fillText("+5", o.xcoord + 38, o.ycoord - (a + b) / 2 - 200 - 20);
    context.fillText("-5", o.xcoord + 38, o.ycoord - (a + b) / 2 - 200 + 20);
    context.fillText("+2", o.xcoord + 38, o.ycoord - (a + b) / 2 - 275 - 20);
    context.fillText("-2", o.xcoord + 38, o.ycoord - (a + b) / 2 - 275 + 20);
    context.restore();

    for (
      forvar = 50;
      forvar <= 275;
      forvar += 75 //amplitude axis marking
    ) {
      context.moveTo(o.xcoord + 18, o.ycoord - (a + b) / 2 - forvar + 20);
      context.lineTo(o.xcoord + 22, o.ycoord - (a + b) / 2 - forvar + 20);
      context.moveTo(o.xcoord + 18, o.ycoord - (a + b) / 2 - forvar - 20);
      context.lineTo(o.xcoord + 22, o.ycoord - (a + b) / 2 - forvar - 20);
    }
    context.stroke();
    context.closePath();

    plot_graph(pty, ptx, context, truncate);
    plot_graph(pty, ptxdot, context, truncate, "#00FF00");
    plot_graph(pty, ptxddot, context, truncate, "#FF0000");
    plot_graph(pty, ptxdddot, context, truncate, "#505050");
  } else {
    ptx = [];
    ptxdot = [];
    ptxddot = [];
    pty = [];
    j = 20;
    ptx.push(s.ycoord - 50);
    pty.push(o.xcoord + j);
  }
}

function plot_graph(pt, pty, context, truncate, gcolor, lwidth) {
  context.save();
  if (!lwidth) lwidth = 1;
  if (!gcolor) gcolor = "#0000FF";
  if (!truncate) truncate = 1000;
  context.beginPath();
  context.lineWidth = lwidth;
  context.strokeStyle = gcolor;
  context.moveTo(pt[1], pty[1]);
  i = 1;

  while (i < pty.length) {
    context.lineTo(pt[i], pty[i]);
    i++;
    if (i >= truncate) {
      pty.splice(0, 1);
      i = i - 1;
    }
  }
  context.stroke();
  context.closePath();
  context.restore();
}

function ellipse(a, b, context) {
  context.save();
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  context.moveTo(
    o.xcoord + a * Math.cos(rad(theta)),
    o.ycoord - a * Math.sin(rad(theta))
  );
  i = 0;

  while (i <= 360) {
    m2 = Math.tan(rad(i));
    pos = a * b * Math.pow((1 + m2 * m2) / (b * b + a * a * m2 * m2), 0.5);
    x = pos * Math.cos(rad(theta + i));
    y = pos * Math.sin(rad(theta + i));
    context.lineTo(o.xcoord + x, o.ycoord - y);
    i++;
  }
  context.stroke();
  context.fillStyle = "#CC7777";
  context.fill();
  context.closePath();
  context.restore();
}

function enableGraphDraw() {
  graphDraw = !graphDraw;
}

function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
