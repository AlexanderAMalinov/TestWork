const axios = require('axios');
const WatchJS = require('melanke-watchjs');
const content = require('./templates.js');

const { watch } = WatchJS;

const routes = {
  smallData: () => 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}',
  bigData: () => 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}',
};

const app = () => {
  const state = {
    dataSet: null,
    currentData: null,
    inputMode: false,
    inputState: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    selectedPerson: null,
    sortOrder: {
      by: null,
      desc: false,
    },
    pagination: {
      activePage: 1,
      pageSize: 50,
      countOfPages: null,
    },
  };

  const handlers = {
    changeInputMode: (e) => {
      e.preventDefault();
      state.inputMode = true;
    },
    submit: (e) => {
      e.preventDefault();
      state.dataSet.unshift(state.inputState);
      state.inputState = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      };
      state.inputMode = false;
    },
    input: (e) => {
      const fieldName = e.target.name;
      const data = new FormData(e.currentTarget);
      const fieldData = data.get(fieldName);
      switch (fieldName) {
        case 'id':
          state.inputState.id = fieldData;
          break;
        case 'firstName':
          state.inputState.firstName = fieldData;
          break;
        case 'lastName':
          state.inputState.lastName = fieldData;
          break;
        case 'email':
          state.inputState.email = fieldData;
          break;
        case 'phone':
          state.inputState.phone = fieldData;
      }
      let allFieldsFull = true;
      data.forEach((item) => {
        if (item === '') {
          allFieldsFull = false;
        }
      });
      const button = e.currentTarget.querySelector('button');
      if (allFieldsFull) {
        button.removeAttribute('disabled');
      } else if (!allFieldsFull) {
        button.hasAttribute('disabled') ? null : button.setAttribute('disabled', '');
      }
    },
  };

  const renderPagination = () => {
    const container = document.querySelector('.pagination');
    container.innerHTML = '';
    state.pagination.countOfPages = Math.ceil(state.currentData.length / state.pagination.pageSize);
    for (let start = 1; start <= state.pagination.countOfPages; start += 1) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (start === state.pagination.activePage) {
        li.classList.add('active');
      }
      const link = document.createElement('a');
      link.classList.add('page-link');
      link.setAttribute('href', '#');
      link.textContent = String(start);
      li.append(link);
      container.append(li);
      link.addEventListener('click', (e) => {
        const numOfLink = Number(e.target.textContent);
        state.pagination.activePage = numOfLink;
      });
    }
  };
  const renderRows = (data) => {
    renderPagination();
    const begin = ((state.pagination.activePage - 1) * state.pagination.pageSize);
    const end = begin + state.pagination.pageSize;
    const preparedData = data.slice(begin, end);

    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    preparedData.forEach((person) => {
      const row = document.createElement('tr');
      tableBody.append(row);
      const keys = Object.keys(person);
      for (const key of keys) {
        if (key === 'address') {
          break;
        }
        const td = document.createElement('td');
        td.textContent = person[key];
        td.setAttribute('name', key);
        row.append(td);
      }
    });
  };
  const renderInput = () => {
    const form = document.querySelector('form[data-role="add"]');

    if (state.inputMode) {
      form.innerHTML = content.inputForm;
      form.removeEventListener('submit', handlers.changeInputMode);
      form.addEventListener('input', handlers.input);
      form.addEventListener('submit', handlers.submit);
    } else {
      form.innerHTML = content.addButton;
      form.removeEventListener('submit', handlers.submit);
      form.removeEventListener('input', handlers.input);
      form.addEventListener('submit', handlers.changeInputMode);
    }
  };
  const renderDescription = () => {
    const container = document.querySelector('div[data-role="description"]');
    container.innerHTML = '';
    const { firstName, lastName } = state.selectedPerson;
    const personAddress = state.selectedPerson.address;
    container.innerHTML = `Selected user: <b>${firstName} ${lastName}</b>
    <p>Description:</p>
    <textarea style="width: 400px; height: 100px">${state.selectedPerson.description}</textarea>
    <p>Street address: <b>${personAddress.streetAddress}</b></p>
    <p>City: <b>${personAddress.city}</b></p>
    <p>State: <b>${personAddress.state}</b></p>
    <p>Zip: <b>${personAddress.zip}</b></p>`;
  };
  const renderTableHeader = () => {
    const headerRow = document.querySelector('thead').querySelector('tr');
    const heads = headerRow.querySelectorAll('a');
    heads.forEach((head) => {
      const headName = head.dataset.name;
      head.textContent = `${headName} (unsorted)`;
    });
    const choisenHead = document.querySelector(`a[data-name="${state.sortOrder.by}"]`);
    choisenHead.textContent = `${choisenHead.dataset.name} (${state.sortOrder.desc === false ? 'asc' : 'desc'})`;
  };

  // Watch for render parts of DOM, if state changes
  watch(state, 'selectedPerson', () => renderDescription());
  watch(state, 'inputMode', () => renderInput());
  watch(state, 'dataSet', () => renderRows(state.dataSet));
  watch(state, 'currentData', () => renderRows(state.currentData));
  watch(state, 'sortOrder', () => renderTableHeader());
  watch(state.pagination, 'activePage', () => renderRows(state.currentData));

  const userChoise = confirm('Do you want see all data? If no - press "cancel"');
  const getData = (choose) => {
    if (choose) {
      axios.get(routes.bigData())
        .then((response) => {
          state.dataSet = response.data;
          state.currentData = response.data;
        });
      return;
    }
    axios.get(routes.smallData())
      .then((response) => {
        state.dataSet = response.data;
        state.currentData = response.data;
      });
  };
  getData(userChoise);

  const form = document.querySelector('form[data-role="add"]');
  form.addEventListener('submit', handlers.changeInputMode);

  const filterForm = document.querySelector('form[data-role="filter"]');
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target).get('filter');
    state.currentData = state.dataSet.filter((person) => {
      const keys = Object.keys(person);
      for (const key of keys) {
        if (key === 'address') {
          break;
        }
        if (String(person[key]).includes(formData)) {
          return true;
        }
      }
      return false;
    });
  });

  const bodyOfTable = document.querySelector('tbody');
  bodyOfTable.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    const clickedId = row.querySelector('td[name="id"]').textContent;
    let personInfo = null;
    state.dataSet.forEach((person) => {
      if (String(person.id) === clickedId) {
        personInfo = person;
      }
    });
    state.selectedPerson = personInfo;
  });

  const headOfTable = document.querySelector('thead');
  const links = headOfTable.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const { name } = e.target.dataset;
      const { by, desc } = state.sortOrder;
      state.sortOrder = {
        desc: by === name ? !desc : false,
        by: name,
      };
      if (!state.sortOrder.desc) {
        state.currentData.sort((a, b) => String(a[name]).localeCompare(String(b[name]), 'en', { numeric: true }));
        return;
      }
      state.currentData.sort((a, b) => String(b[name]).localeCompare(String(a[name]), 'en', { numeric: true }));
    });
  });
};

app();
