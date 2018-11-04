import json
import random
import secrets
from urllib.parse import urlparse

import firebase_admin
from firebase_admin import db
from flask import Flask, Response, render_template, request, session
import hashlib
import envs
import firebase_manager

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
    url = request.form.get("url")
    ref = db.reference("/")
    link = get_new_link(ref)
    parse = urlparse(url)
    if parse.scheme == "":
        return Response(json.dumps({"error": "No protocol"}))
    child = ref.child(link)
    child.set(url)
    shortened_URL = f"https://quic.ml/#{link}"
    return Response(json.dumps({"success": True, "data": shortened_URL}))


def get_new_url():
    return secrets.token_urlsafe(16)[: random.randint(3, 8)]


def get_new_link(ref):
    while True:
        k = get_new_url()
        data = ref.order_by_key().equal_to(k).get()
        # check if a link has been used previously
        if not data:
            return k


if __name__ == "__main__":
    app.run(debug=True)
