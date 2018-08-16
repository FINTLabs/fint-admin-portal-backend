
class ComponentApi {

  static fetchComponents() {
    const url = `/api/components`;
    return fetch(url,
      {
        method: 'GET',
        credentials: 'same-origin'
      },
    ).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    })
  }

  static getComponents() {
    const url = `/api/components`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    })
      .then(response => Promise.all([response, response.json()]));
  }

  static createComponent(component) {
    const url = `/api/components`;
    const request = new Request(url, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(component)
    });

    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static updateComponent(component) {
    const url = `/api/components/${component.name}`;
    const request = new Request(url, {
      method: 'PUT',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(component)
    });

    return fetch(request).then(response => {
      return response;
    }).catch(error => {
      return error;
    });
  }

  static deleteComponent(component) {
    const url = `/api/components/${component.name}`;
    const request = new Request(url, {
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

export default ComponentApi
