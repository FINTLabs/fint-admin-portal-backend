import BronnoysundApi from "../../../data/api/BronnoysundApi";

export function getOrganisationsFromBronnoysund(orgNumber) {
    let organisations = [];
    return BronnoysundApi.getOrganisations(orgNumber).then(list => {
        list.forEach(org => {
            let organisation = {orgNumber: org.stottemottakerOrganisasjonsnummer, name: org.stottemottakerNavn};
            organisations.push(organisation);
        })
    }).then(() => {
        return organisations;
    })
}