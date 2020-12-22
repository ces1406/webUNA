export function doGetRequest(addres) {
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
        
        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/user/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { res(rta) })
            .catch((err) => { rej(err) });
    })
}

export function doSimpleCorsGetRequest(addres) {
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { 
            Accept: 'application/json', 
            Origin: null
        }
        
        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/user/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { res(rta) })
            .catch((err) => { rej(err) });
    })
}

export function doPreflightCorsGetRequest(addres) {
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { 
            Accept: 'application/json', 
            'Content-Type': 'application/json' ,
            Origin: 'http://localhost:1111'
        }
        
        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/user/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { res(rta) })
            .catch((err) => { rej(err) });
    })
}

export function doPostRequest(addres, data, whitFormData) {
    return new Promise((res, rej) => {
        let cabecera = { method }
        cabecera.headers = { 
            Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json' 
        }//,'Content-Type': 'application/json'}
        if (!whitFormData) cabecera.headers['Content-Type'] = 'application/json';
        cabecera.body = data

        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addes.search('/user/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { res(rta) })
            .catch((err) => { rej(err) });
    })
}