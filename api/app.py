import json
import random
import secrets
from urllib.parse import urlparse

import firebase_admin
from firebase_admin import db
from flask import (
    Flask,
    Response,
    render_template,
    request,
    session,
    redirect,
    make_response,
)
from re import compile as cmp

try:
    from . import envs
    from . import firebase_manager
    from .URL import URL
except ImportError as e:

    import envs
    import firebase_manager
    from URL import URL

# TODO add Custom URLS

app = Flask(__name__)
firebase_admin.initialize_app(
    firebase_manager.cred, {"databaseURL": "https://shorterlinks1.firebaseio.com/"}
)


@app.route("/")
def main_create_page():
    return render_template("index.html")


@app.route("/api/", methods=["POST"])
def shorten():
    url = URL(request.form.get("url"))
    req = request.form.get("request")
    if "quic.ml" in url.host.lower():
        return {"error": "no"}
    urlstr = str(url)

    urlhash = url.get_url_hash()
    ref = db.reference("/shortened")
    ref2 = db.reference("/lookup")
    link = get_new_link(ref, ref2, urlhash, req)
    child = ref.child(link)
    child.set(urlstr)
    lookup = ref2.child(urlhash)
    lookup.set(link)
    shortened_URL = f"https://quic.ml/{link}"
    return Response(json.dumps({"success": True, "data": shortened_URL}))


@app.route("/<u>/", strict_slashes=False)
def send_redirect(u):
    ref = db.reference("/shortened")
    ret = ref.child(u).get()
    if ret:
        resp = make_response(redirect(ret, 301))
        resp.headers["cache-control"] = "s-maxage=31536000, stale-while-revalidate"
        return resp
    return "nothing here"


def get_new_url():
    return secrets.token_urlsafe()[: random.randint(3, 8)]


valid_reg = cmp(r"([^\w]|_|-)").sub


def is_allowed(req):

    return "/" not in req and valid_reg("", req) == req


def get_new_link(ref, ref2, url, req):
    is_prev = ref2.child(url).get()
    if is_prev:
        return is_prev
    if req and is_allowed(req) and not ref.child(req).get():
        return req
    while True:
        k = get_new_url()
        data = ref.child(k).get()
        # check if a link has been used previously
        if not data:
            return k


if __name__ == "__main__":
    app.run(debug=True)
