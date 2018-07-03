class BronnoysundApi {
    static getOrganisations(orgNumber) {
        const url = new URL(`https://data.brreg.no/rofs/od/rofs/stottetildeling/search`);
        let params = {'language': 'nob', 'mottakerOrgnr': orgNumber};
        url.search = new URLSearchParams(params);
        return fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json;charset=UTF-8'
            })
        }).then(response => {
            console.log(response);
            return response.json();
        }).catch(error => {
            return error;
        })
    }
}

export default BronnoysundApi;