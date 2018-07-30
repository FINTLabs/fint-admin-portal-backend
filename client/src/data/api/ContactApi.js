
class ContactApi {

  static fetchContacts() {
    const url = `/api/contacts`;
    const request = new Request(url, {
      method: 'GET',
      credentials: 'same-origin'
    });
    return fetch(request).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static getContacts() {
    const url = `/api/contacts`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    })
      .then(response => Promise.all([response, response.json()]));
  }

  static createContact(contact) {
    const url = `/api/contacts`;
    const request = new Request(url, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        nin: contact.nin,
        firstName: contact.firstName,
        lastName: contact.lastName,
        mail: contact.mail,
        mobile: contact.mobile
      })
    });

    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static updateContact(contact) {
    const request = new Request(`/api/contacts/${contact.nin}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'same-origin',
      body: JSON.stringify(contact)
    });

    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static deleteContact(contact) {
    const request = new Request(`/api/contacts/${contact.nin}`, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }
}

export default ContactApi;
