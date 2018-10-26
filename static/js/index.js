function isAValidURL(url) {
    try {
        return !!new URL(url)
    } catch (e) {
        return false
    }
}

function urlencode(json) {
    return `${Object.keys(json).
            map(key =>`${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
            .join('&')}`;
};
const inp = document.getElementById("input_n");
const btn = document.getElementById("btn_s");
const errs = document.getElementById("errors");
const result = document.getElementById("result");
inp.onkeydown = e => {
    if (e.keyCode === 13) {
        btn.click()
    }
}
btn.onclick = async () => {
    errs.innerHTML = '';
    const val = inp.value;
    if (val.length === 0 || !isAValidURL(val)) {
        return errs.textContent = "An Error Occured..please check the URL"
    } else {
        const _ = urlencode({
            url: val
        });
        errs.textContent = "loading"
        const data = await fetch("/api/", {
            credentials: "include",
            method: "post",
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            body: _
        });
        const resp = await data.json();
        errs.textContent = '';
        if (resp.error) {
            result.textContent = "An Error Occured..please check your input"
        }
        result.innerHTML = `Shortened URL:<a href="${resp.data}">${resp.data}</a>`
    }
}