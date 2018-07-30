
class OrganisationApi {

  static fetchOrganisations() {
    const url = `/api/organisations`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static getOrganisations() {
    const url = `/api/organisations`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(response => Promise.all([response, response.json()]));
  }

  static createOrganisation(organisation) {
    const url = `/api/organisations`;
    const request = new Request(url, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        name: organisation.name,
        orgNumber: organisation.orgNumber,
        displayName: organisation.displayName,
      })
    });

    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static updateOrganisation(organisation) {
    const url = `/api/organisations/${organisation.name}`;
    const request = new Request(url, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        dn: organisation.dn,
        name: organisation.name,
        orgNumber: organisation.orgNumber,
        displayName: organisation.displayName,
      })
    });

    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static deleteOrganisation(organisation) {
    const request = new Request(`/api/organisations/${organisation.name}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static getLegalContact(organisation) {
    const url = `/api/organisations/${organisation.name}/contacts/legal`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(response => {
      return response.json();
    });
  }

  static setLegalContact(organisation, contact) {
    const url = `/api/organisations/${organisation.name}/contacts/legal/${contact.nin}`;
    return fetch(url, {
      method: 'PUT',
      credentials: 'same-origin'
    })
      .then(response => {
        return response
      }).catch(error => {
        return error
      })
  }

  static unsetLegalContact(organisation, contact) {
    const request = new Request(`/api/organisations/${organisation.name}/contacts/legal/${contact.nin}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    return fetch(request)
      .then(response => {
        return response;
      }).catch(error => {
        return error;
      });
  }

  static getPrimaryAsset(organisation) {
    const url = `/api/organisations/${organisation.name}/asset/primary`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    }).then(response => {
      return response.json();
    });
  }

}

export default OrganisationApi
