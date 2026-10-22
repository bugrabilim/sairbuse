"""App Store incelemesindeki gönderimin durumunu yazar; istenirse reddedilen gönderimi yeniden incelemeye yollar.

App Review bilgi istediğinde (Guideline 2.1) cevap App Store Connect'te yazılır, ama gönderim "Unresolved Issues"
durumunda kalır ve "Resubmit to App Review" düğmesi ancak reddedilen öğe çözüldü sayılınca açılır. Bu betik
reddedilen öğeyi çözüldü olarak işaretler ve gönderimi yeniden yollar (App Store Connect API: reviewSubmissions).

Çalıştırma (GitHub Actions, "iOS inceleme"): ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 ortamda.
  python3 scripts/uygulama/inceleme.py            → yalnız durum
  python3 scripts/uygulama/inceleme.py gonder     → reddedilen öğeleri çöz ve yeniden gönder
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

import jwt

PAKET = 'tr.bumba.duygularinpesinde'


def belirtec():
    simdi = int(time.time())
    return jwt.encode(
        {'iss': os.environ['ASC_ISSUER_ID'], 'iat': simdi, 'exp': simdi + 1100, 'aud': 'appstoreconnect-v1'},
        os.environ['ASC_KEY_P8'], algorithm='ES256', headers={'kid': os.environ['ASC_KEY_ID']},
    )


BELIRTEC = belirtec()


def api(yontem, yol, govde=None):
    istek = urllib.request.Request(
        'https://api.appstoreconnect.apple.com' + yol, method=yontem,
        data=json.dumps(govde).encode() if govde is not None else None,
        headers={'Authorization': 'Bearer ' + BELIRTEC, 'Content-Type': 'application/json'},
    )
    try:
        with urllib.request.urlopen(istek) as y:
            veri = y.read()
            return json.loads(veri) if veri else {}
    except urllib.error.HTTPError as h:
        raise RuntimeError(f'{yontem} {yol} → {h.code}: {h.read().decode()[:1500]}') from None


satirlar = []


def yaz(metin):
    print(metin)
    satirlar.append(metin)


def gonderimler(uygulama):
    return api('GET', f'/v1/reviewSubmissions?filter[app]={uygulama}&filter[platform]=IOS&limit=10')['data']


def ogeler(gonderim):
    return api('GET', f'/v1/reviewSubmissions/{gonderim}/items?include=appStoreVersion&limit=50')['data']


def durum_yaz(uygulama):
    for g in gonderimler(uygulama):
        a = g['attributes']
        yaz(f"Gönderim {g['id']}: {a.get('state')} · gönderildi {a.get('submittedDate') or '—'}")
        for o in ogeler(g['id']):
            yaz(f"  öğe {o['id']}: {o['attributes'].get('state')}")


def main():
    gonder = len(sys.argv) > 1 and sys.argv[1] == 'gonder'
    uygulamalar = api('GET', f'/v1/apps?filter[bundleId]={PAKET}')['data']
    if not uygulamalar:
        sys.exit('Bu paket kimliğiyle uygulama bulunamadı.')
    uygulama = uygulamalar[0]['id']
    durum_yaz(uygulama)

    if gonder:
        acik = [g for g in gonderimler(uygulama) if g['attributes'].get('state') == 'UNRESOLVED_ISSUES']
        if not acik:
            yaz('Çözülmemiş sorunu olan gönderim yok; yeniden gönderilecek bir şey yok.')
        for g in acik:
            for o in ogeler(g['id']):
                if o['attributes'].get('state') == 'REJECTED':
                    api('PATCH', f"/v1/reviewSubmissionItems/{o['id']}",
                        {'data': {'type': 'reviewSubmissionItems', 'id': o['id'], 'attributes': {'resolved': True}}})
                    yaz(f"Öğe {o['id']} çözüldü olarak işaretlendi.")
            api('PATCH', f"/v1/reviewSubmissions/{g['id']}",
                {'data': {'type': 'reviewSubmissions', 'id': g['id'], 'attributes': {'submitted': True}}})
            yaz(f"Gönderim {g['id']} yeniden incelemeye yollandı.")
        yaz('— Sonra —')
        durum_yaz(uygulama)

    ozet = os.environ.get('GITHUB_STEP_SUMMARY')
    if ozet:
        with open(ozet, 'a') as f:
            f.write('```\n' + '\n'.join(satirlar) + '\n```\n')


if __name__ == '__main__':
    main()
