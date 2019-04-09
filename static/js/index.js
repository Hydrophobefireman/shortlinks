(() => {
  function isAValidURL(url) {
    try {
      return !!new URL(url);
    } catch (e) {
      return false;
    }
  }

  function urlencode(json) {
    return "".concat(
      Object.keys(json)
        .map(key =>
          ""
            .concat(encodeURIComponent(key), "=")
            .concat(encodeURIComponent(json[key]))
        )
        .join("&")
    );
  }

  const inp = document.getElementById("input_n");
  const btn = document.getElementById("btn_s");
  const errs = document.getElementById("errors");
  const result = document.getElementById("result");

  inp.onkeydown = _ref => {
    const keyCode = _ref.keyCode;

    if (keyCode === 13) {
      btn.click();
    }
  };

  btn.onclick = async () => {
    errs.innerHTML = "";
    const val = inp.value;

    if (val.length === 0 || !isAValidURL(val)) {
      return (errs.textContent = "An Error Occured..please check the URL");
    } else {
      const _ = urlencode({
        url: val
      });

      errs.textContent = "loading";
      const data = await fetch("/api/", {
        credentials: "include",
        method: "post",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: _
      });
      const resp = await data.json();
      errs.textContent = "";

      if (resp.error) {
        result.textContent = "An Error Occured..please check your input";
      }

      const a = document.createElement(a);
      a.href = resp.data;
      a.textContent = resp.data;
      const div = document.createElement("div");
      div.appendChild(document.createTextNode("Shortend URL: "));
      div.appendChild(a);
      result.appendChild(div);
    }
  };
})();
