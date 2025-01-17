const defaultValues = {
  target: "EN-US",
  iconflag: "Enable",
  hoverflag: "Enable",
  freeflag: "Free",
  deeplpro_apikey: "",
  apikeyEncryption: true
}

function save_options() {
  // current values
  const target = document.querySelector("#target").value
  const iconflag = document.querySelector("#iconflag").value
  const hoverflag = document.querySelector("#hoverflag").value
  const freeflag = document.querySelector("#freeflag").value
  const deeplpro_apikey = document.querySelector("#deeplpro_apikey").value
  const apikeyEncryption = document.querySelector("#encryption_option").checked

  chrome.storage.local.set({ apikeyEncryption }, () => {
    if (apikeyEncryption === false) {
      chrome.storage.local.set({ target, iconflag, hoverflag, freeflag, deeplpro_apikey }, show_saved_text)
      return
    }
    
    chrome.identity.getProfileUserInfo(null, function (info) {
      if (info.id == "" || info.email == "") {
        document.querySelector("#apitestm").style.color = "red";
        document.querySelector("#apitestm").innerHTML = errHTML;
      } else {
        chrome.storage.sync.set(
          {
            target, iconflag, hoverflag, freeflag,
            deeplpro_apikey: encrypt(info.id, info.email, deeplpro_apikey),
          },
          show_saved_text
        );
      }
    })

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      for (let i = 1; i < tabs.length; i++) chrome.tabs.reload(tabs[i].id);
    })
  })
}

function restore_options() {
  document.querySelectorAll(".descparent").forEach((descpar) => {
    descpar.querySelector("select").addEventListener("mouseover", function () {
      descpar.querySelector(".description").style.display = "inline-block";
    });
    descpar.querySelector("select").addEventListener("mouseleave", function () {
      descpar.querySelector(".description").style.display = "none";
    });
  });
  chrome.storage.local.get(defaultValues, (configuredValues) => {
    if (configuredValues.apikeyEncryption === false) {
      document.querySelector("#target").value = configuredValues.target
      document.querySelector("#iconflag").value = configuredValues.iconflag
      document.querySelector("#hoverflag").value = configuredValues.hoverflag
      document.querySelector("#freeflag").value = configuredValues.freeflag
      document.querySelector("#deeplpro_apikey").value = configuredValues.deeplpro_apikey
      document.querySelector("#encryption_option").checked = configuredValues.apikeyEncryption
      return save_options()
    }
    chrome.storage.sync.get(defaultValues, function (items) {
        chrome.identity.getProfileUserInfo(null, function (info) {
          if (info.id == "" || info.email == "") {
            document.querySelector("#apitestm").style.color = "red";
            document.querySelector("#apitestm").innerHTML = errHTML;
          } else {
            document.querySelector("#target").value = items.target;
            document.querySelector("#iconflag").value = items.iconflag;
            document.querySelector("#hoverflag").value = items.hoverflag;
            document.querySelector("#freeflag").value = items.freeflag;
            document.querySelector("#deeplpro_apikey").value = decrypt(info.id, info.email, items.deeplpro_apikey);
            document.querySelector("#encryption_option").checked = configuredValues.apikeyEncryption;
            save_options();
          }
        });
      }
    )
  })
}

function api_test() {
  if (document.querySelector("#deeplpro_apikey").value == undefined) {
    document.querySelector("#deeplpro_apikey").value = "";
  }
  chrome.identity.getProfileUserInfo(null, function (info) {
    if (info.id == "" || info.email == "") {
      document.querySelector("#apitestm").style.color = "red";
      document.querySelector("#apitestm").innerHTML = errHTML;
    } else {
      let tmp = 0;
      let tmp2 = 1;
      let len = 0;
      if (info.id.length < info.email.length) {
        len = info.id.length;
      } else {
        len = info.email.length;
      }
      for (let i = 0; i < len; i++) {
        tmp += info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
        tmp2 *= info.id.charCodeAt(i) * info.email.charCodeAt(len - i - 1);
      }
      let foo = [];
      for (
        let i = Math.round(String(tmp2).length / 2);
        i < String(tmp2).length;
        i++
      ) {
        foo.push(
          String(tmp2).charCodeAt(i) *
            String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
        );
      }
      let tmplist = [];
      let gtlen = 0;
      if (
        document.querySelector("#deeplpro_apikey").value.length < foo.length
      ) {
        gtlen = document.querySelector("#deeplpro_apikey").value.length;
      } else {
        gtlen = foo.length;
      }
      for (
        let i = 0;
        i < document.querySelector("#deeplpro_apikey").value.length;
        i++
      ) {
        tmplist.push(
          document.querySelector("#deeplpro_apikey").value.charCodeAt(i) * tmp +
            foo[i % gtlen]
        );
      }
      chrome.storage.sync.set(
        {
          target: document.querySelector("#target").value,
          iconflag: document.querySelector("#iconflag").value,
          hoverflag: document.querySelector("#hoverflag").value,
          freeflag: document.querySelector("#freeflag").value,
          deeplpro_apikey: tmplist,
        },
        function () {
          let save = document.querySelector("#message");
          save.textContent = "Saved!";
          setTimeout(function () {
            save.textContent = "";
          }, 1500);
          chrome.storage.sync.get(null, function (items) {
            let target = items.target;
            let freeflag = items.freeflag;
            let ct = items.deeplpro_apikey;
            if (typeof target === "undefined") {
              target = "EN-US";
            }
            let api_url = "";
            if (freeflag == "Free") {
              api_url = "https://api-free.deepl.com/v2/translate";
            } else {
              api_url = "https://api.deepl.com/v2/translate";
            }
            let tmp3 = "";
            for (let i = 0; i < ct.length; i++) {
              tmp3 += String.fromCharCode((ct[i] - foo[i % gtlen]) / tmp);
            }
            let api_key = tmp3;
            let params = {
              auth_key: api_key,
              text: "認証成功",
              target_lang: target,
            };
            let data = new URLSearchParams();
            Object.keys(params).forEach((key) => data.append(key, params[key]));
            fetch(api_url, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded; utf-8",
              },
              body: data,
            }).then((res) => {
              if (res.status == "200") {
                res.json().then((resData) => {
                  document.querySelector("#apitestm").style.color = "";
                  document.querySelector("#apitestm").innerText =
                    resData.translations[0].text + "!";
                });
              } else {
                document.querySelector("#apitestm").style.color = "red";
                switch (res.status) {
                  case 400:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nBad request. Please check error message and your parameters.";
                    break;
                  case 403:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nAuthorization failed. Please supply a valid auth_key parameter.";
                    break;
                  case 404:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nThe requested resource could not be found.";
                    break;
                  case 413:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nThe request size exceeds the limit.";
                    break;
                  case 414:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nThe request URL is too long.";
                    break;
                  case 429:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nToo many requests. Please wait and resend your request.";
                    break;
                  case 456:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nQuota exceeded. The character limit has been reached.";
                    break;
                  case 503:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nResource currently unavailable. Try again later.";
                    break;
                  case 529:
                    document.querySelector("#apitestm").innerText =
                      "Error : " +
                      res.status +
                      "\nToo many requests. Please wait and resend your request.";
                    break;
                  default:
                    document.querySelector("#apitestm").innerText =
                      "Error : " + res.status;
                }
              }
            });
          });
        }
      );
    }
  });
}

const errHTML =
  "To use this extension, please sign in to chrome and sync turns on.<br>If you are interested in another version that can be used without chrome synchronization, please check <a href='https://github.com/T3aHat/DeepLopener' target='_blank'>DeepLopener's GitHub repository</a>.";
document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
document.querySelector("#apitest").addEventListener("click", api_test);

function show_saved_text() {
  let save = document.querySelector("#message");
  save.textContent = "Saved!";
  setTimeout(function () {
    save.textContent = "";
  }, 1500);
}

// salt1 ex. -> String "113115274752392254562"
// salt2 ex. -> String "hoge@example.com"
function encrypt(salt1, salt2, targetKey) {
  let tmp = 0;
  let tmp2 = 1;
  let len = 0;
  if (salt1.length < salt2.length) {
    len = salt1.length;
  } else {
    len = salt2.length;
  }
  for (let i = 0; i < len; i++) {
    tmp += salt1.charCodeAt(i) * salt2.charCodeAt(len - i - 1);
    tmp2 *= salt1.charCodeAt(i) * salt2.charCodeAt(len - i - 1);
  }
  let foo = [];
  for (
    let i = Math.round(String(tmp2).length / 2);
    i < String(tmp2).length;
    i++
  ) {
    foo.push(
      String(tmp2).charCodeAt(i) *
        String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
    );
  }
  let tmplist = [];
  let gtlen = 0;
  if (
    targetKey.length < foo.length
  ) {
    gtlen = targetKey.length;
  } else {
    gtlen = foo.length;
  }
  for (
    let i = 0;
    i < targetKey.length;
    i++
  ) {
    tmplist.push(
      targetKey.charCodeAt(i) * tmp +
        foo[i % gtlen]
    );
  }

  return tmplist // example. Array [9560484, 4923452, 9560890, 4544880, 5018570, 9469327]
}

// salt1 ex. -> String "113115274752392254562"
// salt2 ex. -> String "hoge@example.com"
function decrypt(salt1, salt2, encryptedArray) {
  let tmp = 0;
  let tmp2 = 1;
  let len = 0;
  if (salt1.length < salt2.length) {
    len = salt1.length;
  } else {
    len = salt2.length;
  }
  for (let i = 0; i < len; i++) {
    tmp += salt1.charCodeAt(i) * salt2.charCodeAt(len - i - 1);
    tmp2 *= salt1.charCodeAt(i) * salt2.charCodeAt(len - i - 1);
  }
  let foo = [];
  for (
    let i = Math.round(String(tmp2).length / 2);
    i < String(tmp2).length;
    i++
  ) {
    foo.push(
      String(tmp2).charCodeAt(i) *
        String(tmp2).charCodeAt(i - Math.round(String(tmp2).length / 2))
    );
  }
  let gtlen = 0;
  if (encryptedArray.length < foo.length) {
    gtlen = encryptedArray.length;
  } else {
    gtlen = foo.length;
  }
  let tmp3 = "";
  for (let i = 0; i < encryptedArray.length; i++) {
    tmp3 += String.fromCharCode(
      (encryptedArray[i] - foo[i % gtlen]) / tmp
    );
  }

  return tmp3; // example String hogefugapiyo
}
