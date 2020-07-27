const axios = require('axios');
const onChange = require('on-change');

const routes = {
  smallData: () => 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}',
  bigData: () => 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}',
};

const app = () => {
  
  const state = {
    dataSet: null,
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


  const watchedData = onChange(state, () => renderRows(watchedData.dataSet));
  const userChoose = confirm('Do you want see all data? If no - press "cancel"');
  const getData = (choose) => {
    if (choose) {
      axios.get(routes.bigData())
        .then((response) => {
          watchedData.dataSet = response.data;
        });
      return;
    }
    axios.get(routes.smallData())
      .then((response) => {
        watchedData.dataSet = response.data;
      });
  };
  getData(userChoose);


  
  




};

app();