token =
        '_MHYUUID=c2262ca2-0ca0-4962-8270-af3d67978b8d; DEVICEFP_SEED_ID=f61b85eccc75f895; DEVICEFP_SEED_TIME=1715008232809; DEVICEFP=38d7f20a5c284; _ga_JTLS2F53NR=GS1.1.1720462586.1.1.1720462633.0.0.0; _ga_GFC5HN79FG=GS1.1.1720462587.1.1.1720462633.0.0.0; ltoken_v2=v2_CAISDGNlMXRidXdiMDB6axokYzIyNjJjYTItMGNhMC00OTYyLTgyNzAtYWYzZDY3OTc4YjhkIIrFj7UGKNbh_MEGMJDE7w5CC2hrNGVfZ2xvYmFs.iuKjZgAAAAAB.MEQCIH1PKvmBg4WK-Fw_Ei2zzHQCckhVcJ-ygiIlObCNKOJhAiBdCosQp4KTgucqZyV4zeWYkrJhc1PY38BaBobdh6lEUw; ltmid_v2=10bl03zy7j_hy; ltuid_v2=31187472; _gid=GA1.2.1991886611.1722128666; mi18nLang=vi-vn; HYV_LOGIN_PLATFORM_OPTIONAL_AGREEMENT={%22content%22:[]}; HYV_LOGIN_PLATFORM_LOAD_TIMEOUT={}; _ga_54PBK3QDF4=GS1.1.1722151282.5.1.1722151353.0.0.0; _ga_T9HTWX7777=GS1.1.1722151282.5.1.1722151353.0.0.0; HYV_LOGIN_PLATFORM_TRACKING_MAP={%22sourceValue%22:%22144%22}; _gat_gtag_UA_200790024_1=1; HYV_LOGIN_PLATFORM_LIFECYCLE_ID={%22value%22:%2203cfa225-d5aa-49ac-81b8-32ecb15f3456%22}; _ga_45QSFFBGJT=GS1.1.1722153259.6.1.1722153825.0.0.0; _ga_HF7DEW0H6V=GS1.1.1722153259.6.1.1722153825.0.0.0; _ga=GA1.1.718950389.1715008829; _ga_Y5SZ86WZQH=GS1.1.1722151353.3.1.1722153831.0.0.0; _gat_gtag_UA_206868027_31=1; _ga_SBYZMHZRMJ=GS1.1.1722151353.3.1.1722153831.0.0.0'
const headers = {
        Cookie: token,
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'x-rpc-app_version': '2.34.1',
        'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0',
        'x-rpc-client_type': '4',
        Referer: 'https://act.hoyolab.com/',
        Origin: 'https://act.hoyolab.com',
}
const fetchData = async () => {
        try {
                const res = await fetch(
                        'https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign?lang=vi-vn&act_id=e202406031448091',
                        {
                                method: 'POST',
                                headers: headers,
                        },
                )
                const data = await res.json()
                console.log(data)
        } catch (error) {
                console.error('Error:', error)
        }
}

fetchData()
