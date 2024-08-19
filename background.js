
//authentication-resultsからspfとdkimを抽出
function extractAuthenticationResults(header) {
  let spf = null;
  let dkim = null;
  let sender_id = null;

  let parts = header.split(';');
  // 各部分をチェックしてspf=とdkim=, sender_idを探す
  for (let part of parts) {
    part = part.trim(); // 前後の空白を削除
    if (part.startsWith('spf=')) {
      spf = part;
    }
    else if (part.startsWith('sender-id')) {
      sender_id = part;
    }
    else if (part.startsWith('dkim=')) {
      dkim = part;
    }
  }
  return { spf: spf, dkim: dkim, sender_id: sender_id };
}

//junk かどうか判定する関数
async function check_message_junked(message) {
  messagePart = await browser.messages.getFull(message.id);
  let is_junk = false;
  // X-OCN ヘッダ 100.00%
  for (let hcontent of messagePart.headers['x-ocn-spam-check']) {
    if (hcontent == '100.00%') {
      is_junk = true;
    }
  }
  // SPF(送信元)が正しい(pass) and dkin=passの場合にはjunkにしない
  for (let hcontent of messagePart.headers['authentication-results']) {
    // ただし.cnからはすべてSPAMなのでjunk扱いにする
    // sender-id or dkim から、header.From or header.Senderを取り出す
    let attr = extractAuthenticationResults(hcontent);
    let from_match = attr.sender_id.match(/header\.From=(.*)/);
    if (from_match) {
      headerValue = from_match[1];
      if (headerValue.match(/\.cn$/)) {
        is_junk = true
        break;
      }
    }
    let sender_match = attr.sender_id.match(/header\.Sender=(.*)/);
    if (sender_match) {
      headerValue = sender_match[1];
      if (headerValue.match(/\.cn$/)) {
        is_junk = true
        break;
      }
    }
    let dkim_match = attr.dkim.match(/header\.i=(.*)/);
    if (dkim_match) {
      headerValue = dkim_match[1];
      if (headerValue.match(/\.cn$/)) {
        is_junk = true
        break;
      }
    }

    if ( hcontent.indexOf('spf=pass') != -1 && hcontent.indexOf('dkim=pass') != -1) {
      is_junk = false;
    }
  }
  if (is_junk == true) {
    // console.log("junked: ");
    // console.log(message);
    let update_message = {
      junk: true
    };
    browser.messages.update(message.id, update_message);
  }
}


//メールが選択された時
browser.mailTabs.onSelectedMessagesChanged.addListener(async (tab, messageList) => {
  for (let message of messageList.messages) {
    check_message_junked(message);
  }
});

//新規メール受信時
async function execute_mailreceived(folder, messages) {
  let spam_header_check_prefs = await browser.storage.local.get();
  if (spam_header_check_prefs.new_mail_arrived_check != true) {
    return;
  }
  for await (const message of listMessages(messages)) {
    check_message_junked(message);
  }
}

browser.messages.onNewMailReceived.addListener(execute_mailreceived);


//フォルダ選択時
browser.mailTabs.onDisplayedFolderChanged.addListener(async (tab, folder) => {
  let spam_header_check_prefs = await browser.storage.local.get();
  if (spam_header_check_prefs.folder_selected_check != true) {
    return;
  }
  let pages = await browser.messages.list(folder.id);
  for await (const message of listMessages(pages)) {
    check_message_junked(message);
  }
});


async function* listMessages(page) {
  for (let message of page.messages) {
    yield message;
  }

  while (page.id) {
    page = await browser.messages.continueList(page.id);
    for (let message of page.messages) {
      yield message;
    }
  }
}
