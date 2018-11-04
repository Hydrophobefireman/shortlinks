import json
import os

from firebase_admin import credentials

cred_ = {
    "type": "service_account",
    "project_id": "shorterlinks1",
    "private_key_id": os.environ.get("g_private_key_id"),
    "private_key": os.environ.get("g_private_key").replace("\\n", "\n"),
    "client_email": "firebase-adminsdk-sspe5@shorterlinks1.iam.gserviceaccount.com",
    "client_id": os.environ.get("g_client_id"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("g_client_x509_cert_url"),
}
cred = credentials.Certificate(cred_)
