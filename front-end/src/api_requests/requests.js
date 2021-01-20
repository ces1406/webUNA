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
    console.log('Getsimplecorsgetrequest->address:'+addres)
    addres = 'http://localhost:5000'+addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { 
            Accept: 'application/json', 
            Origin: null
        }
        
        fetch(addres, cabecera)
            .then((resp) => {
                console.log('resp->'+JSON.stringify(resp))
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
export function doSimpleCorsPostRequest(addres,data,sinFormData) {
    console.log('GetsimplecorsPostRequest->address:'+addres)
    addres = 'http://localhost:5000'+addres;

    return new Promise((res, rej) => {
        let cabecera = { method:'POST' }
        cabecera.headers = { 
            Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json',
        };
        cabecera.body = data;  
        console.log('doSimplecorsPostRequest->data: ',data)      
        fetch(addres, cabecera)
            .then((resp) => {
                console.log('doSimplecorsPostRequest->resp:',resp)
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then((rta) => { res(rta);console.log('doSimplecorsPostRequest->rta:',rta) })
            .catch((err) => { rej(err); console.log('doSimplecorsPostRequest->err:',err) });
    })
}