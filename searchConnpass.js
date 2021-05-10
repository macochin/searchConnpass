// LINE Notifyでトークルームのトークンを取得して以下に設定
var LINE_NOTIFY_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_NOTIFY_TOKEN');
var NOTIFY_API = "https://notify-api.line.me/api/notify";

// Connpass WebAPI
var SEARCH_BASE_URL = "https://connpass.com/api/v1/event/"
                        + "?keyword=福岡"
                        + "&order=3";

function searchEvent() {
  var response = UrlFetchApp.fetch(SEARCH_BASE_URL);
  var json = JSON.parse(response.getContentText());
  
//  Logger.log(json);

  var date = new Date();
  date.setDate(date.getDate() -1);
  var today = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyyMMdd');
//  today = "20180511";
  
  var bodyItem = [];
  for (var i = 0; i < json.events.length; i++) {
    var update_date = new Date(json.events[i].updated_at);
    var str_update_date = Utilities.formatDate(update_date, 'Asia/Tokyo', 'yyyyMMdd');
    
    if (str_update_date == today) {
      bodyItem.push(json.events[i].title);
      bodyItem.push(json.events[i].event_url);
    }
  }
    
  // メッセージ送信
  if (bodyItem.length > 0) {
    // LINEに送信 --- (*3)
    _sendMessage(bodyItem.join("\n"));
  }
}

// スタンプを送信する
function _sendMessage(msg) {
  // 認証情報のセット
  var headers = {
    "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
  };
  // メッセージをセット
  var payload = {
    "message": "\n" + msg
  };
  // 送信情報をまとめる
  var options = {
    'method' : 'post',
    'contentType' : 'application/x-www-form-urlencoded',
    'headers': headers,
    'payload' : payload
  };
  Logger.log(options);
  // 実際に送信する
  var response = UrlFetchApp.fetch(NOTIFY_API, options);
  Logger.log(response);
}
