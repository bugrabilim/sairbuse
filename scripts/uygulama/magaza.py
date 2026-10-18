"""App Store Connect'e mağaza bilgilerini yükler: uygulama adı ve alt başlık, açıklama, anahtar kelimeler, tanıtım
metni, adresler, kategoriler, telif, yaş derecelendirmesi, inceleme notu, ekran görüntüleri ve son yapı.
Metinler uygulama/magaza/metinler.json, görüntüler uygulama/magaza/ekran/. İncelemeye göndermez; gizlilik etiketi
(App Privacy) ve inceleme iletişim bilgileri App Store Connect'te elle girilir (API'de yok ya da kişisel bilgi).

Çalıştırma (GitHub Actions, "iOS mağaza bilgileri"): ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 ortamda.
Her bölüm ayrı denenir; biri hata verirse sonrakiler sürer, sonda özet yazılır.
"""
import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

import jwt

PAKET = 'tr.bumba.duygularinpesinde'
KOK = Path(__file__).resolve().parents[2]
METIN = json.loads((KOK / 'uygulama/magaza/metinler.json').read_text())
EKRAN = KOK / 'uygulama/magaza/ekran'
# Sitenin dili → App Store Connect dilleri (İngilizce ABD ve Birleşik Krallık mağazaları için ikisi de)
DILLER = {'tr': ['tr'], 'en': ['en-US', 'en-GB']}
EKRAN_TURU = 'APP_IPHONE_67'  # 6,9" ve 6,7" iPhone (1290×2796)


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


def nesne(tur, kimlik, oz=None, iliski=None):
    d = {'type': tur, 'id': kimlik}
    if oz:
        d['attributes'] = oz
    if iliski:
        d['relationships'] = iliski
    return {'data': d}


sonuc = []


def bolum(ad):
    def sar(f):
        try:
            f()
            sonuc.append(f'✓ {ad}')
        except Exception as e:  # noqa: BLE001 — her bölüm ayrı raporlanır
            sonuc.append(f'✗ {ad}: {e}')
        return f
    return sar


uygulama = api('GET', f'/v1/apps?filter[bundleId]={PAKET}')['data'][0]
UYG = uygulama['id']
print('Uygulama', UYG, uygulama['attributes']['name'])

surumler = api('GET', f'/v1/apps/{UYG}/appStoreVersions?filter[platform]=IOS')['data']
duzenlenir = ['PREPARE_FOR_SUBMISSION', 'DEVELOPER_REJECTED', 'REJECTED', 'METADATA_REJECTED']
surum = next(s for s in surumler if s['attributes']['appStoreState'] in duzenlenir)
SURUM = surum['id']
print('Sürüm', surum['attributes']['versionString'], surum['attributes']['appStoreState'])

# Yayındaki bir sürüm yoksa tek bir uygulama bilgisi vardır; varsa düzenlenebilen (yayında olmayan) seçilir
bilgiler = api('GET', f'/v1/apps/{UYG}/appInfos')['data']
BILGI = next((b for b in bilgiler if b['attributes'].get('state') not in ('READY_FOR_DISTRIBUTION', 'REPLACED_WITH_NEW_INFO')), bilgiler[0])['id']


@bolum('Uygulama adı, alt başlık, gizlilik adresi')
def _():
    var = {x['attributes']['locale']: x for x in api('GET', f'/v1/appInfos/{BILGI}/appInfoLocalizations')['data']}
    for dil, yerler in DILLER.items():
        m = METIN['diller'][dil]
        oz = {'name': METIN['ad'], 'subtitle': m['altBaslik'], 'privacyPolicyUrl': m['gizlilik']}
        for yer in yerler:
            if yer in var:
                api('PATCH', f'/v1/appInfoLocalizations/{var[yer]["id"]}', nesne('appInfoLocalizations', var[yer]['id'], oz))
            else:
                api('POST', '/v1/appInfoLocalizations', {'data': {'type': 'appInfoLocalizations', 'attributes': {**oz, 'locale': yer},
                    'relationships': {'appInfo': {'data': {'type': 'appInfos', 'id': BILGI}}}}})


@bolum('Kategoriler')
def _():
    api('PATCH', f'/v1/appInfos/{BILGI}', nesne('appInfos', BILGI, iliski={
        'primaryCategory': {'data': {'type': 'appCategories', 'id': METIN['kategori']}},
        'secondaryCategory': {'data': {'type': 'appCategories', 'id': METIN['ikinciKategori']}},
    }))


@bolum('Yaş derecelendirmesi (olgun/düşündürücü temalar: seyrek ve hafif; gerisi yok)')
def _():
    beyan = api('GET', f'/v1/appInfos/{BILGI}/ageRatingDeclaration')['data']
    # Evet/hayır soruları hayır, düzey soruları yok; yalnız olgun/düşündürücü temalar seyrek ve hafif
    # (üç şiirde ölüm ve kendine zarar imgesi var, şiirsel; uygulama/magaza/bilgiler.md). Geçersiz kılma alanlarına dokunulmaz.
    evet_hayir = {'gambling', 'lootBox', 'unrestrictedWebAccess', 'messagingAndChat', 'userGeneratedContent', 'advertising',
                  'parentalControls', 'ageAssurance', 'healthOrWellnessTopics'}
    atla = {'kidsAgeBand', 'seventeenPlus', 'ageRatingOverride', 'ageRatingOverrideV2', 'koreaAgeRatingOverride',
            'developerAgeRatingInfoUrl'}
    oz = {}
    for k, v in beyan['attributes'].items():
        if k in atla:
            continue
        if k == 'matureOrSuggestiveThemes':
            oz[k] = 'INFREQUENT_OR_MILD'
        elif isinstance(v, bool) or k in evet_hayir:
            oz[k] = False
        else:
            oz[k] = 'NONE'
    print('Yaş beyanı alanları:', json.dumps(oz, ensure_ascii=False))
    api('PATCH', f'/v1/ageRatingDeclarations/{beyan["id"]}', nesne('ageRatingDeclarations', beyan['id'], oz))


@bolum('Sürüm: telif')
def _():
    api('PATCH', f'/v1/appStoreVersions/{SURUM}', nesne('appStoreVersions', SURUM, {'copyright': METIN['telif']}))


@bolum('Sürüm metinleri (açıklama, anahtar kelimeler, tanıtım, adresler)')
def _():
    var = {x['attributes']['locale']: x for x in api('GET', f'/v1/appStoreVersions/{SURUM}/appStoreVersionLocalizations')['data']}
    for dil, yerler in DILLER.items():
        m = METIN['diller'][dil]
        oz = {'description': m['aciklama'], 'keywords': m['anahtar'], 'promotionalText': m['tanitim'],
              'supportUrl': m['destek'], 'marketingUrl': m['pazarlama']}
        for yer in yerler:
            if yer in var:
                api('PATCH', f'/v1/appStoreVersionLocalizations/{var[yer]["id"]}', nesne('appStoreVersionLocalizations', var[yer]['id'], oz))
            else:
                api('POST', '/v1/appStoreVersionLocalizations', {'data': {'type': 'appStoreVersionLocalizations',
                    'attributes': {**oz, 'locale': yer},
                    'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': SURUM}}}}})


@bolum('Ekran görüntüleri (6,9" iPhone, 5 adet her dilde)')
def _():
    yerel = {x['attributes']['locale']: x['id'] for x in api('GET', f'/v1/appStoreVersions/{SURUM}/appStoreVersionLocalizations')['data']}
    for dil, yerler in DILLER.items():
        dosyalar = sorted(EKRAN.glob(f'{METIN["diller"][dil]["ekran"]}-*.jpg'))
        for yer in yerler:
            lid = yerel[yer]
            setler = api('GET', f'/v1/appStoreVersionLocalizations/{lid}/appScreenshotSets')['data']
            kume = next((s for s in setler if s['attributes']['screenshotDisplayType'] == EKRAN_TURU), None)
            if kume is None:
                kume = api('POST', '/v1/appScreenshotSets', {'data': {'type': 'appScreenshotSets',
                    'attributes': {'screenshotDisplayType': EKRAN_TURU},
                    'relationships': {'appStoreVersionLocalization': {'data': {'type': 'appStoreVersionLocalizations', 'id': lid}}}}})['data']
            # Yeniden çalıştırılabilsin: kümedeki eski görüntüler silinir
            for eski in api('GET', f'/v1/appScreenshotSets/{kume["id"]}/appScreenshots')['data']:
                api('DELETE', f'/v1/appScreenshots/{eski["id"]}')
            for dosya in dosyalar:
                veri = dosya.read_bytes()
                ek = api('POST', '/v1/appScreenshots', {'data': {'type': 'appScreenshots',
                    'attributes': {'fileName': dosya.name, 'fileSize': len(veri)},
                    'relationships': {'appScreenshotSet': {'data': {'type': 'appScreenshotSets', 'id': kume['id']}}}}})['data']
                for op in ek['attributes']['uploadOperations']:
                    parca = veri[op['offset']:op['offset'] + op['length']]
                    istek = urllib.request.Request(op['url'], data=parca, method=op['method'],
                        headers={h['name']: h['value'] for h in op['requestHeaders']})
                    urllib.request.urlopen(istek).read()
                api('PATCH', f'/v1/appScreenshots/{ek["id"]}', nesne('appScreenshots', ek['id'],
                    {'uploaded': True, 'sourceFileChecksum': hashlib.md5(veri).hexdigest()}))
            print(yer, len(dosyalar), 'görüntü')


@bolum('İnceleme notu')
def _():
    oz = {'notes': METIN['inceleme_notu'], 'demoAccountRequired': False}
    try:
        var = api('GET', f'/v1/appStoreVersions/{SURUM}/appStoreReviewDetail')['data']
    except RuntimeError:
        var = None
    if var:
        api('PATCH', f'/v1/appStoreReviewDetails/{var["id"]}', nesne('appStoreReviewDetails', var['id'], oz))
    else:
        api('POST', '/v1/appStoreReviewDetails', {'data': {'type': 'appStoreReviewDetails', 'attributes': oz,
            'relationships': {'appStoreVersion': {'data': {'type': 'appStoreVersions', 'id': SURUM}}}}})


@bolum('Yapı: en son işlenmiş yapı sürüme bağlandı')
def _():
    yapilar = api('GET', f'/v1/builds?filter[app]={UYG}&filter[processingState]=VALID&sort=-uploadedDate&limit=1')['data']
    if not yapilar:
        raise RuntimeError('işlenmiş yapı yok')
    y = yapilar[0]
    api('PATCH', f'/v1/appStoreVersions/{SURUM}/relationships/build', {'data': {'type': 'builds', 'id': y['id']}})
    print('Yapı', y['attributes']['version'])


print('\n'.join(sonuc))
with open(os.environ.get('GITHUB_STEP_SUMMARY', os.devnull), 'a') as f:
    f.write('```\n' + '\n'.join(sonuc) + '\n```\n')
sys.exit(0 if all(s.startswith('✓') for s in sonuc) else 1)
