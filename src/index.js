const axios = require('axios');
const WatchJS = require("melanke-watchjs")
const { watch } = WatchJS;
const content = require('./templates.js');

const routes = {
  smallData: () => 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}',
  bigData: () => 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}',
};

const app = () => {

  const state = {
    dataSet: null,
    inputMode: false,
    inputState: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }
  };

  const renderRows = (data) => {
    const tableBody = document.querySelector('tbody');
    data.forEach((person) => {
      const row = document.createElement('tr');
      tableBody.append(row);
      const keys = Object.keys(person);
      for (const key of keys) {
        if (key === 'address') {
          break;
        }
        const td = document.createElement('td');
        td.textContent = person[key];
        row.append(td);
      }
    });
  };
  const renderInput = () => {
    const form = document.querySelector('form');
    if (state.inputMode) {
      form.innerHTML = content.inputForm;
      const button = form.querySelector('button');
      button.setAttribute('disabled', '');
      form.removeEventListener('submit', handleForm);
      form.addEventListener('input', (e) => {
        const fieldName = e.target.name;
        const data = new FormData(e.currentTarget).get(fieldName);
        switch (fieldName) {
          case 'id':
            state.inputState.id = data;
            break;
          case 'firstName':
            state.inputState.firstName = data;
            break;
          case 'lastName':
            state.inputState.lastName = data;
            break;
          case 'email':
            state.inputState.email = data;
            break;
          case 'phone':
            state.inputState.phone = data;
        }
      });
      return;
    }
    else {

    }
  };


  watch(state, 'inputMode', () => renderInput())
  watch(state, 'dataSet', () => renderRows(state.dataSet));



  const userChoose = confirm('Do you want see all data? If no - press "cancel"');
  const getData = (choose) => {
    if (choose) {
      axios.get(routes.bigData())
        .then((response) => {
          state.dataSet = response.data;
        });
      return;
    }
    axios.get(routes.smallData())
      .then((response) => {
        state.dataSet = response.data;
      });
  };
  getData(userChoose);

  const form = document.querySelector('form');
  const handleForm = (e) => {
    e.preventDefault();
    state.inputMode = true;
  };
  form.addEventListener('submit', handleForm);


  
};

app();