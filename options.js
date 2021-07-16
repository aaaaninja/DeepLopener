function save_options() {
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
        }
      );
    }
  });
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    for (let i = 1; i < tabs.length; i++) chrome.tabs.reload(tabs[i].id);
  });
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
  chrome.storage.sync.get(
    {
      target: "EN-US",
      iconflag: "Enable",
      hoverflag: "Enable",
      freeflag: "Free",
      deeplpro_apikey: "",
    },
    function (items) {
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
          let gtlen = 0;
          if (items.deeplpro_apikey.length < foo.length) {
            gtlen = items.deeplpro_apikey.length;
          } else {
            gtlen = foo.length;
          }
          let tmp3 = "";
          for (let i = 0; i < items.deeplpro_apikey.length; i++) {
            tmp3 += String.fromCharCode(
              (items.deeplpro_apikey[i] - foo[i % gtlen]) / tmp
            );
          }
          document.querySelector("#target").value = items.target;
          document.querySelector("#iconflag").value = items.iconflag;
          document.querySelector("#hoverflag").value = items.hoverflag;
          document.querySelector("#freeflag").value = items.freeflag;
          document.querySelector("#deeplpro_apikey").value = tmp3;
          save_options();
        }
      });
    }
  );
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
