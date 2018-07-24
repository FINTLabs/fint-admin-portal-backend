import {apiUrl} from "./apiUrl";

class MeApi {

  static getMe() {
    const url = apiUrl + `/api/me`;
    return fetch(url, {
      method: 'GET',
      credentials: 'same-origin'
    })
      .then((response) => {
        return response.json();
      });
  }
}

export default MeApi;
