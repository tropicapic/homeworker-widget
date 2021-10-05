// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: graduation-cap;
// Add a valid auth cookie from one of your homeworker sessions.
const auth = '';

const ENV = {
  themes: {
    dark: {
      bg: '#1E1E1E',
      bright_text: '#ffffff',
      light_text: '#DCDCDC',
      primary: '#FF9500',
      more: "000",
    },
    light: {
      bg: '#fafafa',
      bright_text: '#000',
      light_text: '#232323',
      primary: '#FF9500',
      more: "fff",
    }
  },
  isMediumWidget: config.widgetFamily === 'medium',
  scriptRefreshInterval: 5400,
}

function getColor(colorName, useDefault = false) {
  if (Device.isUsingDarkAppearance()) {
    return new Color(ENV.themes["dark"][colorName])
  } else {
    return new Color(ENV.themes["light"][colorName])
  }
}

function getFormatedDate(string) {
  const date = new Date(string);
  const weekday = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  if (ENV.isMediumWidget) {
    return `${weekday[date.getDay() - 1]}, ${date.getDate()}.${date.getMonth() + 1}`
  } else {
    return `${weekday[date.getDay() - 1]}, ${date.getDate()}.${date.getMonth() + 1}.`
  }
}

async function createWidget(data) {
  let widget = new ListWidget();
  widget.setPadding(16, 16, 4, 16);
  widget.backgroundColor = getColor("bg");
  widget.url = "https://homeworker.li/dashboard";
  // Check if there is an data error
  if (data.error) {
    widget.addSpacer();
    let text = widget.addText(data.error);
    text.textColor = getColor("light_text");
    text.font = Font.regularSystemFont(16);
  } else {
    //Check if data is empty
    if (data.length === 0) {
      let text = widget.addText("Keine Vertretungen");
      text.textColor = getColor("light_text");
      text.font = Font.regularSystemFont(16);
    } else {
      //Medium Widget
      if (ENV.isMediumWidget) {
        console.log("medium");
        let daysRow = widget.addStack();
        daysRow.layoutHorizontally();
        if (data[0].length === 1) {
          if (data.length === 1) {
            let day1Stack = daysRow.addStack();
            day1Stack.layoutVertically();
            let day1Element = day1Stack.addText(getFormatedDate(data[0][0].vp_datum));
            day1Element.textColor = getColor("light_text");
            day1Element.font = Font.semiboldSystemFont(14);
            day1Element.leftAlignText();
            day1Stack.addSpacer(4);
            createBigRepElement(day1Stack, data[0][0], 0);
          } else {
            createDayElement(daysRow, [data[0][0]]), 0;
            daysRow.addSpacer(16);
          }
        } else {
          if (data.length === 1) {
            createBigDayElement(daysRow, [data[0][0], data[0][1]])
          } else
            createDayElement(daysRow, [data[0][0], data[0][1]], data[0].length);
          daysRow.addSpacer(16);
        }
        // Second Date
        if (data.length > 1) {
          if (data[1].length === 1) {
            createDayElement(daysRow, [data[1][0]], data[1].length);
          } else {
            createDayElement(daysRow, data[1], data[1].length);
          }
        }
        //Small Widget
      } else {
        if (data[0].length === 1) {
          createTwoDaysElement(widget, [data[0][0], data[1][0]]);
        } else {
          createDayElement(widget, [data[0][0], data[0][1]], data[0].length);
        }
      }
      widget.addSpacer();
    }
  }

  return widget
}

function createTwoDaysElement(widget, data) {
  let daysStack = widget.addStack();
  daysStack.layoutVertically();
  //Day 1
  let day1Stack = daysStack.addStack();
  day1Stack.layoutVertically();
  let day1Element = day1Stack.addText(getFormatedDate(data[0].vp_datum));
  day1Element.textColor = getColor("light_text");
  day1Element.font = Font.semiboldSystemFont(11);
  day1Element.leftAlignText();
  day1Stack.addSpacer(4);
  createRepElement(day1Stack, data[0], 1);
  // Spacer
  daysStack.addSpacer(6);
  const spacer = daysStack.addStack();
  spacer.backgroundColor = new Color(ENV.themes[(Device.isUsingDarkAppearance() ? "dark" : "light")].bright_text, 0.25);
  if (ENV.isMediumWidget) {
    spacer.size = new Size(150, 1)
  } else {
    spacer.size = new Size(125, 1);
  }
  daysStack.addSpacer(6);
  //Day 2
  let day2Stack = daysStack.addStack();
  day2Stack.layoutVertically();
  let day2Element = day2Stack.addText(getFormatedDate(data[1].vp_datum));
  day2Element.textColor = getColor("light_text");
  day2Element.font = Font.semiboldSystemFont(11);
  day2Element.leftAlignText();
  day2Stack.addSpacer(4);
  createRepElement(day2Stack, data[1], 1);
}

function createDayElement(widget, data, moreReps) {
  let dayStack = widget.addStack();
  dayStack.layoutVertically();
  let textStack = dayStack.addStack();
  textStack.layoutHorizontally();
  let dayElement = textStack.addText(getFormatedDate(data[0].vp_datum));
  dayElement.textColor = getColor("light_text");
  dayElement.font = Font.semiboldSystemFont(14);
  dayElement.leftAlignText();
  if (moreReps > 2) {
    textStack.addSpacer();
    textStack.centerAlignContent();
    let moreStack = textStack.addStack();
    let more = moreStack.addText('+' + (moreReps - 2));
    more.textColor = getColor("more");
    more.font = Font.semiboldSystemFont(14);
    moreStack.backgroundColor = getColor("primary");
    moreStack.setPadding(0, 4, 0, 4);
    moreStack.cornerRadius = 4;
    dayStack.addSpacer(12);
  } else {
    dayStack.addSpacer(12);
  }
  data.map((rep, index) => {
    if (index < 2) {
      if (index === 1) {
        const spacer = dayStack.addStack();
        spacer.backgroundColor = new Color(ENV.themes[(Device.isUsingDarkAppearance() ? "dark" : "light")].bright_text, 0.25);
        if (ENV.isMediumWidget) {
          spacer.size = new Size(150, 1)
        } else {
          spacer.size = new Size(125, 1);
        }
        dayStack.addSpacer(5);

      }
      createRepElement(dayStack, rep, 0);
      dayStack.addSpacer(4);
    }
  })
}

function createBigDayElement(widget, data) {
  let dayStack = widget.addStack();
  dayStack.layoutVertically();
  let dayElement = dayStack.addText(getFormatedDate(data[0].vp_datum));
  dayElement.textColor = getColor("light_text");
  dayElement.font = Font.semiboldSystemFont(14);
  dayElement.leftAlignText();
  dayStack.addSpacer(12);
  data.map((rep, index) => {
    if (index === 1) {
      const spacer = dayStack.addStack();
      spacer.backgroundColor = new Color(ENV.themes[(Device.isUsingDarkAppearance() ? "dark" : "light")].bright_text, 0.25);
      if (ENV.isMediumWidget) {
        spacer.size = new Size(310, 1)
      } else {
        spacer.size = new Size(125, 1);
      }
      dayStack.addSpacer(6);

    }
    createBigRepElement(dayStack, rep, 0);
    dayStack.addSpacer(5);
  })
}

function createRepElement(dayElement, data, resize) {
  let representationStack = dayElement.addStack();
  representationStack.layoutVertically();
  let firstRow = representationStack.addStack();
  firstRow.layoutHorizontally();
  firstRow.centerAlignContent();
  let subjectElement = firstRow.addText(data.vp_vertr_fach);
  subjectElement.textColor = getColor("bright_text");
  subjectElement.font = Font.boldSystemFont(18 - resize);
  firstRow.addSpacer();
  let timeElememt = firstRow.addText(`${data.vp_stunde}. Stunde`);
  timeElememt.textColor = getColor("light_text");
  timeElememt.font = Font.semiboldSystemFont(12 - resize);
  representationStack.addSpacer(2)
  let secondRow = representationStack.addStack();
  secondRow.layoutHorizontally();
  secondRow.centerAlignContent();
  let teachersElement = secondRow.addStack();// 
  let repElement = teachersElement.addText(data.vp_vertr_lehrer);
  repElement.textColor = getColor("primary");
  repElement.font = Font.semiboldSystemFont(14 - resize);
  secondRow.addSpacer();
  let roomElment = secondRow.addText(data.vp_vertr_raum);
  roomElment.textColor = getColor("bright_text");
  roomElment.font = Font.semiboldSystemFont(14 - resize);
}

function createBigRepElement(dayElement, data, resize) {
  let representationStack = dayElement.addStack();
  representationStack.layoutVertically();
  let firstRow = representationStack.addStack();
  firstRow.layoutHorizontally();
  firstRow.centerAlignContent();
  let subjectElement = firstRow.addText(data.vp_vertr_fach);
  subjectElement.textColor = getColor("bright_text");
  subjectElement.font = Font.boldSystemFont(18 - resize);
  firstRow.addSpacer();
  let timeElememt = firstRow.addText(`${data.vp_stunde}. Stunde`);
  timeElememt.textColor = getColor("light_text");
  timeElememt.font = Font.semiboldSystemFont(12 - resize);
  representationStack.addSpacer(2)
  let secondRow = representationStack.addStack();
  secondRow.layoutHorizontally();
  secondRow.centerAlignContent();
  let teachersElement = secondRow.addStack();// 
  let absent = teachersElement.addText(`${data.vp_abs_lehrer.split(" ")[1]} - `);
  absent.textColor = getColor("light_text");
  absent.font = Font.semiboldSystemFont(14);
  let repElement = teachersElement.addText(data.vp_vertr_lehrer);
  repElement.textColor = getColor("primary");
  repElement.font = Font.semiboldSystemFont(14 - resize);
  secondRow.addSpacer();
  let roomElment = secondRow.addText(data.vp_vertr_raum);
  roomElment.textColor = getColor("bright_text");
  roomElment.font = Font.semiboldSystemFont(14 - resize);
}

async function manageData(auth) {
  let data = await cfm.read();
  if (!data.error) {
    if (data) {
      const date = new Date(data.updated);
      const now = new Date();
      console.log("update in: " + (date - now) / 1000 / 60 / 60);
      if ((date - now) < 0) {
        console.log("update");
        let newData = await getData(auth);
        if (newData.error) {
          cfm.save(data.data);
          return data.data;
        } else {
          cfm.save(newData);
          data = newData;
          return data;
        }
        return data;
      } else {
        console.log("storage");
        return data.data;
      }
    } else {
      console.log("file is empty");
    }
  } else {
    // if file doesnt exist
    console.log(data.error)
    data = await getData(auth);
    cfm.save(data);
    return data;
  }
}

async function getData(auth) {
  try {
    const html = await getRepresentationHTML(auth);
    const data = covertToObject(html);
    return data;
  } catch {
    return { error: "Fehler bei Datenabruf." };
  }
}

async function getRepresentationHTML(auth) {
  const req = new Request('https://homeworker.li/frame/representation');
  req.headers = {
    "Content-Type": "text/html",
    "cookie": `auth-key=${auth}`
  }
  return await req.loadString();
}

function covertToObject(html) {
  const arr = [];
  const dates = [];
  const string = html.substring(html.indexOf('<!-- array')).replace("<!-- array (", "").replace(") -->", "").split("array (");
  const final = [];
  string.shift();
  string.forEach((day, index) => {
    let subString = day.replace("\n", "");
    subString = subString.substring(0, subString.indexOf("),")).replaceAll(" =>", ": ").replaceAll(`'`, '"').replaceAll("NULL", "null").trim().slice(0, -1);
    subString = "{" + subString + "}";
    let obj = JSON.parse(subString);
    obj = removeEmpty(obj);
    if (obj.vp_vertr_lehrer === "EVAEVA" || obj.vp_vertr_lehrer === "EVA EVA") {
      obj.vp_vertr_lehrer = "EVA";
    }
    if (dates.length > 0) {
      if (!dates.includes(obj.vp_datum)) {
        dates.push(obj.vp_datum);
      }
    } else {
      dates.push(obj.vp_datum);
    }
    arr.push(obj);
  })
  dates.forEach(date => {
    const dayArr = [];
    arr.map(rep => {
      if (rep.vp_datum === date) {
        dayArr.push(rep);
      }
    })
    final.push(dayArr);
  })
  return final;
}

function removeEmpty(obj) {
  Object.keys(obj).forEach((k) => (!obj[k] && obj[k] !== undefined) && delete obj[k]);
  return obj;
};

function getDateOfTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

class CustomFilemanager {
  constructor() {
    try {
      this.fm = FileManager.iCloud()
      this.fm.documentsDirectory()
    } catch (e) {
      this.fm = FileManager.local()
    }
    this.configDirectory = 'HomeworkerRep'
    this.configPath = this.fm.joinPath(this.fm.documentsDirectory(), '/' + this.configDirectory)
    if (!this.fm.isDirectory(this.configPath)) this.fm.createDirectory(this.configPath)
  }
  async save(data) {
    let path = this.fm.joinPath(this.configPath, 'representations' + '.json');
    let obj = {
      updated: new Date().addHours(2),
      data,
    }
    let dataStr = JSON.stringify(obj);
    this.fm.writeString(path, dataStr);
  }
  async read() {
    let path = this.fm.joinPath(this.configPath, 'representations' + '.json');
    let type = 'json';
    if (this.fm.isFileStoredIniCloud(path) && !this.fm.isFileDownloaded(path)) await this.fm.downloadFileFromiCloud(path);
    if (this.fm.fileExists(path)) {
      try {
        let resStr = await this.fm.readString(path)
        let res = (type === 'json') ? JSON.parse(resStr) : resStr
        return res;
      } catch (e) {
        console.error(e)
        return { error: "status error" };
      }
    }
    return { error: "file not found" };
  }
}

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
}

const cfm = new CustomFilemanager();
let data = await manageData(auth);
let widget = await createWidget(data);
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget)
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentMedium()
}
Script.complete()