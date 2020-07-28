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

  const handlers = {
    changeInputMode: (e) => {
      e.preventDefault();
      state.inputMode = true;
    },
    submit: (e) => {
      e.preventDefault();
      state.dataSet.unshift(state.inputState);
      state.inputMode = false;
    },
    input: (e) => {
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
    },
  };

  const renderRows = (data) => {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
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
      form.removeEventListener('submit', handlers.changeInputMode);
      const button = form.querySelector('button');
      
      form.addEventListener('input', handlers.input);
      form.addEventListener('submit', handlers.submit);
      return;
    }
    else {
      form.innerHTML = content.addButton;
      form.removeEventListener('submit', handlers.submit);
      form.removeEventListener('input', handlers.input);
      form.addEventListener('submit', handlers.changeInputMode);
    }
  };


  watch(state, 'inputMode', () => renderInput());
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

  form.addEventListener('submit', handlers.changeInputMode);


};





app();