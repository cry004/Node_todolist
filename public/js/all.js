import flatpickr from 'flatpickr';

const title = document.querySelector('.title');
const content = document.querySelector('.content');
const send = document.querySelector('.send');
const authorizeButton = document.getElementById('authorize_button');
const list = document.querySelector('.list');

send.addEventListener('click', e => {
  var strt = title.value;
  var strc = content.value;
  var date = new Date();
  if (strt == '') {
    alert('Please input your title!');
    return;
  }
  fetchData('/addTodo', {
    title: strt,
    content: strc,
    time: date.toLocaleString()
  });
  title.value = '';
  content.value = '';
});

list.addEventListener('click', function(e) {
  if (e.target.nodeName !== 'INPUT') {
    return;
  } else {
    var id = e.target.dataset.id;
    fetchData('/delTodo', { id: id });
  }
});

function fetchData(path, body) {
  fetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(res => {
      var str = '';
      var data = res.result;
      for (let item in data) {
        str += `<li class="list-group-item" style="overflow: auto">
            <a href="user/${item}">標題： ${data[item].title}<br/>
            <span>建立於： ${data[item].time}</span></a>
            <input data-id="${item}" type="button" class="btn btn-default pull-right" value="Delete"></li>`;
      }
      list.innerHTML = str;
    });
}

import './google.js';
